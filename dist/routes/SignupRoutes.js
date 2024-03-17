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
const multerInitialize_1 = __importDefault(require("../utilities/multerInitialize"));
const SignupRoutes = (0, express_1.Router)();
SignupRoutes.post('/student', multerInitialize_1.default.single("file"), Student_1.signup_student);
SignupRoutes.post('/technician', Technician_1.signup_technician);
SignupRoutes.post('/admin/hostel', HostelAdmin_1.signup_hostelAdmin);
SignupRoutes.post('/admin/college', CollegeAdmin_1.signup_collegeAdmin);
exports.default = SignupRoutes;
