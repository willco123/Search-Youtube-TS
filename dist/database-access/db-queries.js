"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildItemsWithFK = exports.getParentItemByFK = exports.searchVideosFromDB = exports.searchChannelsFromDB = exports.searchDBFromTable = exports.deleteItemByIDFromTable = exports.getItemByIDFromTable = exports.getAllFromTable = exports.checkUniqueness = exports.insertIntoVideos = exports.insertIntoChannelsReturnID = void 0;
const db_1 = __importDefault(require("../config/db"));
const type_guard_helpers_1 = require("../utils/type-guard-helpers");
async function insertIntoChannelsReturnID(channelName) {
    try {
        let [query] = await db_1.default.query("INSERT INTO CHANNELS(channel_name)\
                      VALUES (?)", [channelName]);
        const idAlias = query;
        return idAlias.insertId; //fixes trivial type checking error
    }
    catch (err) {
        throw err;
    }
}
exports.insertIntoChannelsReturnID = insertIntoChannelsReturnID;
async function insertIntoVideos(title, date, id) {
    try {
        await db_1.default.query("INSERT INTO VIDEOS(title, date, channel_id)\
                    VALUES (?,?,?)", [title, date, id]);
    }
    catch (err) {
        throw err;
    }
}
exports.insertIntoVideos = insertIntoVideos;
async function checkUniqueness(table, column, value) {
    try {
        const [query] = await db_1.default.query("SELECT * from ?? where (??) = (?)", [
            table,
            column,
            value,
        ]);
        const [item] = Object.values(JSON.parse(JSON.stringify(query))); //hacky method to fix mysql2 no id prop error
        return item === undefined ? 0 : item.id;
    }
    catch (err) {
        throw err;
    }
}
exports.checkUniqueness = checkUniqueness;
async function getAllFromTable(table) {
    const query = await db_1.default.query("SELECT * from ??", [table]);
    const items = query[0];
    return items;
}
exports.getAllFromTable = getAllFromTable;
async function getItemByIDFromTable(table, id) {
    try {
        const [query] = await db_1.default.query("SELECT * from ?? WHERE (id) = (?)", [
            table,
            id,
        ]);
        return Array.isArray(query) ? query[0] : 0;
    }
    catch (err) {
        throw err;
    }
}
exports.getItemByIDFromTable = getItemByIDFromTable;
async function deleteItemByIDFromTable(table, id) {
    const [deletedItem] = await db_1.default.query("DELETE FROM ?? WHERE id = (?)", [
        table,
        id,
    ]);
    if (deletedItem.affectedRows === 0)
        return false;
    else
        return true;
}
exports.deleteItemByIDFromTable = deleteItemByIDFromTable;
async function searchDBFromTable(table, column, value) {
    const query = await db_1.default.query("SELECT * FROM ?? WHERE (??) LIKE (?)", [
        table,
        column,
        value,
    ]);
    const results = (0, type_guard_helpers_1.arrayTypeGuard)(query);
    return results;
}
exports.searchDBFromTable = searchDBFromTable;
async function searchChannelsFromDB(column, value) {
    const query = await db_1.default.query("SELECT * FROM channels  WHERE (??) RLIKE (?)", [
        column,
        value,
    ]);
    const results = (0, type_guard_helpers_1.arrayTypeGuard)(query);
    return results;
}
exports.searchChannelsFromDB = searchChannelsFromDB;
async function searchVideosFromDB(column, value) {
    const query = await db_1.default.query("SELECT * FROM videos WHERE (??) RLIKE (?)", [
        column,
        value,
    ]);
    const results = (0, type_guard_helpers_1.arrayTypeGuard)(query);
    return results;
}
exports.searchVideosFromDB = searchVideosFromDB;
async function getParentItemByFK(parentTable, parentColumn, fk) {
    const [query] = await db_1.default.query("select (??) from ?? where id = ? ", [
        parentColumn,
        parentTable,
        fk,
    ]);
    const parentItem = (0, type_guard_helpers_1.arrayTypeGuard)(query);
    return parentItem[parentColumn];
}
exports.getParentItemByFK = getParentItemByFK;
async function getChildItemsWithFK(childTable, childColumn, fk) {
    const [query] = await db_1.default.query("select (??) from ?? where channel_id = ? ", [
        childColumn,
        childTable,
        fk,
    ]);
    const childItems = query;
    return childItems.map((key) => key[childColumn]);
}
exports.getChildItemsWithFK = getChildItemsWithFK;
