import * as mysql from "mysql2";
import fs from "fs";
import util from "util";

let ytDatabase: string;
let targetFile: string;
type queryOptions = mysql.QueryOptions;

process.env.NODE_ENV === "test"
  ? ((targetFile = "./MYSQL_Schema_test.sql"), (ytDatabase = "ytsearchdb_test"))
  : ((targetFile = "./MYSQL_Schema.sql"), (ytDatabase = "ytsearchdb"));

const SQLSchema: string = fs.readFileSync(targetFile, {
  encoding: "utf8",
});

const conn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  multipleStatements: true,
});

const query = util.promisify(conn.query).bind(conn);
(async () => {
  try {
    await query((<unknown>SQLSchema) as queryOptions);
  } finally {
    conn.end();
  }
})();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: ytDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

const promisePool = pool.promise();

export default promisePool;
