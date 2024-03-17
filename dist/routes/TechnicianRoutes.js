"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Technician_1 = require("../controllers/Technician");
const jwtVerification_1 = __importDefault(require("../middlewares/jwtVerification"));
const roleAuthentication_1 = require("../middlewares/roleAuthentication");
const TechnicianRoutes = (0, express_1.Router)();
TechnicianRoutes.put("/edit_profile", jwtVerification_1.default, roleAuthentication_1.technicianAuth, Technician_1.edit_profile);
exports.default = TechnicianRoutes;
