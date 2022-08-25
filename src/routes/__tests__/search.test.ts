import supertest from "supertest";
import { setUpMockApp, useTestDB, endDB } from "../../tests/test-helpers";
import router from "../search";

const app = setUpMockApp();
app.use("/search", router);

beforeAll(async () => {
  await useTestDB();
});

jest.mock("../../services/yt-data-api"); //works with no import in the test file

describe("SEARCH", () => {
  describe("POST", () => {
    it("Should do something", async () => {
      const response = await supertest(app).post("/search");
      expect(response.status).toBe(200);
      expect(response.text).toEqual("Items stored in DB!");
    });
  });
});

afterAll(async () => {
  await endDB();
});
