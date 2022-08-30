import supertest from "supertest";
import { setUpMockApp } from "../../tests/test-helpers";
import router from "../videos";
import * as dbQueries from "../../database-access/db-queries";
import * as searchRequest from "../../services/search-request";
import * as functionHelpers from "../../utils/function-helpers";

jest.mock("../../database-access/db-queries", () => ({
  getAllFromTable: jest.fn(),
  getItemByIDFromTable: jest.fn(),
  deleteItemByIDFromTable: jest.fn(),
}));

jest.mock("../../services/search-request", () => ({
  searchVideos: jest.fn(),
}));
jest.mock("../../utils/function-helpers", () => ({
  checkForQuery: jest.fn().mockImplementation(() => {
    return true;
  }),
}));

let myMock: jest.SpyInstance;

const app = setUpMockApp();
app.use("/videos", router);

describe("VIDEOS", () => {
  describe("GET", () => {
    it("Should call getAllFromTable", async () => {
      myMock = jest.spyOn(functionHelpers, "checkForQuery");
      myMock.mockImplementation(() => {
        return false;
      });
      const response = await supertest(app).get("/videos");
      expect(functionHelpers.checkForQuery).toHaveBeenCalled();
      expect(dbQueries.getAllFromTable).toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
      myMock.mockImplementation(() => {
        return true;
      });
    });
    it("Should call searchVideos", async () => {
      const response = await supertest(app).get("/videos");
      expect(functionHelpers.checkForQuery).toHaveBeenCalled();
      expect(searchRequest.searchVideos).toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
    });
    it("should throw 404", async () => {
      myMock = jest.spyOn(searchRequest, "searchVideos");
      myMock.mockImplementation(() => {
        const error = new Error() as NodeJS.ErrnoException;
        error.code = "ER_BAD_FIELD_ERROR";
        throw error;
      });

      const response = await supertest(app).get("/videos");
      expect(functionHelpers.checkForQuery).toHaveBeenCalled();
      expect(searchRequest.searchVideos).toHaveBeenCalled();
      expect(response.statusCode).toBe(404);
    });
    it("should throw 500", async () => {
      myMock.mockImplementation(() => {
        throw new Error();
      });
      const response = await supertest(app).get("/videos");
      expect(response.statusCode).toBe(500);
    });
  });
  describe("GET/:ID", () => {
    it("Should throw an error and return 500", async () => {
      const response = await supertest(app).get("/videos/a");
      expect(response.statusCode).toBe(500);
      expect(response.text.includes("Incorrect Index"));
    });
    it("Should return 404", async () => {
      myMock = jest.spyOn(dbQueries, "getItemByIDFromTable");
      myMock.mockImplementation(() => {
        return 0;
      });
      const response = await supertest(app).get("/videos/1");
      expect(response.statusCode).toBe(404);
      expect(response.text).toEqual(
        "A video with that given id cannot be found",
      );
    });
    it("Should return 200", async () => {
      myMock = jest.spyOn(dbQueries, "getItemByIDFromTable");
      myMock.mockImplementation(() => {
        return { mock: "item" };
      });
      const response = await supertest(app).get("/videos/1");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ mock: "item" });
    });
  });
  describe("DELETE", () => {
    it("Should return Incorrect Index", async () => {
      const response = await supertest(app).delete("/videos/a");
      expect(response.statusCode).toBe(500);
      expect(response.text.includes("Incorrect Index"));
    });
    it("Should return 404", async () => {
      myMock = jest.spyOn(dbQueries, "deleteItemByIDFromTable");
      myMock.mockImplementation(() => {
        return false;
      });
      const response = await supertest(app).delete("/videos/1");
      expect(response.statusCode).toBe(404);
      expect(response.text).toEqual("A video with the given ID was not found");
    });
    it("Should return 200", async () => {
      myMock = jest.spyOn(dbQueries, "deleteItemByIDFromTable");
      myMock.mockImplementation(() => {
        return true;
      });
      const response = await supertest(app).delete("/videos/1");
      expect(response.statusCode).toBe(200);
      expect(response.text).toEqual("Record Successfully deleted");
    });
  });
});
