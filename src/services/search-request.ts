import {
  searchDBFromTable,
  getParentItemByFK,
  getChildItemsWithFK,
  searchVideosFromDB,
  searchChannelsFromDB,
} from "../database-access/db-queries";

interface channelResults {
  Videos: string[];
  Channel: string;
}

interface videoResults {
  Videos: string;
  UploadDate: Date;
  Channel: string;
}

export async function searchChannels(query: object): Promise<object> {
  try {
    const column = Object.keys(query)[0];
    const value = `%${Object.values(query)[0]}%`;
    const results = await searchChannelsFromDB(column, value);
    const output: channelResults[] = [];

    for (let { id: fk, channel_name: Channel } of results) {
      const videosWithFK = await getChildItemsWithFK("videos", "title", fk);
      output.push({ Channel: Channel, Videos: videosWithFK });
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
    for (let { title: Videos, channel_id: fk, date: UploadDate } of results) {
      console.log(fk);
      console.log("here");
      const channelName =
        fk === null
          ? "Null"
          : await getParentItemByFK("channels", "channel_name", fk);

      output.push({ Channel: channelName, Videos, UploadDate });
    }

    return output;
  } catch (err) {
    throw err;
  }
}
