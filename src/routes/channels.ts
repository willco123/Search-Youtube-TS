import express from "express";
const router = express.Router();

import {
  getAllFromTable,
  getItemByIDFromTable,
  deleteItemByIDFromTable,
} from "../database-access/db-queries";
import { searchChannels } from "../services/search-request";
import checkForQuery from "../utils/check-for-query";

router.get("/", async (req, res, next) => {
  try {
    let query = req.query;
    var output;
    const isQuery = checkForQuery(query);

    if (isQuery) {
      output = await searchChannels(query);
    } else {
      output = await getAllFromTable("channels");
    }
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
    const id = req.params.id;
    console.log(typeof id);
    const item = await getItemByIDFromTable("channels", id);
    if (item === 0)
      return res
        .status(404)
        .send("A channel with that given id cannot be found");
    return res.status(200).send(item);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedItem = await deleteItemByIDFromTable("channels", id);
    if (deletedItem === 0)
      return res.status(404).send("A channel with the given ID was not found");

    return res.status(200).send("Record Successfully deleted");
  } catch (err) {
    next(err);
  }
});
module.exports = router;

export default router;
