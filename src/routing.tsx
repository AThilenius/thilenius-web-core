import { action, observable } from 'mobx';
import * as qs from 'qs';
import * as React from 'react';
import UrlPatternInt = require('url-pattern');

import { getDeltaObject, shapeAny } from './utils/objects';

// Re-export UrlPatternOptions
export interface UrlPatternOptions {
  escapeChar?: string;
  segmentNameStartChar?: string;
  segmentValueCharset?: string;
  segmentNameCharset?: string;
  optionalSegmentStartChar?: string;
  optionalSegmentEndChar?: string;
  wildcardChar?: string;
}

// Re-export UrlPattern as a wrapper.
export class UrlPattern {
  private internalPattern: UrlPatternInt;

  public constructor(pattern: string, options?: UrlPatternOptions | string[]) {
    this.internalPattern = new UrlPatternInt(pattern, options as any);
  }

  match(url: string): any {
    return this.internalPattern.match(url);
  }

  stringify(values?: any): string {
    return this.internalPattern.stringify(values);
  }
}

export type UrlParamShape = { [key: string]: string };

export interface ReactParams<TUrlParams extends UrlParamShape, TUrlQuery> {
  urlParams: TUrlParams;
  urlQuery?: Partial<TUrlQuery>;
}

export abstract class Page<
  TUrlParams extends UrlParamShape = {},
  TUrlQuery = {}
> extends React.Component<ReactParams<TUrlParams, TUrlQuery>> {
  public abstract title: string;
  public abstract defaultQuery: TUrlQuery;
  public abstract urlPattern: UrlPattern;
}

export type RouteEntry = (url: string) => Page | null | undefined;

export function StandardMatch(pageType: {
  new (props: any): Page;
}): RouteEntry {
  const inst = new pageType({});
  return (url) => {
    const params = inst.urlPattern.match(url);
    if (!params) {
      return null;
    }
    return new pageType({ urlParams: params });
  };
}

export enum HistoryAction {
  None,
  Push,
  Replace,
  Default = Push,
}

export class Router {
  @observable
  public active!: Page;

  constructor(public readonly entries: RouteEntry[]) {
    window.onpopstate = this.onPopState.bind(this);
  }

  @action
  public goto<TUrlQuery>(
    page: Page<any, TUrlQuery>,
    historyAction = HistoryAction.Default
  ) {
    // Reshape the query as is it likely missing default fields.
    const query = shapeAny(page.defaultQuery, page.props.urlQuery);
    const newPage = page.constructor({
      urlParams: page.props.urlParams,
      urlQuery: query,
    });

    this.active = newPage;

    const pathname = this.active.urlPattern.stringify(page.props.urlParams);
    const urlStr =
      pathname +
      Router.serializeQuery(this.active.defaultQuery, page.props.urlQuery);

    // If the pathname didn't change, then it's always a history-replace.
    if (pathname === window.location.pathname) {
      window.history.replaceState(urlStr, page.title, urlStr);
      return;
    }

    switch (historyAction) {
      case HistoryAction.Push: {
        window.history.pushState(urlStr, page.title, urlStr);
        break;
      }
      case HistoryAction.Replace: {
        window.history.replaceState(urlStr, page.title, urlStr);
        break;
      }
      default:
        break;
    }
  }

  public gotoUrl(url: string, historyAction = HistoryAction.Default) {
    // Split the url
    const urlObj = new URL(url);

    // Trim start and end whitespace and slashes from pathname.
    const pathname =
      '/' + urlObj.pathname.replace(/^[\s\/]*/, '').replace(/[\s\/]*$/, '');

    const queryStr = urlObj.search.trim().replace(/^\?/, '');

    // Try to match it with any of the entries
    const entry = this.entries.map((e) => e(pathname)).find((e) => e);
    if (!entry) {
      console.error('No route matched the url:', url);
      return;
    }

    // Deserialize the query and shape it
    let queryObj: any = {};
    try {
      if (queryStr !== '') {
        queryObj = Router.deserializeQuery(queryStr);
      }
    } catch (e) {
      console.warn('Failed to parse query string:', e);
    }
    const shapedQuery = shapeAny(entry.defaultQuery, queryObj);

    const props = { ...entry.props, urlQuery: shapedQuery };
    const newPage = entry.constructor(props);
    this.goto(newPage, historyAction);
  }

  public back() {
    window.history.back();
  }

  public forward() {
    window.history.forward();
  }

  public static serializeQuery(defaultQuery: any, value: any): string {
    const delta = getDeltaObject(defaultQuery, value);
    if (delta === null) {
      return '';
    }
    return '?' + qs.stringify(delta);
  }

  public static deserializeQuery(value: string): any {
    return qs.parse(value);
  }

  private onPopState(event: PopStateEvent) {
    this.gotoUrl(window.location.href);
  }
}
