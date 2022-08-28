import "dotenv/config";
import db from "../../config/db";
import { videoResults, channelResults, searchResults } from "../types";
import {
  useTestDB,
  endDB,
  createMockData,
  clearDB,
  populateDB,
  testDataYT,
} from "../../tests/test-helpers";
import * as dbQueries from "../db-queries";

const mockUsers: testDataYT[] = createMockData();
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
  await populateDB(mockUsers);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("DB QUERIES", () => {
  test("Insert a channel and a video", async () => {
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
  test("Throw Error", async () => {
    myMock = jest.spyOn(db, "query");
    myMock.mockImplementation(() => {
      throw new Error();
    });
    await expect(async () => {
      await dbQueries.insertIntoChannelsReturnID("A Channel");
    }).rejects.toThrow();
  });
  test("checkUniqueness should return item id", async () => {
    myMock = jest.spyOn(db, "query").mockImplementation(() => {
      throw new Error();
    });
    await expect(async () => {
      await dbQueries.checkUniqueness("videos", "channel_name", "Channel One");
    }).rejects.toThrow();
  });
});
