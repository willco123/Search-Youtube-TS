import { google } from "googleapis";
import { storeData } from "./store-yt-data";

import { searchParams, searchArray } from "../utils/search-model";

const apiKey = process.env.MYAPIKEY;
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

interface dataYT {
  title: string;
  date: Date;
  channelTitle: string;
  id?: number;
}

// interface searchParamsInterface {
//   part: string;
//   type: string;
//   maxResults: number;
//   q?: string;
// }

async function appendPages(
  numberOfPages: number,
  response: any,
  nextPage: string | undefined,
): Promise<void> {
  try {
    const dataYT: any = [];
    //should we await promise from map here?
    response.data.items.map((item: any) =>
      dataYT.push({
        title: item.snippet.title,
        date: item.snippet.publishedAt.replace(/T|Z/g, " "),
        channelTitle: item.snippet.channelTitle,
      }),
    );
    console.log(dataYT);
    await storeData(dataYT as dataYT[]);

    if (numberOfPages > 1) {
      nextPage = response.data.nextPageToken;
      console.log(nextPage);
      searchParams.pageToken = nextPage;
      await process.nextTick(() => {}); //fixes a jest open handle issue, something to do with axios
      response = await youtube.search.list(searchParams);

      numberOfPages = --numberOfPages;
      return await appendPages(numberOfPages, response, nextPage);
    } else {
      return;
    }
  } catch (err) {
    throw err;
  }
}

async function queryYoutube(searchParams: any) {
  try {
    await process.nextTick(() => {});
    let response = await youtube.search.list(searchParams);
    if (response.data.pageInfo == undefined) throw new Error("Bad Response");

    const totalResults = response.data.pageInfo.totalResults;
    const resultsPerPage = response.data.pageInfo.resultsPerPage;

    if (totalResults == undefined || resultsPerPage == undefined)
      throw new Error("No items found/ Bad search request");

    const numberOfPages =
      resultsPerPage === 0 ? 0 : Math.floor(totalResults / resultsPerPage);
    let nextPage: string | undefined;
    await appendPages(numberOfPages, response, nextPage);

    delete searchParams.pageToken;
  } catch (err: any) {
    throw err;
  }
}

export default async function getSearchResults() {
  //All phrases in string have to be in title
  for (let i in searchArray) {
    const searchQuery =
      "allintitle:" + searchArray[i as keyof typeof searchArray];
    searchParams.q = searchQuery;
    await queryYoutube(searchParams);
  }
}

async function getSearchResultsSpecific() {
  //Has to match the phrase exactly in order

  for (let i in searchArray) {
    const searchQuery =
      'intitle:"' + searchArray[i as keyof typeof searchArray] + '"';
    searchParams.q = searchQuery;
    await queryYoutube(searchParams);
  }
}
