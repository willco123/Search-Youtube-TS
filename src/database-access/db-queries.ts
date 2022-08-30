import db from "../config/db";
import { arrayTypeGuard } from "../utils/type-guard-helpers";
import { videoResults, channelResults, searchResults } from "./types";

export async function insertIntoChannelsReturnID(
  channelName: string,
): Promise<number> {
  try {
    let [query] = await db.query(
      "INSERT INTO CHANNELS(channel_name)\
                      VALUES (?)",
      [channelName],
    );
    const idAlias: any = query;
    return idAlias.insertId; //fixes trivial type checking error
  } catch (err) {
    throw err;
  }
}

export async function insertIntoVideos(
  title: string,
  date: Date,
  channel_id: number,
): Promise<void> {
  try {
    await db.query(
      "INSERT INTO VIDEOS(title, date, channel_id)\
                    VALUES (?,?,?)",
      [title, date, channel_id],
    );
  } catch (err) {
    throw err;
  }
}

export async function checkUniqueness(
  table: string,
  column: string,
  value: string,
): Promise<number> {
  try {
    const [query] = await db.query("SELECT * from ?? where (??) = (?)", [
      table,
      column,
      value,
    ]);

    const [item]: any = Object.values(JSON.parse(JSON.stringify(query))); //hacky method to fix mysql2 no id prop error
    return item === undefined ? 0 : item.id;
  } catch (err) {
    throw err;
  }
}

export async function getAllFromTable(table: string): Promise<videoResults[]> {
  try {
    const query = await db.query("SELECT * from ??", [table]);
    const items: videoResults[] = arrayTypeGuard(query);
    return items;
  } catch (err) {
    throw err;
  }
}

export async function getItemByIDFromTable(
  table: string,
  id: number,
): Promise<object | number> {
  try {
    const [query] = await db.query("SELECT * from ?? WHERE (id) = (?)", [
      table,
      id,
    ]);

    return arrayTypeGuard(query);
  } catch (err) {
    throw err;
  }
}

export async function deleteItemByIDFromTable(
  table: string,
  id: number,
): Promise<boolean> {
  try {
    const [deletedItem]: any = await db.query("DELETE FROM ?? WHERE id = (?)", [
      table,
      id,
    ]);
    if (deletedItem.affectedRows === 0) return false;
    else return true;
  } catch (err) {
    throw err;
  }
}

export async function searchDBFromTable(
  table: string,
  column: string,
  value: string,
): Promise<searchResults[]> {
  try {
    const query = await db.query("SELECT * FROM ?? WHERE (??) LIKE (?)", [
      table,
      column,
      value,
    ]);
    const results: searchResults[] = arrayTypeGuard(query);
    return results;
  } catch (err) {
    throw err;
  }
}

export async function searchChannelsFromDB(
  column: string,
  value: string,
): Promise<channelResults[]> {
  try {
    const query = await db.query(
      "SELECT * FROM channels  WHERE (??) RLIKE (?)",
      [column, value],
    );

    const results: channelResults[] = arrayTypeGuard(query);
    return results;
  } catch (err) {
    throw err;
  }
}

export async function searchVideosFromDB(
  column: string,
  value: string,
): Promise<videoResults[]> {
  try {
    const query = await db.query("SELECT * FROM videos WHERE (??) RLIKE (?)", [
      column,
      value,
    ]);
    const results: videoResults[] = arrayTypeGuard(query);
    return results;
  } catch (err) {
    throw err;
  }
}

export async function getParentItemByFK(
  parentTable: string,
  parentColumn: string,
  fk: number,
): Promise<string> {
  try {
    const [query] = await db.query("select (??) from ?? where id = ? ", [
      parentColumn,
      parentTable,
      fk,
    ]);
    const parentItem: { [key: string]: string } = arrayTypeGuard(query);
    return parentItem[parentColumn];
  } catch (err) {
    throw err;
  }
}

export async function getChildItemsWithFK(
  childTable: string,
  childColumn: string,
  fk: number,
) {
  try {
    const [query] = await db.query(
      "select (??) from ?? where channel_id = ? ",
      [childColumn, childTable, fk],
    );
    const childItems: any = query;
    return childItems.map((key: any) => key[childColumn]);
  } catch (err) {
    throw err;
  }
}
