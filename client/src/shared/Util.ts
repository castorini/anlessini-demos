import { STOP_WORDS, SearchVerticalOption, SERACH_VERTICAL_ACL, SERACH_VERTICAL_CORD19 } from './Constants';
import { BaseArticle, BaseCord19Article, BaseAclArticle } from './Models';

/* Tokenize words without stopwords and split by punctuation */
export const tokenize = (text: string): Array<string> => {
  let results: Array<string> = [];
  let words = text
    .toLowerCase()
    .replace(/[^\w\s]|_/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ');

  words.forEach((word) => {
    if (!STOP_WORDS.has(word)) {
      results.push(word);
    }
  });
  return results;
};

export const makePOSTRequest = (url: string, data: Object) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const makeAsyncPOSTRequest = async (url: string, body: Object) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

// Remove "abstract" string from beginning of abstract
export const parseAbstract = (abstract: string): string => {
  return abstract.replace(/^\s*abstract\s*/gi, '');
};

export const parseResponse = (data: any, verticle: SearchVerticalOption): BaseArticle => {
  switch(verticle.label) {
    case SERACH_VERTICAL_ACL.label: {
      const {id, contents, title, abstract_html, authors, year, url, venues, sigs, ...others} = data;
      return {
        id: id,
        contents: contents,
        title: title[0],
        abstract_html: abstract_html[0],
        authors: authors,
        year: year[0],
        url: url[0],
        venues: venues,
        sigs: sigs,
        ...others
      } as BaseAclArticle
    }
    case SERACH_VERTICAL_CORD19.label: {
      const {id, contents, abstract, authors, journal, publish_time, source_x, title, url, ...others} = data;
      return {
        id: id,
        contents: contents,
        abstract: abstract[0],
        authors: authors,
        journal: journal[0],
        publish_time: publish_time[0],
        source: source_x,
        title: title[0],
        url: url[0],
        ...others
      } as BaseCord19Article
    }
    default: {
      const {id, contents, ...others} = data;
      return {
        id: id,
        contents: contents,
        ...others
      } as BaseArticle
    }
  }
}