"use strict";
const googleapis: any = jest.createMockFromModule("googleapis");

function CreateMockData() {
  let mockData = [
    {
      snippet: {
        title: "Title One",
        publishedAt: "2020-01-31T18:09:23Z",
        channelTitle: "Channel One",
      },
    },
    {
      snippet: {
        title: "Title Two",
        publishedAt: "2021-01-31T18:09:23Z",
        channelTitle: "Channel Two",
      },
    },
    {
      snippet: {
        title: "Title Three",
        publishedAt: "2022-01-31T18:09:23Z",
        channelTitle: "Channel Three",
      },
    },
    ,
  ];
  // console.log(mockData);
  return mockData;
}

const google = {
  youtube: function (config: any) {
    const youtubeObject = {
      search: {
        list: function (searchParams: any) {
          const response = {
            data: {
              items: CreateMockData(),
              nextPageToken: 0,
              pageInfo: {
                totalResults: 3,
                resultsPerPage: 1,
              },
            },
          };
          return response;
        },
      },
    };

    return youtubeObject;
  },
};

googleapis.google = google;
module.exports = googleapis;
