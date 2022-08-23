import {
  insertIntoChannelsReturnID,
  insertIntoVideos,
  checkUniqueness,
} from "../database-access/db-queries";

import { getOnlyChannelNamesNoDuplicates } from "../utils/function-helpers";
interface dataYT {
  title: string;
  date: Date;
  channelTitle: string;
  channel_id?: number;
}

interface insertChannelVideos {
  channelTitle: string;
  channel_id?: number;
}
export async function storeData(dataYT: dataYT[]): Promise<void> {
  try {
    const channelNames = await insertChannel(dataYT);
    await insertVideos(dataYT, channelNames);
  } catch (err) {
    throw err;
  }
}

async function insertChannel(dataYT: dataYT[]) {
  let channel_id: number;
  const table: string = "channels";
  const column: string = "channel_name";

  try {
    const channelNames = getOnlyChannelNamesNoDuplicates(dataYT);
    await Promise.all(
      channelNames.map(async ({ channelTitle: channel }, index) => {
        const uniquenessValue: number = await checkUniqueness(
          table,
          column,
          channel,
        );
        channel_id = uniquenessValue
          ? uniquenessValue
          : await insertIntoChannelsReturnID(channel);
        channelNames[index].channel_id = channel_id;
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
      dataYT.map(async ({ title, date, channelTitle }) => {
        const channelNameID = channelNames.find(
          (item) => item.channelTitle === channelTitle,
        );
        const channel_id = channelNameID?.channel_id;
        if (channel_id === undefined) return "No channel id found";
        await insertIntoVideos(title, date, channel_id);
      }),
    );
  } catch (err) {
    throw err;
  }
}
