"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader === undefined || authHeader === null) {
        return res.sendStatus(401);
    }
    else {
        const token = authHeader.split(' ')[1];
        if (process.env.JWT_SECRET) {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (error, user) => {
                if (error) {
                    return res.sendStatus(403);
                }
                else {
                    req.user = user;
                    next();
                }
            });
        }
        else {
            res.sendStatus(403);
        }
    }
}
exports.default = authenticateToken;
