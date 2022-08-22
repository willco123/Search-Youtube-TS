import {
  insertIntoChannelsReturnID,
  insertIntoVideos,
  checkUniqueness,
} from "../database-access/db-queries";

interface dataYT {
  title: string;
  date: Date;
  channelTitle: string;
  channel_id?: number;
}

export async function storeData(dataYT: dataYT[]): Promise<void> {
  let channel_id: number;
  const table: string = "channels";
  const column: string = "channel_name";

  try {
    const channelNames = getOnlyChannelNamesNoDuplicates(dataYT); //better if we somehow just do datayt.map and then pass in filtered array after, makes more sense
    console.log(channelNames);
    await Promise.all(
      channelNames.map(async (channel) => {
        const uniquenessValue: number = await checkUniqueness(
          table,
          column,
          channel,
        );
        channel_id = uniquenessValue
          ? uniquenessValue
          : await insertIntoChannelsReturnID(channel);
        dataYT.forEach((element, index) => {
          //probably slower than doing a simple for loop instead of async db calls, find better way to mutate dataYT.
          if (element.channelTitle === channel) {
            dataYT[index].channel_id = channel_id;
          }
        });
      }),
    );

    await Promise.all(
      dataYT.map(async ({ title, date, channel_id }) => {
        channel_id = <number>channel_id;
        await insertIntoVideos(title, date, channel_id);
      }),
    );
  } catch (err) {
    throw err;
  }
}

function getOnlyChannelNamesNoDuplicates(dataYT: dataYT[]): string[] {
  const filteredArray = dataYT.map((item) => item.channelTitle);
  const setFilteredArray = [...new Set(filteredArray)];
  return setFilteredArray;
}
