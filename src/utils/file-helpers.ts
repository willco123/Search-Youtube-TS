import fs from "fs";
import * as fsp from "fs/promises";

export function readFileSyncByLine(inputFile) {
  //Stores search params in array
  try {
    const data = fs.readFileSync(inputFile, { encoding: "utf8" }).split("\r\n");
    return data;
  } catch (err) {
    console.log(err);
  }
}

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
