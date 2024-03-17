"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Student_1 = require("../controllers/Student");
const jwtVerification_1 = __importDefault(require("../middlewares/jwtVerification"));
const roleAuthentication_1 = require("../middlewares/roleAuthentication");
const multerInitialize_1 = __importDefault(require("../utilities/multerInitialize"));
const StudentRoutes = (0, express_1.Router)();
StudentRoutes.put("/edit_profile", multerInitialize_1.default.single("file"), jwtVerification_1.default, roleAuthentication_1.studentAuth, Student_1.edit_profile);
StudentRoutes.post("/rebate", jwtVerification_1.default, roleAuthentication_1.studentAuth, Student_1.fileMessRebate);
StudentRoutes.get("/rebate", jwtVerification_1.default, roleAuthentication_1.studentAuth, Student_1.getMessRebate);
StudentRoutes.post("/initialisePayment", jwtVerification_1.default, roleAuthentication_1.studentAuth, Student_1.initiateBillpayment);
StudentRoutes.post("/finishPayment", jwtVerification_1.default, roleAuthentication_1.studentAuth, Student_1.completePayment);
StudentRoutes.get("/payment/getkey", jwtVerification_1.default, roleAuthentication_1.studentAuth, Student_1.getkey);
exports.default = StudentRoutes;
