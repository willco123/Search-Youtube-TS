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
            // const value = `%${Object.values(query)[0]}%`;
            const searchTerms = Object.values(query)[0].split(" ").join("|");
            const results = yield (0, db_queries_1.searchChannelsFromDB)(column, searchTerms);
            const output = [];
            for (let { id: fk, channel_name } of results) {
                const videosWithFK = yield (0, db_queries_1.getChildItemsWithFK)("videos", "title", fk);
                output.push({ id: fk, channel_name, titles: videosWithFK });
            }
            return output;
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
            const results = yield (0, db_queries_1.searchVideosFromDB)(column, value);
            const output = [];
            for (let { id, title, channel_id: fk, date } of results) {
                const channelName = fk === null
                    ? "Null"
                    : yield (0, db_queries_1.getParentItemByFK)("channels", "channel_name", fk);
                output.push({
                    id,
                    title,
                    date,
                    channel_name: channelName,
                    channel_id: fk,
                });
            }
            return output;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.searchVideos = searchVideos;
