"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildItemsWithFK = exports.getParentItemsByFK = exports.searchDBFromTable = exports.deleteItemByIDFromTable = exports.getItemByIDFromTable = exports.getAllFromTable = exports.checkUniqueness = exports.insertIntoVideos = exports.insertIntoChannelsReturnID = void 0;
const db_1 = __importDefault(require("../config/db"));
const type_guarding_helper_1 = require("../utils/type-guarding-helper");
function insertIntoChannelsReturnID(channelTitle) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let [query] = yield db_1.default.query("INSERT INTO CHANNELS(channel_name)\
                      VALUES (?)", [channelTitle]);
            const idAlias = query;
            return idAlias.insertId; //fixes trivial type checking error
        }
        catch (err) {
            throw err;
        }
    });
}
exports.insertIntoChannelsReturnID = insertIntoChannelsReturnID;
function insertIntoVideos(title, date, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.default.query("INSERT INTO VIDEOS(title, date, channel_id)\
                    VALUES (?,?,?)", [title, date, id]);
        }
        catch (err) {
            throw err;
        }
    });
}
exports.insertIntoVideos = insertIntoVideos;
function checkUniqueness(table, column, value) {
    return __awaiter(this, void 0, void 0, function* () {
        // await db.query("USE `YTSearchDB` ;"); //Fixes async pool issues with map
        try {
            const [query] = yield db_1.default.query("SELECT * from ?? where (??) = (?)", [
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
    });
}
exports.checkUniqueness = checkUniqueness;
function getAllFromTable(table) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = yield db_1.default.query("SELECT * from ??", [table]);
        const items = query[0];
        return items;
    });
}
exports.getAllFromTable = getAllFromTable;
function getItemByIDFromTable(table, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [query] = yield db_1.default.query("SELECT * from ?? WHERE (id) = (?)", [
                table,
                id,
            ]);
            return Array.isArray(query) ? query[0] : 0;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.getItemByIDFromTable = getItemByIDFromTable;
function deleteItemByIDFromTable(table, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const [deletedItem] = yield db_1.default.query("DELETE FROM ?? WHERE id = (?)", [
            table,
            id,
        ]);
        if (deletedItem.affectedRows === 0)
            return 0;
        else
            return 1;
    });
}
exports.deleteItemByIDFromTable = deleteItemByIDFromTable;
function searchDBFromTable(table, column, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const [query] = yield db_1.default.query("SELECT * FROM ?? WHERE (??) LIKE (?)", [
            table,
            column,
            value,
        ]);
        const results = query;
        return results;
    });
}
exports.searchDBFromTable = searchDBFromTable;
function getParentItemsByFK(parentTable, parentColumn, fk) {
    return __awaiter(this, void 0, void 0, function* () {
        const [query] = yield db_1.default.query("select (??) from ?? where id = ? ", [
            parentColumn,
            parentTable,
            fk,
        ]);
        const parentItem = (0, type_guarding_helper_1.arrayTypeGuard)(query);
        return parentItem[parentColumn];
    });
}
exports.getParentItemsByFK = getParentItemsByFK;
function getChildItemsWithFK(childTable, childColumn, fk) {
    return __awaiter(this, void 0, void 0, function* () {
        const [query] = yield db_1.default.query("select (??) from ?? where channel_id = ? ", [
            childColumn,
            childTable,
            fk,
        ]);
        console.log(query);
        const childItems = query;
        const childValues = [];
        return childItems.map((key) => key[childColumn]);
        return childValues;
    });
}
exports.getChildItemsWithFK = getChildItemsWithFK;
