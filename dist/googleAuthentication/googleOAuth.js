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
require("dotenv/config");
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID);
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const ticket = yield client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    if (ticket.getPayload()) {
        const userInfo = ticket.getPayload();
        const name = userInfo === null || userInfo === void 0 ? void 0 : userInfo.name;
        const email = userInfo === null || userInfo === void 0 ? void 0 : userInfo.email;
        const student = yield index_1.prisma.student.findUnique({
            where: {
                domain_id: email
            },
        });
        if (student != null || student != undefined) {
            const accessToken = jsonwebtoken_1.default.sign({
                domain_id: student === null || student === void 0 ? void 0 : student.domain_id,
                role: 'student'
            }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true
            };
            res.cookie("token", accessToken, options).status(200).json({
                message: "Login successful",
                student,
                accessToken
            });
        }
        else {
            res.json({
                message: "User not found Register first"
            });
        }
    }
});
exports.default = googleLogin;
