"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const store_yt_data_1 = require("./store-yt-data");
const search_model_1 = require("../utils/search-model");
const apiKey = process.env.MYAPIKEY;
const youtube = googleapis_1.google.youtube({
    version: "v3",
    auth: apiKey,
});
function appendPages(numberOfPages, response, nextPage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataYT = [];
            response.data.items.map((item) => dataYT.push({
                title: item.snippet.title,
                date: item.snippet.publishedAt.replace(/T|Z/g, " "),
                channelTitle: item.snippet.channelTitle,
            }));
            yield (0, store_yt_data_1.storeData)(dataYT);
            if (numberOfPages > 1) {
                nextPage = response.data.nextPageToken;
                console.log(nextPage);
                search_model_1.searchParams.pageToken = nextPage;
                yield process.nextTick(() => { }); //fixes a jest open handle issue, something to do with axios
                response = yield youtube.search.list(search_model_1.searchParams);
                numberOfPages = --numberOfPages;
                return yield appendPages(numberOfPages, response, nextPage);
            }
            else {
                return;
            }
        }
        catch (err) {
            throw err;
        }
    });
}
function queryYoutube(searchParams) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield process.nextTick(() => { });
            let response = yield youtube.search.list(searchParams);
            if (response.data.pageInfo == undefined)
                throw new Error("Bad Response");
            const totalResults = response.data.pageInfo.totalResults;
            const resultsPerPage = response.data.pageInfo.resultsPerPage;
            if (totalResults == undefined || resultsPerPage == undefined)
                throw new Error("No items found/ Bad search request");
            const numberOfPages = resultsPerPage === 0 ? 0 : Math.floor(totalResults / resultsPerPage);
            let nextPage;
            yield appendPages(numberOfPages, response, nextPage);
            delete searchParams.pageToken;
        }
        catch (err) {
            throw err;
        }
    });
}
/**
 *All phrases in string have to be in title
 */
function getSearchResults() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i in search_model_1.searchArray) {
            const searchQuery = "allintitle:" + search_model_1.searchArray[i];
            search_model_1.searchParams.q = searchQuery;
            yield queryYoutube(search_model_1.searchParams);
        }
    });
}
exports.default = getSearchResults;
/**
 * Has to match the phrase exactly in order
 */
function getSearchResultsSpecific() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i in search_model_1.searchArray) {
            const searchQuery = 'intitle:"' + search_model_1.searchArray[i] + '"';
            search_model_1.searchParams.q = searchQuery;
            yield queryYoutube(search_model_1.searchParams);
        }
    });
}
