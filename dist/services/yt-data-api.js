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
const apiKey = process.env.MYAPIKEY;
const youtube = googleapis_1.google.youtube({
    version: "v3",
    auth: apiKey,
});
let searchParams = {
    part: "snippet",
    type: "video",
    maxResults: 50,
};
/**
 *All phrases in string have to be in title
 */
function getSearchResults(searchArray) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i in searchArray) {
            const searchQuery = "allintitle:" + searchArray[i];
            searchParams.q = searchQuery;
            yield queryYoutube(searchParams);
        }
    });
}
exports.default = getSearchResults;
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
function appendPages(numberOfPages, response, nextPage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataYT = [];
            response.data.items.map((item) => dataYT.push({
                title: item.snippet.title,
                date: item.snippet.publishedAt.replace(/T|Z/g, " "),
                channelName: item.snippet.channelTitle,
            }));
            yield (0, store_yt_data_1.storeData)(dataYT);
            if (numberOfPages > 1) {
                nextPage = response.data.nextPageToken;
                searchParams.pageToken = nextPage;
                yield process.nextTick(() => { }); //fixes a jest open handle issue, something to do with axios
                response = yield youtube.search.list(searchParams);
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
