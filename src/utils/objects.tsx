export interface ILongHash {
  hash: string;
}

export function getHash(obj: ILongHash | null): string {
  if (obj === undefined || obj === null) {
    return 'null';
  }
  return obj.hash;
}

export class ShapedArray<T> extends Array<T> {
  public constructor(public readonly shape: T) {
    super();
  }
}

export function shapeNumber(value: any): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  // Only number and string types can be shaped to numbers.
  if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'string') {
    const num = Number(value);
    return num && num !== NaN ? num : null;
  } else {
    return null;
  }
}

export function shapeString(value: any): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  // Strings, numbers and booleans can be shaped to strings.
  if (typeof value === 'number') {
    return value.toString();
  } else if (typeof value === 'string') {
    return value;
  } else if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  } else {
    return null;
  }
}

export function shapeBoolean(value: any): boolean | null {
  if (value === null || value === undefined) {
    return null;
  }
  // Only Booleans and strings (where the string is 'true' or 'false') can be
  // shaped to booleans.
  if (typeof value === 'boolean') {
    return value;
  } else if (typeof value === 'string') {
    const trimmedLower = value.trim().toLowerCase();
    if (trimmedLower === 'true') {
      return true;
    } else if (trimmedLower === 'false') {
      return false;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function shapeArray<T>(
  arrayShape: any[] | ShapedArray<any>,
  arr: T[]
): T[] {
  if (
    arrayShape === null ||
    arrayShape === undefined ||
    arr === null ||
    arr === undefined
  ) {
    return [];
  }
  if (!('shape' in arrayShape) && arrayShape.length === 0) {
    console.warn('Cannot shape array to an empty-array shape. Value:', arr);
    return [];
  }
  const shapeObj = 'shape' in arrayShape ? arrayShape.shape : arrayShape[0];
  const newArr: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    newArr.push(shapeAny(shapeObj, arr[i]));
  }
  return newArr;
}

export function shapeAny(shape: any, value: any): any | null {
  if (value === undefined) {
    return shape;
  }

  if (typeof shape === 'number') {
    return shapeNumber(value);
  } else if (typeof shape === 'string') {
    return shapeString(value);
  } else if (typeof shape === 'boolean') {
    return shapeBoolean(value);
  } else if (Array.isArray(shape)) {
    return shapeArray(shape, value);
  } else if (typeof shape === 'object') {
    // Shape each property of the object.
    const newObj: { [k: string]: any } = {};
    for (const prop in shape) {
      newObj[prop] =
        prop in value ? shapeAny(shape[prop], value[prop]) : shape[prop];
    }
    return newObj;
  } else {
    console.warn('Unable to shapeAny! Shape:', shape, ' Value:', value);
    return null;
  }
}

export function getDeltaObject(original: any, final: any): any | null {
  const shapedFinal = shapeAny(original, final);

  if (['number', 'string', 'boolean'].indexOf(typeof original) >= 0) {
    return original !== shapedFinal ? shapedFinal : null;
  } else if (Array.isArray(original)) {
    if (original.length !== shapedFinal.length) {
      return shapedFinal;
    }
    for (let i = 0; i < original.length; i++) {
      if (getDeltaObject(original[i], shapedFinal[i]) !== null) {
        return shapedFinal;
      }
    }
    return null;
  } else if (typeof original === 'object') {
    let obj: any | null = null;
    for (const prop in original) {
      const subDelta = getDeltaObject(original[prop], shapedFinal[prop]);
      if (subDelta !== null) {
        if (obj === null) {
          obj = {};
        }
        obj[prop] = subDelta;
      }
    }
    return obj;
  } else {
    console.warn(
      'I have no idea how I got here. Original',
      original,
      ' final:',
      final,
      ' shapedFinal:',
      shapedFinal
    );
    return null;
  }
}
