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
;
const apiKey = process.env.MYAPIKEY;
const youtube = googleapis_1.google.youtube({
    version: "v3",
    auth: apiKey,
});
function queryRecur(numberOfPages, response, nextPage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //if here
            const dataYT = [];
            response.data.items.map((item) => dataYT.push({
                title: item.snippet.title,
                date: item.snippet.publishedAt.replace(/T|Z/g, " "),
                channelTitle: item.snippet.channelTitle,
            }));
            yield (0, store_yt_data_1.storeData)(dataYT);
            if (numberOfPages > 1) {
                nextPage = response.data.nextPageToken;
                yield process.nextTick(() => { }); //fixes a jest open handle issue, something to do with axios
                response = yield youtube.search.list(search_model_1.searchParams);
                numberOfPages = --numberOfPages;
                return yield QueryRecur(numberOfPages, response, nextPage);
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
            var response = yield youtube.search.list(searchParams);
            const totalResults = response.data.pageInfo.totalResults;
            const resultsPerPage = response.data.pageInfo.resultsPerPage;
            const numberOfPages = Math.floor(totalResults / resultsPerPage);
            var nextPage = response.data.nextPageToken;
            yield queryRecur(numberOfPages, response, nextPage);
            delete searchParams.pageToken;
        }
        catch (err) {
            if (err.code == 403) {
                throw err;
            }
            else {
                console.log(err.stack);
            }
        }
    });
}
function getSearchResults() {
    return __awaiter(this, void 0, void 0, function* () {
        //All phrases in string have to be in title
        for (let i in search_model_1.searchArray) {
            searchQuery = "allintitle:" + search_model_1.searchArray[i];
            search_model_1.searchParams.q = searchQuery;
            yield queryYoutube(search_model_1.searchParams);
        }
    });
}
exports.default = getSearchResults;
function getSearchResultsSpecific() {
    return __awaiter(this, void 0, void 0, function* () {
        //Has to match the phrase exactly in order
        for (let i in search_model_1.searchArray) {
            searchQuery = 'intitle:"' + search_model_1.searchArray[i] + '"';
            search_model_1.searchParams.q = searchQuery;
            yield queryYoutube(search_model_1.searchParams);
        }
    });
}
