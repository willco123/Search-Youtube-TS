import "dotenv/config";
import * as googleapis from "googleapis";
import * as ytDataApi from "../yt-data-api";
import * as storeYtData from "../store-yt-data";
import { dataYT } from "../types";
import { createMockYtData } from "../../tests/test-helpers";

let myMock: jest.SpyInstance;
const mockData = createMockYtData();
const searchArray = ["First", "Second"];

jest.mock("../store-yt-data");
jest.mock("googleapis");
const ytApiMock = googleapis.google.youtube as any;
ytApiMock.mockImplementation(() => {
  return {
    search: {
      list: mockData,
    },
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("yt-data-api", () => {
  test("Test main function", async () => {
    //await ytDataApi.default(searchArray);
    test.todo;
  });
});
