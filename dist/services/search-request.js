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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVideos = exports.searchChannels = void 0;
const db_queries_1 = require("../database-access/db-queries");
function searchChannels(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const column = Object.keys(query)[0];
            const value = `%${Object.values(query)[0]}%`;
            const results = yield (0, db_queries_1.searchDBFromTable)("channels", column, value);
            for (let index in results) {
                const { id } = results[index];
                const videosWithFK = yield (0, db_queries_1.getChildItemsWithFK)("videos", "title", id);
                delete results[index].id;
                results[index]["Videos"] = videosWithFK;
            }
            return results;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.searchChannels = searchChannels;
function searchVideos(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const column = Object.keys(query)[0];
            const value = `%${Object.values(query)[0]}%`;
            const results = yield (0, db_queries_1.searchDBFromTable)("videos", column, value);
            for (let index in results) {
                const { channel_id } = results[index];
                const channelName = yield (0, db_queries_1.getParentItemsByFK)("channels", "channel_name", channel_id);
                delete results[index].id;
                delete results[index].channel_id;
                results[index]["Channel"] = channelName;
            }
            return results;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.searchVideos = searchVideos;
