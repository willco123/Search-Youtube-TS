"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const search_1 = __importDefault(require("../routes/search"));
const videos_1 = __importDefault(require("../routes/videos"));
const channels_1 = __importDefault(require("../routes/channels"));
app.use(express_1.default.json());
app.use("/search", search_1.default);
app.use("/videos", videos_1.default);
app.use("/channels", channels_1.default);
exports.default = app;
