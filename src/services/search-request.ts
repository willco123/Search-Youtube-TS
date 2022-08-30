import {
  getParentItemByFK,
  getChildItemsWithFK,
  searchVideosFromDB,
  searchChannelsFromDB,
} from "../database-access/db-queries";
import {
  channelResults,
  videoResults,
  channelOutput,
  videoOutput,
} from "./types";

export async function searchChannels(query: object): Promise<channelOutput[]> {
  try {
    const column = Object.keys(query)[0];
    const searchTerms = Object.values(query)[0].split(" ").join(".+");
    const results = await searchChannelsFromDB(column, searchTerms);
    const output: channelOutput[] = [];

    for (let { id: fk, channel_name } of results) {
      const videosWithFK = await getChildItemsWithFK("videos", "title", fk);
      output.push({ id: fk, channel_name, titles: videosWithFK });
    }

    return output;
  } catch (err) {
    throw err;
  }
}

export async function searchVideos(query: object): Promise<object> {
  try {
    const column = Object.keys(query)[0];
    const searchTerms = Object.values(query)[0].split(" ").join(".+");
    const results = await searchVideosFromDB(column, searchTerms);
    const output: videoOutput[] = [];
    for (let { id, title, channel_id: fk, date } of results) {
      const channelName =
        fk === null
          ? "Null"
          : await getParentItemByFK("channels", "channel_name", fk);

      output.push({
        id,
        title,
        date,
        channel_name: channelName,
        channel_id: fk,
      });
    }

    return output;
  } catch (err) {
    throw err;
  }
}
