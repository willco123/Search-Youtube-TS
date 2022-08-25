"use strict";
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
async function getSearchResults(searchArray) {
    for (let i in searchArray) {
        const searchQuery = "allintitle:" + searchArray[i];
        searchParams.q = searchQuery;
        await queryYoutube(searchParams);
    }
}
exports.default = getSearchResults;
async function queryYoutube(searchParams) {
    try {
        await process.nextTick(() => { });
        let response = await youtube.search.list(searchParams);
        if (response.data.pageInfo == undefined)
            throw new Error("Bad Response");
        const totalResults = response.data.pageInfo.totalResults;
        const resultsPerPage = response.data.pageInfo.resultsPerPage;
        if (totalResults == undefined || resultsPerPage == undefined)
            throw new Error("No items found/ Bad search request");
        const numberOfPages = resultsPerPage === 0 ? 0 : Math.floor(totalResults / resultsPerPage);
        let nextPage;
        await appendPages(numberOfPages, response, nextPage);
        delete searchParams.pageToken;
    }
    catch (err) {
        throw err;
    }
}
async function appendPages(numberOfPages, response, nextPage) {
    try {
        const dataYT = [];
        response.data.items.map((item) => dataYT.push({
            title: item.snippet.title,
            date: item.snippet.publishedAt.replace(/T|Z/g, " "),
            channelName: item.snippet.channelTitle,
        }));
        await (0, store_yt_data_1.storeData)(dataYT);
        if (numberOfPages > 1) {
            nextPage = response.data.nextPageToken;
            searchParams.pageToken = nextPage;
            await process.nextTick(() => { }); //fixes a jest open handle issue, something to do with axios
            response = await youtube.search.list(searchParams);
            numberOfPages = --numberOfPages;
            return await appendPages(numberOfPages, response, nextPage);
        }
        else {
            return;
        }
    }
    catch (err) {
        throw err;
    }
}
