import express from "express";
const router = express.Router();

import getSearchResults from "../services/yt-data-api";

router.post("/", async (req, res, next) => {
  try {
    const searchArray: string[] = Object.values(req.body);
    await getSearchResults(searchArray);
    return res.status(200).send("Items stored in DB!");
  } catch (err: any) {
    if (err.code == 403) {
      res.status(403).send("Forbidden, Quota exceeded");
    } else {
      next(err);
    }
  }
});

export default router;
