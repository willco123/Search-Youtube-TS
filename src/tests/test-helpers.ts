import express from "express";

export interface dataYT {
  title: string;
  date: Date;
  channelName: string;
  id?: number;
}

export function setUpMockApp() {
  const app = express();
  app.use(express.json());
  return app;
}

export function testFunc() {
  return "hey";
}

export function createMockData(): dataYT[] {
  let mockData = [
    {
      title: "Title One",
      date: new Date("2022-01-01"),
      channelName: "Channel One",
    },
    {
      title: "Title Two",
      date: new Date("2022-02-02"),
      channelName: "Channel Two",
    },
    {
      title: "Title Three",
      date: new Date("2022-03-03"),
      channelName: "Channel Three",
    },
  ];

  return mockData;
}

export function createMockYtData() {
  let mockData = [
    {
      snippet: {
        title: "Title One",
        publishedAt: "2020-01-31T18:09:23Z",
        channelTitle: "Channel One",
      },
    },
    {
      snippet: {
        title: "Title Two",
        publishedAt: "2021-01-31T18:09:23Z",
        channelTitle: "Channel Two",
      },
    },
    {
      snippet: {
        title: "Title Three",
        publishedAt: "2022-01-31T18:09:23Z",
        channelTitle: "Channel Three",
      },
    },
    ,
  ];
  return mockData;
}
