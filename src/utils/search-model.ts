import { readFileSyncByLine } from "./file-helpers";

// interface searchParamsInterface {
//   part: string;
//   type: string;
//   maxResults: number;
//   q?: string;
// }

export var searchParams: any = {
  part: "snippet",
  type: "video",
  maxResults: 50,
};

export const searchArray = readFileSyncByLine("search_filter");
