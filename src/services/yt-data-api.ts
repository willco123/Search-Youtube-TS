import { google } from "googleapis";
import { storeData } from "./store-yt-data";
import { dataYT } from "./types";

const apiKey = process.env.MYAPIKEY;
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});
let searchParams: any = {
  part: "snippet",
  type: "video",
  maxResults: 50,
};

/**
 *All phrases in string have to be in title
 */
export default async function getSearchResults(searchArray: string[]) {
  for (let i in searchArray) {
    const searchQuery =
      "allintitle:" + searchArray[i as keyof typeof searchArray];
    searchParams.q = searchQuery;
    await queryYoutube(searchParams);
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

async function appendPages(
  numberOfPages: number,
  response: any,
  nextPage: string | undefined,
): Promise<void> {
  try {
    const dataYT: any = [];
    response.data.items.map((item: any) =>
      dataYT.push({
        title: item.snippet.title,
        date: item.snippet.publishedAt.replace(/T|Z/g, " "),
        channelName: item.snippet.channelTitle,
      }),
    );
    await storeData(dataYT as dataYT[]);

    if (numberOfPages > 1) {
      nextPage = response.data.nextPageToken;
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
