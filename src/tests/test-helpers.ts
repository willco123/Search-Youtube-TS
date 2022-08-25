import "dotenv/config";
import express from "express";
import db from "../config/db";
import { arrayTypeGuard } from "../utils/type-guard-helpers";

export function setUpMockApp() {
  const app = express();
  app.use(express.json());
  return app;
}

export function testFunc() {
  return "hey";
}

export function createMockData() {
  let mockData = {
    mockData1: {
      title: "Title One",
      date: new Date("2022-01-01"),
      channelTitle: "Channel One",
    },
    mockData2: {
      title: "Title Two",
      date: new Date("2022-02-02"),
      channelTitle: "Channel Two",
    },
    mockData3: {
      title: "Title Three",
      date: new Date("2022-03-03"),
      channelTitle: "Channel Three",
    },
  };

  return mockData;
}

export async function clearDB() {
  await db.query("delete from videos;");
  await db.query("delete from channels;");
}

export async function getFirstVideo() {
  const query = await db.query("Select * from videos;");
  const items = arrayTypeGuard(query);
  const firstItemID: any = items[0][0].id;
  return firstItemID;
}

export async function getFirstChannel() {
  const query = await db.query("Select * from channels;");
  const items = arrayTypeGuard(query);
  const firstItemID = items[0][0].id;
  return firstItemID;
}

export async function getAllChannels() {
  const items = await db.query("select * from channels;");
  return items[0];
}

export async function getAllVideos() {
  const items = await db.query("select * from videos;");
  return items[0];
}

export async function useTestDB() {
  await db.query("use ytsearchDB_test");
}

export async function endDB() {
  await db.end();
}
