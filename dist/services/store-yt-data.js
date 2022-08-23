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
exports.storeData = void 0;
const db_queries_1 = require("../database-access/db-queries");
const function_helpers_1 = require("../utils/function-helpers");
function storeData(dataYT) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const channelNames = yield insertChannel(dataYT);
            yield insertVideos(dataYT, channelNames);
        }
        catch (err) {
            throw err;
        }
    });
}
exports.storeData = storeData;
function insertChannel(dataYT) {
    return __awaiter(this, void 0, void 0, function* () {
        let channelID;
        const table = "channels";
        const column = "channel_name";
        try {
            const channelNames = (0, function_helpers_1.getOnlyChannelNamesNoDuplicates)(dataYT);
            yield Promise.all(channelNames.map(({ channelName }, index) => __awaiter(this, void 0, void 0, function* () {
                const uniquenessValue = yield (0, db_queries_1.checkUniqueness)(table, column, channelName);
                channelID = uniquenessValue
                    ? uniquenessValue
                    : yield (0, db_queries_1.insertIntoChannelsReturnID)(channelName);
                channelNames[index].channelID = channelID;
            })));
            return channelNames;
        }
        catch (err) {
            throw err;
        }
    });
}
function insertVideos(dataYT, channelNames) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Promise.all(dataYT.map(({ title, date, channelName }) => __awaiter(this, void 0, void 0, function* () {
                const channelNameID = channelNames.find((item) => item.channelName === channelName);
                const channelID = channelNameID === null || channelNameID === void 0 ? void 0 : channelNameID.channelID;
                if (channelID === undefined)
                    return "No channel id found";
                yield (0, db_queries_1.insertIntoVideos)(title, date, channelID);
            })));
        }
        catch (err) {
            throw err;
        }
    });
}
