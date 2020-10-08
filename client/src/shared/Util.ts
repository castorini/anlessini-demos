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
      return {
        id: data["id"],
        contents: data["contents"],
        title: data["title"][0],
        abstract_html: data["abstract_html"][0],
        authors: data["authors"],
        year: data["year"][0],
        url: data["url"][0],
        venues: data["venues"],
        sigs: data["sigs"]
      } as BaseAclArticle
    }
    case SERACH_VERTICAL_CORD19.label: {
      return {
        id: data["id"],
        contents: data["contents"],
        abstract: data["abstract"][0],
        authors: data["authors"],
        journal: data["journal"][0],
        publish_time: data["publish_time"][0],
        source: data["source_x"],
        title: data["title"][0],
        url: data["url"][0]
      } as BaseCord19Article
    }
    default: {
      return {
        id: data["id"],
        contents: data["contents"]
      } as BaseArticle
    }
  }
}