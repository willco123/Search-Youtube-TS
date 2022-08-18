"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileSyncByLine = void 0;
const fs_1 = __importDefault(require("fs"));
function readFileSyncByLine(inputFile) {
    //Stores search params in array
    try {
        const data = fs_1.default.readFileSync(inputFile, { encoding: "utf8" }).split("\r\n");
        return data;
    }
    catch (err) {
        console.log(err);
    }
}
exports.readFileSyncByLine = readFileSyncByLine;
// export async function readFileAsyncByLine(inputFile) {
//   try {
//     const data = (await fsp.readFile(inputFile, { encoding: "utf8" })).split(
//       "\r\n",
//     );
//     return data;
//   } catch (err) {
//     console.log(err);
//   }
// }
