import "dotenv/config";
import app from "./app";

const port = process.env.PORT || 3004;
console.log(process.env.NODE_ENV);
app.listen(port, () => console.log(`Listening on port ${port}`));
