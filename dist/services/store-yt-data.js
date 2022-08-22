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
function storeData(dataYT) {
    return __awaiter(this, void 0, void 0, function* () {
        let channel_id;
        const table = "channels";
        const column = "channel_name";
        try {
            const channelNames = getOnlyChannelNamesNoDuplicates(dataYT); //better if we somehow just do datayt.map and then pass in filtered array after, makes more sense
            console.log(channelNames);
            yield Promise.all(channelNames.map((channel) => __awaiter(this, void 0, void 0, function* () {
                const uniquenessValue = yield (0, db_queries_1.checkUniqueness)(table, column, channel);
                channel_id = uniquenessValue
                    ? uniquenessValue
                    : yield (0, db_queries_1.insertIntoChannelsReturnID)(channel);
                dataYT.forEach((element, index) => {
                    //probably slower than doing a simple for loop instead of async db calls, find better way to mutate dataYT.
                    if (element.channelTitle === channel) {
                        dataYT[index].channel_id = channel_id;
                    }
                });
            })));
            yield Promise.all(dataYT.map(({ title, date, channel_id }) => __awaiter(this, void 0, void 0, function* () {
                channel_id = channel_id;
                yield (0, db_queries_1.insertIntoVideos)(title, date, channel_id);
            })));
        }
        catch (err) {
            throw err;
        }
    });
}
exports.storeData = storeData;
function getOnlyChannelNamesNoDuplicates(dataYT) {
    const filteredArray = dataYT.map((item) => item.channelTitle);
    const setFilteredArray = [...new Set(filteredArray)];
    return setFilteredArray;
}
