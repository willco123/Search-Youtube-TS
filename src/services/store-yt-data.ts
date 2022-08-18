import {
  insertIntoChannelsReturnID,
  insertIntoVideos,
  checkUniqueness,
} from "../database-access/db-queries";

export async function storeData(dataYT: dataYT[]): Promise<void> {
  let id: number;
  try {
    await Promise.all(
      dataYT.map(async ({ title, date, channelTitle }) => {
        const uniquenessValue: number = await checkUniqueness(channelTitle);
        id = uniquenessValue
          ? uniquenessValue
          : await insertIntoChannelsReturnID(channelTitle);

        await insertIntoVideos(title, date, id);
      }),
    );
  } catch (err) {
    throw err;
  }
}
