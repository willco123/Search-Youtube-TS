import express from "express";
const router = express.Router();

import { getSearchResults } from "../services/yt-data-api";

router.get("/", async (_req, res, next) => {
  try {
    await getSearchResults();
    return res.status(200).send("Items stored in DB!");
  } catch (err) {
    if (err.code == 403) {
      res.status(403).send("Forbidden, Quota exceeded");
    } else {
      next(err);
    }
  }
});

export default router;
