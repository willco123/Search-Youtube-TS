import {
  searchDBFromTable,
  getParentItemsByFK,
  getChildItemsWithFK,
} from "../database-access/db-queries";

export async function searchChannels(query) {
  try {
    const column = Object.keys(query)[0];
    const value = `%${Object.values(query)[0]}%`;
    const results = await searchDBFromTable("channels", column, value);

    for (let index in results) {
      const { id } = results[index];
      const videosWithFK = await getChildItemsWithFK("videos", "title", id);
      delete results[index].id;
      results[index]["Videos"] = videosWithFK;
    }

    return results;
  } catch (err) {
    throw err;
  }
}

export async function searchVideos(query) {
  try {
    const column = Object.keys(query)[0];
    const value = `%${Object.values(query)[0]}%`;
    const results = await searchDBFromTable("videos", column, value);

    for (let index in results) {
      const { channel_id } = results[index];
      const channelName = await getParentItemsByFK(
        "channels",
        "channel_name",
        channel_id,
      );
      delete results[index].id;
      delete results[index].channel_id;
      results[index]["Channel"] = channelName;
    }

    return results;
  } catch (err) {
    throw err;
  }
}
