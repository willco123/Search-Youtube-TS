import db from "../config/db";
import { arrayTypeGuard } from "../utils/type-guard-helpers";
interface videoResults {
  id: number;
  title: string;
  date: Date;
  channel_id: number;
}
interface channelResults {
  id: number;
  channel_name: string;
}

interface searchResults {
  id: number;
  title?: string;
  date?: Date;
  channel_name?: string;
  channel_id?: number;
}

export async function insertIntoChannelsReturnID(
  channelTitle: string,
): Promise<number> {
  try {
    let [query] = await db.query(
      "INSERT INTO CHANNELS(channel_name)\
                      VALUES (?)",
      [channelTitle],
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
  id: number,
): Promise<void> {
  try {
    await db.query(
      "INSERT INTO VIDEOS(title, date, channel_id)\
                    VALUES (?,?,?)",
      [title, date, id],
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
  // await db.query("USE `YTSearchDB` ;"); //Fixes async pool issues with map
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

export async function getAllFromTable(table: string): Promise<object> {
  const query = await db.query("SELECT * from ??", [table]);
  const items: object = query[0];
  return items;
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
    return Array.isArray(query) ? query[0] : 0;
  } catch (err) {
    throw err;
  }
}

export async function deleteItemByIDFromTable(
  table: string,
  id: number,
): Promise<number> {
  const [deletedItem]: any = await db.query("DELETE FROM ?? WHERE id = (?)", [
    table,
    id,
  ]);
  if (deletedItem.affectedRows === 0) return 0;
  else return 1;
}

export async function searchDBFromTable(
  table: string,
  column: string,
  value: string,
): Promise<searchResults[]> {
  const query = await db.query("SELECT * FROM ?? WHERE (??) LIKE (?)", [
    table,
    column,
    value,
  ]);
  const results: searchResults[] = arrayTypeGuard(query);
  console.log(Array.isArray(results));
  return results;
}
export async function searchChannelsFromDB(
  column: string,
  value: string,
): Promise<channelResults[]> {
  const query = await db.query("SELECT * FROM channels WHERE (??) LIKE (?)", [
    column,
    value,
  ]);
  const results: channelResults[] = arrayTypeGuard(query);
  console.log(Array.isArray(results));
  return results;
}
export async function searchVideosFromDB(
  column: string,
  value: string,
): Promise<videoResults[]> {
  const query = await db.query("SELECT * FROM videos WHERE (??) LIKE (?)", [
    column,
    value,
  ]);
  const results: videoResults[] = arrayTypeGuard(query);
  console.log(Array.isArray(results));
  return results;
}

export async function getParentItemByFK(
  parentTable: string,
  parentColumn: string,
  fk: number,
): Promise<string> {
  const [query] = await db.query("select (??) from ?? where id = ? ", [
    parentColumn,
    parentTable,
    fk,
  ]);
  const parentItem: { [key: string]: string } = arrayTypeGuard(query);
  return parentItem[parentColumn];
}

export async function getChildItemsWithFK(
  childTable: string,
  childColumn: string,
  fk: number,
) {
  const [query] = await db.query("select (??) from ?? where channel_id = ? ", [
    childColumn,
    childTable,
    fk,
  ]);
  const childItems: any = query;
  return childItems.map((key: any) => key[childColumn]);
}
