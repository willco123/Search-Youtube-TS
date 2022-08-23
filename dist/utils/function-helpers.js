"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnlyChannelNamesNoDuplicates = exports.checkForQuery = void 0;
function checkForQuery(query) {
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
exports.checkForQuery = checkForQuery;
/**
 * Filters out Title/Date from each indexes object, returns only unique channel names
 * @param {dataYT[]} dataYT
 */
function getOnlyChannelNamesNoDuplicates(dataYT) {
    const uniqueArr = [...new Set(dataYT.map((item) => item.channelTitle))];
    const uniqueObjArr = [];
    for (let i = 0; i < uniqueArr.length; i++) {
        uniqueObjArr.push({ channelTitle: uniqueArr[i] });
    }
    return uniqueObjArr;
}
exports.getOnlyChannelNamesNoDuplicates = getOnlyChannelNamesNoDuplicates;
