export interface ILongHash {
    hash: string;
}
export declare function getHash(obj: ILongHash | null): string;
export declare class ShapedArray<T> extends Array<T> {
    readonly shape: T;
    constructor(shape: T);
}
export declare function shapeNumber(value: any): number | null;
export declare function shapeString(value: any): string | null;
export declare function shapeBoolean(value: any): boolean | null;
export declare function shapeArray<T>(arrayShape: any[] | ShapedArray<any>, arr: T[]): T[];
export declare function shapeAny(shape: any, value: any): any | null;
export declare function getDeltaObject(original: any, final: any): any | null;
