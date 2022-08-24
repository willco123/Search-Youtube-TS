import {
  insertIntoChannelsReturnID,
  insertIntoVideos,
  checkUniqueness,
} from "../database-access/db-queries";

import { getOnlyChannelNamesNoDuplicates } from "../utils/function-helpers";
import { dataYT, insertChannelVideos } from "./types";

export async function storeData(dataYT: dataYT[]): Promise<void> {
  try {
    const channelNames = await insertChannel(dataYT);
    await insertVideos(dataYT, channelNames);
  } catch (err) {
    throw err;
  }
}

async function insertChannel(dataYT: dataYT[]) {
  let channelID: number;
  const table: string = "channels";
  const column: string = "channel_name";

  try {
    const channelNames = getOnlyChannelNamesNoDuplicates(dataYT);
    await Promise.all(
      channelNames.map(async ({ channelName }, index) => {
        const uniquenessValue: number = await checkUniqueness(
          table,
          column,
          channelName,
        );
        channelID = uniquenessValue
          ? uniquenessValue
          : await insertIntoChannelsReturnID(channelName);
        channelNames[index].channelID = channelID;
      }),
    );
    return channelNames;
  } catch (err) {
    throw err;
  }
}

async function insertVideos(
  dataYT: dataYT[],
  channelNames: insertChannelVideos[],
) {
  try {
    await Promise.all(
      dataYT.map(async ({ title, date, channelName }) => {
        const channelNameID = channelNames.find(
          (item) => item.channelName === channelName,
        );
        const channelID = channelNameID?.channelID;
        if (channelID === undefined) return "No channel id found";
        await insertIntoVideos(title, date, channelID);
      }),
    );
  } catch (err) {
    throw err;
  }
}
