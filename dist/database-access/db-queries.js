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
exports.getChildItemsWithFK = exports.getParentItemsByFK = exports.searchDBFromTable = exports.deleteItemByIDFromTable = exports.getItemByIDFromTable = exports.getAllFromTable = exports.checkUniqueness = exports.insertIntoVideos = exports.insertIntoChannelsReturnID = exports.storeData = void 0;
const db_1 = __importDefault(require("../config/db"));
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
function storeData(dataYT) {
    return __awaiter(this, void 0, void 0, function* () {
        let id;
        try {
            yield Promise.all(dataYT.map(({ title, date, channelTitle }) => __awaiter(this, void 0, void 0, function* () {
                const table = "channels";
                const column = "channel_name";
                const uniquenessValue = yield checkUniqueness(table, column, channelTitle);
                id = uniquenessValue
                    ? uniquenessValue
                    : yield insertIntoChannelsReturnID(channelTitle);
                yield insertIntoVideos(title, date, id);
            })));
        }
        catch (err) {
            throw err;
        }
    });
}
exports.storeData = storeData;
function insertIntoChannelsReturnID(channelTitle) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let [result] = yield db_1.default.query("INSERT INTO CHANNELS(channel_name)\
                      VALUES (?)", [channelTitle]);
            const idAlias = result;
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
        try {
            const [selectItem] = yield db_1.default.query("SELECT * from ?? where (??) = (?)", [
                table,
                column,
                value,
            ]);
            const rowAlias = selectItem[0];
            const row = rowAlias;
            if (row === undefined)
                return 0;
            return row.id;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.checkUniqueness = checkUniqueness;
function getAllFromTable(table) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = yield db_1.default.query("SELECT * from ??", [table]);
        return items[0];
    });
}
exports.getAllFromTable = getAllFromTable;
function getItemByIDFromTable(table, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const [query] = yield db_1.default.query("SELECT * from ?? WHERE (id) = (?)", [
            table,
            id,
        ]);
        if (Array.isArray(query)) {
            const item = query[0];
            console.log(item);
            console.log("hery");
        }
        const [item] = Object.values(JSON.parse(JSON.stringify(query))); //hacky method to fix type indexing issue with intrinsic mysql types
        console.log(item);
        return item === undefined ? 0 : item;
    });
}
exports.getItemByIDFromTable = getItemByIDFromTable;
function deleteItemByIDFromTable(table, id) {
    return __awaiter(this, void 0, void 0, function* () {
        //returns bool
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
        const parentItem = query[0];
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
        const childItems = query;
        const childValues = [];
        for (let key of childItems)
            childValues.push(key[childColumn]);
        return childValues;
    });
}
exports.getChildItemsWithFK = getChildItemsWithFK;
