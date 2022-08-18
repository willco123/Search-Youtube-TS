import express from "express";
const router = express.Router();
import {
  getAllFromTable,
  getItemByIDFromTable,
  deleteItemByIDFromTable,
} from "../database-access/db-queries";
import { SearchVideos } from "../services/search-request";
import checkForQuery from "../utils/check-for-query";

router.get("/", async (req, res, next) => {
  try {
    const query = req.query;

    const isQuery = checkForQuery(query);

    let output;

    if (isQuery) {
      output = await SearchVideos(query);
    } else {
      output = await getAllFromTable("videos");
    }
    return res.status(200).send(output);
  } catch (err: unknown) {
    if (err.code === "ER_BAD_FIELD_ERROR")
      return res.status(404).send("Incorrect column name");
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await getItemByIDFromTable("videos", id);
    if (item === 0)
      return res.status(404).send("A video with that given id cannot be found");
    return res.status(200).send(item);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedItem = await deleteItemByIDFromTable("videos", id);
    if (deletedItem === 0)
      return res.status(404).send("A video with the given ID was not found");

    return res.status(200).send("Record Successfully deleted");
  } catch (err) {
    next(err);
  }
});
export default router;
