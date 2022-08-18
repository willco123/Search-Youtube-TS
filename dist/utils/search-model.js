"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchArray = exports.searchParams = void 0;
const file_helpers_1 = require("./file-helpers");
exports.searchParams = {
    part: "snippet",
    type: "video",
    maxResults: 50,
};
exports.searchArray = (0, file_helpers_1.readFileSyncByLine)("search_filter");
