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
exports.prisma = exports.instance = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const razorpay_1 = __importDefault(require("razorpay"));
const routes_1 = __importDefault(require("./routes"));
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'https://65f69753cac9134c5d52f6dc--delicate-duckanoo-dc7e2d.netlify.app/'
}));
app.use('/api', routes_1.default);
exports.instance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json("Express server");
}));
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
