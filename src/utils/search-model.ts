import { readFileSyncByLine, readFileAsyncByLine } from "./file-helpers";

export var searchParams = {
  part: "snippet",
  type: "video",
  maxResults: 50,
};

export const searchArray = readFileSyncByLine("search_filter");
