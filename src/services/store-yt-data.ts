import {
  insertIntoChannelsReturnID,
  insertIntoVideos,
  checkUniqueness,
} from "../database-access/db-queries";

interface dataYT {
  title: string;
  date: Date;
  channelTitle: string;
  id?: number;
}

export async function storeData(dataYT: dataYT[]): Promise<void> {
  let channel_id: number;
  const table: string = "channels";
  const column: string = "channel_name";
  console.log(dataYT);
  try {
    await Promise.all(
      dataYT.map(async ({ title, date, channelTitle }) => {
        const uniquenessValue: number = await checkUniqueness(
          table,
          column,
          channelTitle,
        );
        channel_id = uniquenessValue
          ? uniquenessValue
          : await insertIntoChannelsReturnID(channelTitle);

        await insertIntoVideos(title, date, channel_id);
      }),
    );
  } catch (err) {
    throw err;
  }
}
