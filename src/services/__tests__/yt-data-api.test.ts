import "dotenv/config";
// import * as googleapis from "googleapis";
import * as ytDataApi from "../yt-data-api";
import * as storeYtData from "../store-yt-data";
import { dataYT } from "../types";
import { createMockYtData } from "../../tests/test-helpers";

let myMock: jest.SpyInstance;

const searchArray = ["First", "Second"];

jest.mock("googleapis");

afterEach(() => {
  jest.restoreAllMocks();
});

describe("yt-data-api", () => {
  test("Test main function", async () => {
    await ytDataApi.default(searchArray);
    test.todo;
  });
});
