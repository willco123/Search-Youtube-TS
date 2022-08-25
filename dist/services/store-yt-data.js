"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeData = void 0;
const db_queries_1 = require("../database-access/db-queries");
const function_helpers_1 = require("../utils/function-helpers");
async function storeData(dataYT) {
    try {
        const channelNames = await insertChannel(dataYT);
        await insertVideos(dataYT, channelNames);
    }
    catch (err) {
        throw err;
    }
}
exports.storeData = storeData;
async function insertChannel(dataYT) {
    let channelID;
    const table = "channels";
    const column = "channel_name";
    try {
        const channelNames = (0, function_helpers_1.getOnlyChannelNamesNoDuplicates)(dataYT);
        await Promise.all(channelNames.map(async ({ channelName }, index) => {
            const uniquenessValue = await (0, db_queries_1.checkUniqueness)(table, column, channelName);
            channelID = uniquenessValue
                ? uniquenessValue
                : await (0, db_queries_1.insertIntoChannelsReturnID)(channelName);
            channelNames[index].channelID = channelID;
        }));
        return channelNames;
    }
    catch (err) {
        throw err;
    }
}
async function insertVideos(dataYT, channelNames) {
    try {
        await Promise.all(dataYT.map(async ({ title, date, channelName }) => {
            const channelNameID = channelNames.find((item) => item.channelName === channelName);
            const channelID = channelNameID === null || channelNameID === void 0 ? void 0 : channelNameID.channelID;
            if (channelID === undefined)
                return "No channel id found";
            await (0, db_queries_1.insertIntoVideos)(title, date, channelID);
        }));
    }
    catch (err) {
        throw err;
    }
}
