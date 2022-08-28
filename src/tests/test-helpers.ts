import "dotenv/config";
import express from "express";
import db from "../config/db";
import { arrayTypeGuard } from "../utils/type-guard-helpers";
export interface testDataYT {
  title: string;
  date: Date;
  channel_name: string;
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

export function createMockData(): testDataYT[] {
  let mockData = [
    {
      title: "Title One",
      date: new Date("2022-01-01"),
      channel_name: "Channel One",
    },
    {
      title: "Title Two",
      date: new Date("2022-02-02"),
      channel_name: "Channel Two",
    },
    {
      title: "Title Three",
      date: new Date("2022-03-03"),
      channel_name: "Channel Three",
    },
  ];

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

export async function populateDB(mockData: testDataYT[]) {
  await Promise.all(
    mockData.map(async (item) => {
      const [query] = await db.query(
        "INSERT INTO channels (channel_name) VALUES (?)",
        [item.channel_name],
      );
      const idAlias: any = query;
      const channel_id = idAlias.insertId;
      await db.query(
        "INSERT INTO videos (title, date, channel_id) VALUES (?,?,?)",
        [item.title, item.date, channel_id],
      );
    }),
  );
}
