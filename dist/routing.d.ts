import * as React from 'react';
export interface UrlPatternOptions {
    escapeChar?: string;
    segmentNameStartChar?: string;
    segmentValueCharset?: string;
    segmentNameCharset?: string;
    optionalSegmentStartChar?: string;
    optionalSegmentEndChar?: string;
    wildcardChar?: string;
}
export declare class UrlPattern {
    private internalPattern;
    constructor(pattern: string, options?: UrlPatternOptions | string[]);
    match(url: string): any;
    stringify(values?: any): string;
}
export declare type UrlParamShape = {
    [key: string]: string;
};
export interface ReactParams<TUrlParams extends UrlParamShape, TUrlQuery> {
    urlParams: TUrlParams;
    urlQuery?: Partial<TUrlQuery>;
}
export declare abstract class Page<TUrlParams extends UrlParamShape = {}, TUrlQuery = {}> extends React.Component<ReactParams<TUrlParams, TUrlQuery>> {
    abstract title: string;
    abstract defaultQuery: TUrlQuery;
    abstract urlPattern: UrlPattern;
}
export declare type RouteEntry = (url: string) => Page | null | undefined;
export declare function StandardMatch(pageType: {
    new (props: any): Page;
}): RouteEntry;
export declare enum HistoryAction {
    None = 0,
    Push = 1,
    Replace = 2,
    Default = 1
}
export declare class Router {
    readonly entries: RouteEntry[];
    active: Page;
    constructor(entries: RouteEntry[]);
    goto<TUrlQuery>(page: Page<any, TUrlQuery>, historyAction?: HistoryAction): void;
    gotoUrl(url: string, historyAction?: HistoryAction): void;
    back(): void;
    forward(): void;
    static serializeQuery(defaultQuery: any, value: any): string;
    static deserializeQuery(value: string): any;
    private onPopState;
}
