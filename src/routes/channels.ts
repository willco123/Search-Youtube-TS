import express from "express";
const router = express.Router();

import {
  getAllFromTable,
  getItemByIDFromTable,
  deleteItemByIDFromTable,
} from "../database-access/db-queries";
import { searchChannels } from "../services/search-request";
import { checkForQuery } from "../utils/function-helpers";

router.get("/", async (req, res, next) => {
  try {
    let query = req.query;
    const isQuery = checkForQuery(query);
    let output: object = isQuery
      ? await searchChannels(query)
      : await getAllFromTable("channels");
    return res.status(200).send(output);
  } catch (err: any) {
    if (err.code === "ER_BAD_FIELD_ERROR")
      return res.status(404).send("Incorrect column name");
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  //Returns JSON
  try {
    const id: number = parseInt(req.params.id, 10);
    const item = await getItemByIDFromTable("channels", id);
    return item
      ? res.status(200).send(item)
      : res.status(404).send("A channel with that given id cannot be found");
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const deletedItem = await deleteItemByIDFromTable("channels", id);
    return deletedItem
      ? res.status(200).send("Record Successfully deleted")
      : res.status(404).send("A channel with the given ID was not found");
  } catch (err) {
    next(err);
  }
});
module.exports = router;

export default router;
