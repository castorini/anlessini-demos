import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import ErrorBoundary from 'react-error-boundary';

import { PageWrapper, PageContent, Heading2 } from '../../../shared/Styles';
import Loading from '../../common/Loading';
import AclSearchResult from './AclSearchResult';
import Cord19SearchResult from './Cord19SearchResult';
import HomeText from './HomeText';
import SearchBar from './SearchBar';

import { tokenize, parseResponse } from '../../../shared/Util';
import {
  API_BASE,
  SEARCH_ENDPOINT,
  SearchVerticalOption,
  SERACH_VERTICAL_ACL,
  SERACH_VERTICAL_CORD19,
  getFilterSchema,
  Schema,
  getSearchVertical
} from '../../../shared/Constants';
import Filters from './Filters';
import { BaseArticle } from '../../../shared/Models';

const defaultFilter = {
  yearMinMax: [0, 0],
  authors: [],
  journals: [],
  sources: []
};

const getSearchFilters = (filterSchema: Schema, searchResults: any[] | null): any => {
  if (searchResults === null || searchResults.length === 0) {
    return defaultFilter;
  }

  let filterDictionary: any = {};
  const fields = Object.keys(filterSchema);
  // iterating through the fields in json
  fields.forEach(filter => {
    // checking the type of the field
    if (filterSchema[filter] == "slider"){
      let min = Number.MAX_VALUE;
      let max = -1;
      // filtering through each article
      searchResults.forEach(article => {
        if (article[filter] === undefined) return;
        // year for now but can change to a more arbitrary measurement
        const year = Number(article[filter].substr(0,4))
        min = Math.min(year, min);
        max = Math.max(year, max);
      })
      filterDictionary[filter] = min === max ? [min * 100 + 1, min * 100 + 12] : [min, max];
    } else if (filterSchema[filter] == "selection") {
      // initializing the list to store the selections
      filterDictionary[filter] = new Set([]);
      // filtering through each article
      searchResults.forEach(article => {
        if (article[filter] === undefined) return;
        if (article[filter] instanceof Array) {
          Array.from(article[filter]).forEach(elem => filterDictionary[filter].add(elem));
        } else {
          filterDictionary[filter].add(article[filter]);
        }
      })
      filterDictionary[filter] = Array.from(filterDictionary[filter].values()).filter((a: any) => a.length > 0);
    }
  })

  console.log(filterDictionary);
  return filterDictionary;
};

const filterArticles = (filterSchema: Schema, selectedFilters: any, article: BaseArticle): Boolean => {
  let article_status = true;
  const fields = Object.keys(selectedFilters);
  fields.forEach(field => {
    if (filterSchema[field] == "slider") {
      article_status = article_status && article[field] != "None" && Number(article[field].substr(0, 4)) >= selectedFilters[field][0] 
                       && Number(article[field].substr(0, 4)) <= selectedFilters[field][1]
    } else if (filterSchema[field] == "selection") {
      article_status = article_status && (selectedFilters[field].size == 0 || 
                       article[field].some((a: String) => selectedFilters[field].has(a)))
    }
  })

  return article_status;
}

const HomePage = () => {
  const urlParams = new URLSearchParams(useLocation().search);
  const query = urlParams.get('query') || '';
  const vertical = urlParams.get('vertical') || 'cord19';
  const [loading, setLoading] = useState<Boolean>(false);
  const [queryInputText, setQueryInputText] = useState<string>(query || '');
  const [selectedVertical, setSelectedVertical] = useState<SearchVerticalOption>(getSearchVertical(vertical));

  const [filters, setFilters] = useState<any>({});
  const [filterSchema, setFilterSchema] = useState<Schema>(getFilterSchema(selectedVertical));
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  const [queryId, setQueryId] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    setQueryInputText(query);
  }, [query]);

  useEffect(() => {
    setSelectedVertical(getSearchVertical(vertical));
    setFilterSchema(getFilterSchema(selectedVertical));
  }, [vertical]);

  useEffect(() => {
    const fetchData = async () => {
      if (query === null || query === '') {
        setLoading(false);
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        setSearchResults([]);

        let response = await fetch(
          `${API_BASE}${SEARCH_ENDPOINT}?query=${query.toLowerCase()}`,
        );
        setLoading(false);

        let data = await response.json();

        let { query_id, response:searchResults } = data;

        // converting the searchResults into json
        searchResults = searchResults.map(JSON.parse).map((data: any) => parseResponse(data, selectedVertical));
        const filters = getSearchFilters(filterSchema, searchResults);

        let defaultSelectionFilter: any = {}
        const fields = Object.keys(filterSchema);
        fields.forEach(field => {
          if (filterSchema[field] == "slider") {
            defaultSelectionFilter[field] = filters[field];
          }else if (filterSchema[field] == "selection") {
            defaultSelectionFilter[field] = new Set([]);
          }
        });
        setQueryId(query_id);
        setSearchResults(searchResults);
        setSelectedFilters(defaultSelectionFilter);
        setFilters(filters);

      } catch(e) {
        console.log(e);
        setLoading(false);
        setSearchResults([]);
      }
    };
    fetchData();
  }, [query, vertical]);

  const queryTokens = tokenize(query);
  const filteredResults =
    searchResults === null
      ? null
      : searchResults.filter(
          (article) => filterArticles(filterSchema, selectedFilters, article)
        );
  return (
    <PageWrapper>
      <PageContent>
        <SearchBar
          query={queryInputText}
          vertical={selectedVertical}
          setQuery={setQueryInputText}
          setVertical={setSelectedVertical}
        />
        <ErrorBoundary FallbackComponent={() => <NoResults>No results found</NoResults>}>
          {loading && <Loading />}
          <HomeContent>
            {!query && <HomeText />}
            {query && searchResults !== null && searchResults.length > 0 && (
              <Filters
                schema={filterSchema}
                filters={filters}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            )}
            {query &&
              filteredResults !== null &&
              (searchResults === null || filteredResults.length === 0 ? (
                <NoResults>No results found</NoResults>
              ) : (
                <>
                  <SearchResults>
                    {filteredResults.map((article, i) => (
                      <Cord19SearchResult
                        key={i}
                        article={article}
                        position={i}
                        queryTokens={queryTokens}
                        queryId={queryId}
                      />
                    ))}
                  </SearchResults>
                </>
              ))}
          </HomeContent>
        </ErrorBoundary>
      </PageContent>
    </PageWrapper>
  );
};

export default HomePage;

const HomeContent = styled.div`
  width: 100%;
  margin-right: auto;
  display: flex;

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.singleColumn}px) {
    flex-direction: column;
  }
`;

const NoResults = styled.div`
  ${Heading2}
  display: flex;
  margin-top: 16px;
  padding-bottom: 24px;
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
`;
