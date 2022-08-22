"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CheckForQuery(query) {
    let isQuery;
    if (Object.keys(query).length === 0) {
        isQuery = false;
    }
    else {
        if (Object.values(query)[0].length === 0 ||
            Object.values(query)[0] === " " //resolved a typeerror issue
        ) {
            isQuery = false;
        }
        else {
            isQuery = true;
        }
    }
    return isQuery;
}
exports.default = CheckForQuery;
