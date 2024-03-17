"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CollegeAdminRoutes_1 = __importDefault(require("./CollegeAdminRoutes"));
const HostelAdminRoutes_1 = __importDefault(require("./HostelAdminRoutes"));
const AdminRoutes = (0, express_1.Router)();
// by this we can use /admin/college_admin and /admin/hostel_admin routes in AdminRoutes 
AdminRoutes.use('/college', CollegeAdminRoutes_1.default);
AdminRoutes.use('/hostel', HostelAdminRoutes_1.default);
exports.default = AdminRoutes;
