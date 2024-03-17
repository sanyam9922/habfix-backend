"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CollegeAdmin_1 = require("../controllers/CollegeAdmin");
const jwtVerification_1 = __importDefault(require("../middlewares/jwtVerification"));
const roleAuthentication_1 = require("../middlewares/roleAuthentication");
const collegeAdminRoutes = (0, express_1.Router)();
collegeAdminRoutes.put("/edit_profile", jwtVerification_1.default, roleAuthentication_1.collegeAdminAuth, CollegeAdmin_1.edit_profile);
exports.default = collegeAdminRoutes;
