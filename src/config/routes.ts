import express from "express";
const app = express();
import search from "../routes/search";
import videos from "../routes/videos";
import channels from "../routes/channels";

app.use(express.json());
app.use("/search", search);
app.use("/videos", videos);
app.use("/channels", channels);

export default app;
