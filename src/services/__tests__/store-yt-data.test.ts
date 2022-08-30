import "dotenv/config";
import { createMockData } from "../../tests/test-helpers";
import * as dbQueries from "../../database-access/db-queries";
import * as storeYtData from "../store-yt-data";
import { getOnlyChannelNamesNoDuplicates } from "../../utils/function-helpers";

import { dataYT, insertChannelVideos } from "../types";

let myMock: jest.SpyInstance;
const mockData = createMockData();

jest.mock("../../database-access/db-queries", () => ({
  insertIntoChannelsReturnID: jest.fn(),
  insertIntoVideos: jest.fn(),
  checkUniqueness: jest.fn(),
}));

afterEach(() => {
  jest.restoreAllMocks();
});

describe("store-yt-data", () => {
  test("Test main function", async () => {
    await storeYtData.storeData(mockData);
    expect(getOnlyChannelNamesNoDuplicates).toBeCalled;
    expect(dbQueries.insertIntoChannelsReturnID).toBeCalled;
    expect(dbQueries.insertIntoVideos).toBeCalled;
    expect(dbQueries.checkUniqueness).toBeCalled;
  });
});
