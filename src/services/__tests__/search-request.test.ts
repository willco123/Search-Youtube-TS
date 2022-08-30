import * as searchRequest from "../search-request";
import * as dbQueries from "../../database-access/db-queries";
import {
  channelResults,
  videoResults,
  channelOutput,
  videoOutput,
} from "../types";

const channelQueryObject = { channel_name: "Channel One" };
const childTitlesArray = ["Title One", "Title Two"];
const channelResponse = [{ id: 1, channel_name: "Channel One" }];
const expectedChannelResponse = [
  { id: 1, channel_name: "Channel One", titles: ["Title One", "Title Two"] },
];

const videoQueryObject = { title: "Title One" };
const parentChannel = "Channel One";
let videoResponse = [
  { id: 1, title: "Title One", date: new Date("2022-01-01"), channel_id: 1 },
];
const expectedvideoResponse = [
  {
    id: 1,
    channel_name: "Channel One",
    title: "Title One",
    date: new Date("2022-01-01"),
    channel_id: 1,
  },
];

let myMock: jest.SpyInstance;

jest.mock("../../database-access/db-queries", () => ({
  searchChannelsFromDB: jest.fn().mockImplementation(() => {
    return channelResponse;
  }),
  getChildItemsWithFK: jest.fn().mockImplementation(() => {
    return childTitlesArray;
  }),
  searchVideosFromDB: jest.fn().mockImplementation(() => {
    return videoResponse;
  }),
  getParentItemByFK: jest.fn().mockImplementation(() => {
    return parentChannel;
  }),
}));

afterEach(() => {
  jest.restoreAllMocks();
});

describe("SearchRequest", () => {
  test("Search Channels", async () => {
    const searchResponse = await searchRequest.searchChannels(
      channelQueryObject,
    );
    expect(dbQueries.getChildItemsWithFK).toBeCalled();
    expect(dbQueries.searchChannelsFromDB).toBeCalled();
    expect(searchResponse).toEqual(expectedChannelResponse);
  });
  test("Search Channels No result", async () => {
    myMock = jest
      .spyOn(dbQueries, "searchChannelsFromDB")
      .mockImplementation((): any => {
        return [];
      });
    const searchResponse = await searchRequest.searchChannels(
      channelQueryObject,
    );
    expect(dbQueries.getChildItemsWithFK).toBeCalled();
    expect(dbQueries.searchChannelsFromDB).toBeCalled();
    expect(searchResponse).toEqual([]);
  });
  test("Search Channels Throw", async () => {
    myMock = jest
      .spyOn(dbQueries, "searchChannelsFromDB")
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await searchRequest.searchChannels(channelQueryObject);
    }).rejects.toThrow();
  });
  test("Search Videos", async () => {
    const searchResponse = await searchRequest.searchVideos(videoQueryObject);
    expect(dbQueries.getParentItemByFK).toBeCalled();
    expect(dbQueries.searchVideosFromDB).toBeCalled();
    expect(searchResponse).toEqual(expectedvideoResponse);
  });
  test("Search Video No result", async () => {
    myMock = jest
      .spyOn(dbQueries, "searchVideosFromDB")
      .mockImplementation((): any => {
        return [];
      });
    const searchResponse = await searchRequest.searchVideos(videoQueryObject);
    expect(dbQueries.getParentItemByFK).toBeCalled();
    expect(dbQueries.searchVideosFromDB).toBeCalled();
    expect(searchResponse).toEqual([]);
  });
  test("Search Video No channel found", async () => {
    myMock = jest
      .spyOn(dbQueries, "searchVideosFromDB")
      .mockImplementation((): any => {
        videoResponse[0].channel_id = null as any;
        return videoResponse;
      });
    const searchResponse = await searchRequest.searchVideos(videoQueryObject);
    expect(dbQueries.getParentItemByFK).toBeCalled();
    expect(dbQueries.searchVideosFromDB).toBeCalled();
    expectedvideoResponse[0].channel_name = "Null";
    expectedvideoResponse[0].channel_id = null as any;
    expect(searchResponse).toEqual(expectedvideoResponse);
  });
  test("Search Videos Throw", async () => {
    myMock = jest
      .spyOn(dbQueries, "searchVideosFromDB")
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await searchRequest.searchVideos(videoQueryObject);
    }).rejects.toThrow();
  });
});
