import { OptionTypeBase } from 'react-select';
import filterSchemaACL from './filterSchema/filterSchemaACL.json'
import filterSchemaCord19 from './filterSchema/filterSchemaCord19.json'

/* Routes */
export const HOME_ROUTE = '/';
export const RELATED_ROUTE = '/related';

/* Breakpoints */
export const SMALL_MOBILE_BREAKPOINT = 425;
export const LARGE_MOBILE_BREAKPOINT = 600;
export const TABLET_BREAKPOINT = 800;

/* Styles */
export const CONTENT_WIDTH = 1100;

/* API */
export const API_BASE =
  process.env.NODE_ENV === 'development' ? 'https://iqlbtpcb4g.execute-api.us-west-2.amazonaws.com/Prod' : 'https://iqlbtpcb4g.execute-api.us-west-2.amazonaws.com/Prod';
export const SEARCH_ENDPOINT = '/search';
export const SEARCH_COLLAPSED_ENDPOINT = '/search/log/collapsed';
export const SEARCH_EXPANDED_ENDPOINT = '/search/log/expanded';
export const SEARCH_CLICKED_ENDPOINT = '/search/log/clicked';
export const RELATED_CLICKED_ENDPOINT = '/related/log/clicked';

export const RELATED_ENDPOINT = '/related';

/* Search Vertical Models */
export interface SearchVerticalOption extends OptionTypeBase {
  value: string;
  label: string;
}

export const SERACH_VERTICAL_ACL: SearchVerticalOption = { value: 'acl', label: 'ACL' };
export const SERACH_VERTICAL_CORD19: SearchVerticalOption = { value: 'cord19', label: 'CORD19'};

export const SEARCH_VERTICAL_OPTIONS: Array<SearchVerticalOption> = [
  SERACH_VERTICAL_ACL,
  SERACH_VERTICAL_CORD19
];

export const getSearchVertical = (label: string): SearchVerticalOption => {
  switch (label) {
    case 'acl': {
      return SERACH_VERTICAL_ACL;
    }
    case 'cord19': {
      return SERACH_VERTICAL_CORD19;
    }
    default: {
      return SERACH_VERTICAL_CORD19;
    }
  }
}

/* filter schema */
export interface Schema {
  [key: string]: any;
}

export const getFilterSchema = (vertical: SearchVerticalOption): Schema => {
  switch(vertical.label) {
    case SERACH_VERTICAL_ACL.label: {
      return filterSchemaACL as Schema;
    }
    case SERACH_VERTICAL_CORD19.label: {
      return filterSchemaCord19 as Schema;
    }
    default: {
      return {} as Schema;
    }
  }
}

/* NLTK Stopwords */
export const STOP_WORDS = new Set([
  'i',
  'me',
  'my',
  'myself',
  'we',
  'our',
  'ours',
  'ourselves',
  'you',
  'your',
  'yours',
  'yourself',
  'yourselves',
  'he',
  'him',
  'his',
  'himself',
  'she',
  'her',
  'hers',
  'herself',
  'it',
  'its',
  'itself',
  'they',
  'them',
  'their',
  'theirs',
  'themselves',
  'what',
  'which',
  'who',
  'whom',
  'this',
  'that',
  'these',
  'those',
  'am',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'having',
  'do',
  'does',
  'did',
  'doing',
  'a',
  'an',
  'the',
  'and',
  'but',
  'if',
  'or',
  'because',
  'as',
  'until',
  'while',
  'of',
  'at',
  'by',
  'for',
  'with',
  'about',
  'against',
  'between',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'to',
  'from',
  'up',
  'down',
  'in',
  'out',
  'on',
  'off',
  'over',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'any',
  'both',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  's',
  't',
  'can',
  'will',
  'just',
  'don',
  'should',
  'now',
]);
