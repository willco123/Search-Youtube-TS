import {
  getParentItemByFK,
  getChildItemsWithFK,
  searchVideosFromDB,
  searchChannelsFromDB,
} from "../database-access/db-queries";

interface channelResults {
  id: number;
  titles: string[];
  channel_name: string;
}

interface videoResults {
  id: number;
  title: string;
  date: Date;
  channel_name: string;
  channel_id: number;
}

export async function searchChannels(query: object): Promise<object> {
  try {
    const column = Object.keys(query)[0];
    // const value = `%${Object.values(query)[0]}%`;
    const searchTerms = Object.values(query)[0].split(" ").join("|");
    const results = await searchChannelsFromDB(column, searchTerms);
    const output: channelResults[] = [];

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
    const value = `%${Object.values(query)[0]}%`;
    const results = await searchVideosFromDB(column, value);
    const output: videoResults[] = [];
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
