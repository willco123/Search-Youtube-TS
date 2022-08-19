"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const yt_data_api_1 = __importDefault(require("../services/yt-data-api"));
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, yt_data_api_1.default)();
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
}));
exports.default = router;
