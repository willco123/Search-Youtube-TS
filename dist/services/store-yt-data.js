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
        console.log(dataYT);
        try {
            for (let index in dataYT) {
                const { title, date, channelTitle } = dataYT[index];
                const uniquenessValue = yield (0, db_queries_1.checkUniqueness)(table, column, channelTitle);
                channel_id = uniquenessValue
                    ? uniquenessValue
                    : yield (0, db_queries_1.insertIntoChannelsReturnID)(channelTitle);
                yield (0, db_queries_1.insertIntoVideos)(title, date, channel_id);
            }
        }
        catch (err) {
            throw err;
        }
    });
}
exports.storeData = storeData;
// const doLogic = async ({ title, date, channelTitle }) => {
//   const uniquenessValue: number = await checkUniqueness(
//     table,
//     column,
//     channelTitle,
//   );
//   channel_id = uniquenessValue
//     ? uniquenessValue
//     : await insertIntoChannelsReturnID(channelTitle);
//   await insertIntoVideos(title, date, channel_id);
// };
// await Promise.all(
//   dataYT.map(async ({ title, date, channelTitle }) =>
//     doLogic({ title, date, channelTitle }),
//   ),
// );
