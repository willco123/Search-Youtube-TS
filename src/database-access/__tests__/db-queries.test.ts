import "dotenv/config";
import db from "../../config/db";
import { videoResults, channelResults, searchResults } from "../types";
import {
  useTestDB,
  endDB,
  createMockDBData,
  clearDB,
  populateDB,
  testDataYT,
} from "../../tests/async-test-helpers";
import * as dbQueries from "../db-queries";

const mockDBData: testDataYT[] = createMockDBData();
let myMock: jest.SpyInstance;

const singleMockUser: testDataYT = {
  title: "Title Four",
  date: new Date("2022-02-02"),
  channel_name: "Channel Four",
};

beforeAll(async () => {
  await useTestDB();
});

afterAll(async () => {
  await endDB();
});

beforeEach(async () => {
  await clearDB();
  await populateDB(mockDBData);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("DB QUERIES", () => {
  test("Insert a channel get its id, insert and search for a video", async () => {
    let { title, date, channel_name } = singleMockUser;
    let channel_id = await dbQueries.insertIntoChannelsReturnID(channel_name);
    const myChannel = await dbQueries.getItemByIDFromTable(
      "channels",
      channel_id,
    );
    expect(myChannel).toMatchObject({
      id: channel_id,
      channel_name: channel_name,
    });
    await dbQueries.insertIntoVideos(title, date, channel_id);
    const myVideo = await dbQueries.searchVideosFromDB("title", title);
    expect(myVideo[0].title).toMatch(title);
  });
  test("checkUniqueness, matching record should return id, search for a channel", async () => {
    const [myChannel] = await dbQueries.searchChannelsFromDB(
      "channel_name",
      "Channel One",
    );
    const channelId = await dbQueries.checkUniqueness(
      "channels",
      "channel_name",
      "Channel One",
    );
    const searchedChannelId = myChannel.id;
    expect(channelId).toBeGreaterThan(0);
    expect(channelId).toEqual(searchedChannelId);
  });
  test("checkUniqueness, no matching record", async () => {
    const channelId = await dbQueries.checkUniqueness(
      "channels",
      "channel_name",
      "Channel Unknown",
    );

    expect(channelId).toEqual(0);
  });
  test("Search for a channel, no record found", async () => {
    const [myChannel] = await dbQueries.searchChannelsFromDB(
      "channel_name",
      "Channel Not Here",
    );
    expect(myChannel === undefined).toBe(true);
  });
  test("Search for a video, no record found", async () => {
    const [myVideo] = await dbQueries.searchVideosFromDB(
      "title",
      "Title Not Here",
    );
    expect(myVideo === undefined).toBe(true);
  });

  test("Get all from table", async () => {
    const results = await dbQueries.getAllFromTable("videos");
    const filteredResults = results.forEach(({ title, date }) => ({
      title,
      date,
    }));
    const filteredMockData = mockDBData.forEach(({ title, date }) => ({
      title,
      date,
    }));

    expect(filteredMockData).toEqual(filteredResults);
  });
  test("insertIntoChannelsReturnID Throw Error", async () => {
    await expect(async () => {
      await dbQueries.insertIntoChannelsReturnID("Channel One");
    }).rejects.toThrow();
  });

  test("deleteItemByIDFromTable Delete a video", async () => {
    let myVideo = await dbQueries.searchVideosFromDB("title", "Title One");
    const videoId = myVideo[0].id;
    let isDeleted = await dbQueries.deleteItemByIDFromTable("videos", videoId);
    myVideo = await dbQueries.searchVideosFromDB("title", "Title One");
    expect(myVideo).toEqual([]);
    expect(isDeleted).toBe(true);
    isDeleted = await dbQueries.deleteItemByIDFromTable("videos", videoId);
    expect(isDeleted).toBe(false);
  });
  test("searchDBFromTable", async () => {
    //could be more verbose here, though func is currently unused
    const results = await dbQueries.searchDBFromTable(
      "videos",
      "title",
      "Title One",
    );
    expect(results[0].title).toEqual("Title One");
  });
  test("getParentItemByFK", async () => {
    const myVideo = await dbQueries.searchVideosFromDB("title", "Title One");
    const fk = myVideo[0].channel_id;
    const parentItem = await dbQueries.getParentItemByFK(
      "channels",
      "channel_name",
      fk,
    );
    expect(parentItem).toEqual("Channel One");
  });
  test("getChildItemsWithFK", async () => {
    const [myChannel] = await dbQueries.searchChannelsFromDB(
      "channel_name",
      "Channel One",
    );
    const fk = myChannel.id;
    const childItems = await dbQueries.getChildItemsWithFK(
      "videos",
      "title",
      fk,
    );
    expect(childItems[0]).toEqual("Title One");
  });

  // test("Test Catch Blocks", async () => {
  //   myMock = jest.spyOn(db, "query").mockImplementation(() => {
  //     throw new Error();
  //   });
  //   await expect(async () => {
  //     await dbQueries.insertIntoVideos("title", new Date(), 1);
  //   }).rejects.toThrow();
  //   await expect(async () => {
  //     await dbQueries.checkUniqueness("videos", "channel_name", "Channel One");
  //   }).rejects.toThrow();
  //   await expect(async () => {
  //     await dbQueries.getChildItemsWithFK("videos", "title", 1);
  //   }).rejects.toThrow();
  //   await expect(async () => {
  //     await dbQueries.getParentItemByFK("channels", "channel_name", 1);
  //   }).rejects.toThrow();
  //   await expect(async () => {
  //     await dbQueries.searchVideosFromDB("title", "A False Title");
  //   }).rejects.toThrow();
  //   await expect(async () => {
  //     await dbQueries.searchDBFromTable("videos", "title", "A title");
  //   }).rejects.toThrow();
  //   await expect(async () => {
  //     await dbQueries.searchChannelsFromDB("channel_name", "A channel");
  //   }).rejects.toThrow();
  //   await expect(async () => {
  //     await dbQueries.deleteItemByIDFromTable("videos", 1);
  //   }).rejects.toThrow();
  //   await expect(async () => {
  //     await dbQueries.getAllFromTable("videos");
  //   }).rejects.toThrow();
  //   await expect(async () => {
  //     await dbQueries.getItemByIDFromTable("videos", 1);
  //   }).rejects.toThrow();
  // });
});
