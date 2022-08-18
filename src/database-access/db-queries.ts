import db from "../config/db";

interface dataYT {
  title: string;
  date: Date;
  channelTitle: string;
}

// const isRowDataPacket = (
//   rows:
//     | RowDataPacket[]
//     | RowDataPacket[][]
//     | OkPacket
//     | OkPacket[]
//     | ResultSetHeader,
// ): rows is RowDataPacket[] | RowDataPacket[][] => {
//   return (rows as RowDataPacket[] | RowDataPacket[][])[0] !== undefined;
// };

export async function storeData(dataYT: dataYT[]): Promise<void> {
  let id: number;
  try {
    await Promise.all(
      dataYT.map(async ({ title, date, channelTitle }) => {
        const table: string = "channels";
        const column: string = "channel_name";
        const uniquenessValue: number = await checkUniqueness(
          table,
          column,
          channelTitle,
        );
        id = uniquenessValue
          ? uniquenessValue
          : await insertIntoChannelsReturnID(channelTitle);

        await insertIntoVideos(title, date, id);
      }),
    );
  } catch (err) {
    throw err;
  }
}

export async function insertIntoChannelsReturnID(
  channelTitle: string,
): Promise<number> {
  try {
    let [result] = await db.query(
      "INSERT INTO CHANNELS(channel_name)\
                      VALUES (?)",
      [channelTitle],
    );
    const idAlias: any = result;
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
  try {
    const [selectItem] = await db.query("SELECT * from ?? where (??) = (?)", [
      table,
      column,
      value,
    ]);
    const rowAlias = selectItem[0];
    const row = rowAlias;
    if (row === undefined) return 0;
    return row.id;
  } catch (err) {
    throw err;
  }
}

export async function getAllFromTable(table: string) {
  const items = await db.query("SELECT * from ??", [table]);
  return items[0];
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
    if (Array.isArray(query)) {
      //type guarding to fix indexing issue with mysql types
      const item = query[0];
      return item === undefined ? 0 : item;
    }
    throw new Error("Query not returning an array");
  } catch (err) {
    throw err;
  }
}

export async function deleteItemByIDFromTable(
  table: string,
  id: number,
): Promise<number> {
  //returns bool
  const [deletedItem] = await db.query("DELETE FROM ?? WHERE id = (?)", [
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
) {
  const [query] = await db.query("SELECT * FROM ?? WHERE (??) LIKE (?)", [
    table,
    column,
    value,
  ]);
  const results = query;
  return results;
}

export async function getParentItemsByFK(
  parentTable: string,
  parentColumn: string,
  fk: number,
) {
  const [query] = await db.query("select (??) from ?? where id = ? ", [
    parentColumn,
    parentTable,
    fk,
  ]);
  const parentItem = query[0];
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
  const childItems = query;
  const childValues = [];
  for (let key of childItems) childValues.push(key[childColumn]);
  return childValues;
}
