"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql2"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
let ytDatabase;
let targetFile;
process.env.NODE_ENV === "test"
    ? ((targetFile = "./MYSQL_Schema_test.sql"), (ytDatabase = "ytsearchdb_test"))
    : ((targetFile = "./MYSQL_Schema.sql"), (ytDatabase = "ytsearchdb"));
const SQLSchema = fs_1.default.readFileSync(targetFile, {
    encoding: "utf8",
});
const conn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    multipleStatements: true,
});
const query = util_1.default.promisify(conn.query).bind(conn);
(async () => {
    try {
        await query(SQLSchema);
    }
    finally {
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
    multipleStatements: false,
});
const promisePool = pool.promise();
exports.default = promisePool;
