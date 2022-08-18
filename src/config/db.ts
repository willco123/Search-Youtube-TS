import * as mysql from "mysql2";
import fs from "fs";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

const promisePool = pool.promise();
async function createSchema(): Promise<void> {
  try {
    let targetFile: string;
    process.env.NODE_ENV === "test"
      ? (targetFile = "./MYSQL_Schema_test.sql")
      : (targetFile = "./MYSQL_Schema.sql");
    const SQLSchema: string = fs.readFileSync(targetFile, {
      encoding: "utf8",
    });
    await promisePool.query(SQLSchema);
  } catch (err) {
    throw err;
  }
}

createSchema();
export default promisePool;
