"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
function getHash(obj) {
    if (obj === undefined || obj === null) {
        return 'null';
    }
    return obj.hash;
}
exports.getHash = getHash;
var ShapedArray = /** @class */ (function (_super) {
    __extends(ShapedArray, _super);
    function ShapedArray(shape) {
        var _this = _super.call(this) || this;
        _this.shape = shape;
        return _this;
    }
    return ShapedArray;
}(Array));
exports.ShapedArray = ShapedArray;
function shapeNumber(value) {
    if (value === null || value === undefined) {
        return null;
    }
    // Only number and string types can be shaped to numbers.
    if (typeof value === 'number') {
        return value;
    }
    else if (typeof value === 'string') {
        var num = Number(value);
        return num && num !== NaN ? num : null;
    }
    else {
        return null;
    }
}
exports.shapeNumber = shapeNumber;
function shapeString(value) {
    if (value === null || value === undefined) {
        return null;
    }
    // Strings, numbers and booleans can be shaped to strings.
    if (typeof value === 'number') {
        return value.toString();
    }
    else if (typeof value === 'string') {
        return value;
    }
    else if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }
    else {
        return null;
    }
}
exports.shapeString = shapeString;
function shapeBoolean(value) {
    if (value === null || value === undefined) {
        return null;
    }
    // Only Booleans and strings (where the string is 'true' or 'false') can be
    // shaped to booleans.
    if (typeof value === 'boolean') {
        return value;
    }
    else if (typeof value === 'string') {
        var trimmedLower = value.trim().toLowerCase();
        if (trimmedLower === 'true') {
            return true;
        }
        else if (trimmedLower === 'false') {
            return false;
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}
exports.shapeBoolean = shapeBoolean;
function shapeArray(arrayShape, arr) {
    if (arrayShape === null ||
        arrayShape === undefined ||
        arr === null ||
        arr === undefined) {
        return [];
    }
    if (!('shape' in arrayShape) && arrayShape.length === 0) {
        console.warn('Cannot shape array to an empty-array shape. Value:', arr);
        return [];
    }
    var shapeObj = 'shape' in arrayShape ? arrayShape.shape : arrayShape[0];
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        newArr.push(shapeAny(shapeObj, arr[i]));
    }
    return newArr;
}
exports.shapeArray = shapeArray;
function shapeAny(shape, value) {
    if (value === undefined) {
        return shape;
    }
    if (typeof shape === 'number') {
        return shapeNumber(value);
    }
    else if (typeof shape === 'string') {
        return shapeString(value);
    }
    else if (typeof shape === 'boolean') {
        return shapeBoolean(value);
    }
    else if (Array.isArray(shape)) {
        return shapeArray(shape, value);
    }
    else if (typeof shape === 'object') {
        // Shape each property of the object.
        var newObj = {};
        for (var prop in shape) {
            newObj[prop] =
                prop in value ? shapeAny(shape[prop], value[prop]) : shape[prop];
        }
        return newObj;
    }
    else {
        console.warn('Unable to shapeAny! Shape:', shape, ' Value:', value);
        return null;
    }
}
exports.shapeAny = shapeAny;
function getDeltaObject(original, final) {
    var shapedFinal = shapeAny(original, final);
    if (['number', 'string', 'boolean'].indexOf(typeof original) >= 0) {
        return original !== shapedFinal ? shapedFinal : null;
    }
    else if (Array.isArray(original)) {
        if (original.length !== shapedFinal.length) {
            return shapedFinal;
        }
        for (var i = 0; i < original.length; i++) {
            if (getDeltaObject(original[i], shapedFinal[i]) !== null) {
                return shapedFinal;
            }
        }
        return null;
    }
    else if (typeof original === 'object') {
        var obj = null;
        for (var prop in original) {
            var subDelta = getDeltaObject(original[prop], shapedFinal[prop]);
            if (subDelta !== null) {
                if (obj === null) {
                    obj = {};
                }
                obj[prop] = subDelta;
            }
        }
        return obj;
    }
    else {
        console.warn('I have no idea how I got here. Original', original, ' final:', final, ' shapedFinal:', shapedFinal);
        return null;
    }
}
exports.getDeltaObject = getDeltaObject;
