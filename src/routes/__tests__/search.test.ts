import supertest from "supertest";
import { setUpMockApp, useTestDB, endDB } from "../../tests/test-helpers";
import router from "../search";
import * as getSearchResults from "../../services/yt-data-api";

const app = setUpMockApp();
app.use("/search", router);

let myMock: jest.SpyInstance;
myMock = jest.spyOn(getSearchResults, "default");

describe("SEARCH", () => {
  describe("POST", () => {
    it("Should call YTAPI and return 200", async () => {
      myMock.mockImplementation(() => jest.fn());
      const response = await supertest(app).post("/search");
      expect(response.status).toBe(200);
      expect(response.text).toEqual("Items stored in DB!");
      expect(myMock).toHaveBeenCalled();
    });

    it("Should send 403 as response", async () => {
      myMock.mockImplementation(() => {
        const error = new Error() as NodeJS.ErrnoException;
        error.code = "403";
        throw error;
      });
      const response = await supertest(app).post("/search");
      expect(response.status).toBe(403);
      expect(response.text).toEqual("Forbidden, Quota exceeded");
    });

    it("Should send 500 as response", async () => {
      myMock.mockImplementation(() => {
        throw new Error("Unknown Error");
      });
      const response = await supertest(app).post("/search");
      expect(response.status).toBe(500);
    });
  });
});
