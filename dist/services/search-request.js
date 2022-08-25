"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVideos = exports.searchChannels = void 0;
const db_queries_1 = require("../database-access/db-queries");
async function searchChannels(query) {
    try {
        const column = Object.keys(query)[0];
        const searchTerms = Object.values(query)[0].split(" ").join("|");
        const results = await (0, db_queries_1.searchChannelsFromDB)(column, searchTerms);
        const output = [];
        for (let { id: fk, channel_name } of results) {
            const videosWithFK = await (0, db_queries_1.getChildItemsWithFK)("videos", "title", fk);
            output.push({ id: fk, channel_name, titles: videosWithFK });
        }
        return output;
    }
    catch (err) {
        throw err;
    }
}
exports.searchChannels = searchChannels;
async function searchVideos(query) {
    try {
        const column = Object.keys(query)[0];
        const value = `%${Object.values(query)[0]}%`;
        const results = await (0, db_queries_1.searchVideosFromDB)(column, value);
        const output = [];
        for (let { id, title, channel_id: fk, date } of results) {
            const channelName = fk === null
                ? "Null"
                : await (0, db_queries_1.getParentItemByFK)("channels", "channel_name", fk);
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
}
exports.searchVideos = searchVideos;
