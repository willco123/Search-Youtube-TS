import {google} from "googleapis"
import { storeData } from "./store-yt-data";

import { searchParams, searchArray } from "../utils/search-model");

const apiKey = process.env.MYAPIKEY;
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

async function queryRecur(numberOfPages, response, nextPage) {
  try {
    //if here

    const dataYT = [];
    response.data.items.map((item) =>
      dataYT.push({
        title: item.snippet.title,
        date: item.snippet.publishedAt.replace(/T|Z/g, " "),
        channelTitle: item.snippet.channelTitle,
      }),
    );
    await storeData(dataYT);

    if (numberOfPages > 1) {
      nextPage = response.data.nextPageToken;

      await process.nextTick(() => {}); //fixes a jest open handle issue, something to do with axios
      response = await youtube.search.list(searchParams);

      numberOfPages = --numberOfPages;
      return await QueryRecur(numberOfPages, response, nextPage);
    } else {
      return;
    }
  } catch (err) {
    throw err;
  }
}

async function queryYoutube(searchParams) {
  try {
    await process.nextTick(() => {});
    var response = await youtube.search.list(searchParams);

    const totalResults = response.data.pageInfo.totalResults;
    const resultsPerPage = response.data.pageInfo.resultsPerPage;
    const numberOfPages = Math.floor(totalResults / resultsPerPage);

    var nextPage = response.data.nextPageToken;

    await queryRecur(numberOfPages, response, nextPage);

    delete searchParams.pageToken;
  } catch (err) {
    if (err.code == 403) {
      throw err;
    } else {
      console.log(err.stack);
    }
  }
}

export default async function getSearchResults() {
  //All phrases in string have to be in title
  for (let i in searchArray) {
    searchQuery = "allintitle:" + searchArray[i];
    searchParams.q = searchQuery;
    await queryYoutube(searchParams);
  }
}

async function getSearchResultsSpecific() {
  //Has to match the phrase exactly in order
  for (let i in searchArray) {
    searchQuery = 'intitle:"' + searchArray[i] + '"';
    searchParams.q = searchQuery;
    await queryYoutube(searchParams);
  }
}
