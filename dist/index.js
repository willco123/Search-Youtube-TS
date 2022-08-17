"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const port = process.env.PORT || 3004;
console.log(process.env.NODE_ENV);
app_1.app.listen(port, () => console.log(`Listening on port ${port}`));
