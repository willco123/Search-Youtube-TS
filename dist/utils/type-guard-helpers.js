"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotNullOrZero = exports.removeNullFromObjectPropsTG = exports.arrayTypeGuard = void 0;
function arrayTypeGuard(query) {
    if (Array.isArray(query))
        return query[0];
    throw new Error("Array not found");
}
exports.arrayTypeGuard = arrayTypeGuard;
function removeNullFromObjectPropsTG(query) {
    for (let key of Object.keys(query)) {
        if (key === undefined) {
            throw new Error("Value is undefined");
        }
    }
    return query;
}
exports.removeNullFromObjectPropsTG = removeNullFromObjectPropsTG;
function isNotNullOrZero(val) {
    return val !== undefined && val !== null;
}
exports.isNotNullOrZero = isNotNullOrZero;
