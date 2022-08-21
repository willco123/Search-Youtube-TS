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
const db_queries_1 = require("../database-access/db-queries");
const search_request_1 = require("../services/search-request");
const check_for_query_1 = __importDefault(require("../utils/check-for-query"));
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = req.query;
        var output;
        const isQuery = (0, check_for_query_1.default)(query);
        if (isQuery) {
            output = yield (0, search_request_1.searchChannels)(query);
        }
        else {
            output = yield (0, db_queries_1.getAllFromTable)("channels");
        }
        return res.status(200).send(output);
    }
    catch (err) {
        if (err.code === "ER_BAD_FIELD_ERROR")
            return res.status(404).send("Incorrect column name");
        next(err);
    }
}));
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Returns JSON
    try {
        const id = req.params.id;
        console.log(typeof id);
        const item = yield (0, db_queries_1.getItemByIDFromTable)("channels", id);
        if (item === 0)
            return res
                .status(404)
                .send("A channel with that given id cannot be found");
        return res.status(200).send(item);
    }
    catch (err) {
        next(err);
    }
}));
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deletedItem = yield (0, db_queries_1.deleteItemByIDFromTable)("channels", id);
        if (deletedItem === 0)
            return res.status(404).send("A channel with the given ID was not found");
        return res.status(200).send("Record Successfully deleted");
    }
    catch (err) {
        next(err);
    }
}));
module.exports = router;
exports.default = router;
