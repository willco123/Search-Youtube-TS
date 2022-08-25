"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const yt_data_api_1 = __importDefault(require("../services/yt-data-api"));
router.post("/", async (req, res, next) => {
    try {
        const searchArray = Object.values(req.body);
        await (0, yt_data_api_1.default)(searchArray);
        return res.status(200).send("Items stored in DB!");
    }
    catch (err) {
        if (err.code == 403) {
            res.status(403).send("Forbidden, Quota exceeded");
        }
        else {
            next(err);
        }
    }
});
exports.default = router;
