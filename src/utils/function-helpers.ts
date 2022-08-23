export function checkForQuery(query: object): boolean {
  let isQuery;
  if (Object.keys(query).length === 0) {
    isQuery = false;
  } else {
    if (
      Object.values(query)[0].length === 0 ||
      Object.values(query)[0] === " " //resolved a typeerror issue
    ) {
      isQuery = false;
    } else {
      isQuery = true;
    }
  }
  return isQuery;
}

interface dataYT {
  title: string;
  date: Date;
  channelTitle: string;
  id?: number;
}
interface insertChannelVideos {
  channelTitle: string;
  channel_id?: number;
}

/**
 * Filters out Title/Date from each indexes object, returns only unique channel names
 * @param {dataYT[]} dataYT
 */
export function getOnlyChannelNamesNoDuplicates(
  dataYT: dataYT[],
): insertChannelVideos[] {
  const uniqueArr = [...new Set(dataYT.map((item) => item.channelTitle))];
  const uniqueObjArr = [];
  for (let i = 0; i < uniqueArr.length; i++) {
    uniqueObjArr.push({ channelTitle: uniqueArr[i] });
  }

  return uniqueObjArr;
}
