import fs from "fs";

export function readFileSyncByLine(inputFile: string) {
  //Stores search params in array
  try {
    const data = fs.readFileSync(inputFile, { encoding: "utf8" }).split("\r\n");
    return data;
  } catch (err) {
    console.log(err);
  }
}
