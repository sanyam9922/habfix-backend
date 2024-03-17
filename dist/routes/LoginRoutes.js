"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Student_1 = require("../controllers/Student");
const Technician_1 = require("../controllers/Technician");
const HostelAdmin_1 = require("../controllers/HostelAdmin");
const CollegeAdmin_1 = require("../controllers/CollegeAdmin");
const googleOAuth_1 = __importDefault(require("../googleAuthentication/googleOAuth"));
const LoginRoutes = (0, express_1.Router)();
LoginRoutes.post('/student', Student_1.login_student);
LoginRoutes.post('/student/v1/google', googleOAuth_1.default);
LoginRoutes.post('/technician', Technician_1.login_technician);
LoginRoutes.post('/admin/hostel', HostelAdmin_1.login_hostelAdmin);
LoginRoutes.post('/admin/college', CollegeAdmin_1.login_collegeAdmin);
exports.default = LoginRoutes;
