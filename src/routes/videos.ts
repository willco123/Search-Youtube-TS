import express from "express";
const router = express.Router();

router.get("/", (_req, res, _next) => {
  return res.status(200).send("Test");
});

export default router;
