"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayTypeGuard = void 0;
function arrayTypeGuard(query) {
    if (Array.isArray(query))
        return query[0];
    throw new Error("Array not found");
}
exports.arrayTypeGuard = arrayTypeGuard;
