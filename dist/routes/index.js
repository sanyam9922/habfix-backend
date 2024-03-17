"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StudentRoutes_1 = __importDefault(require("./StudentRoutes"));
const AdminRoutes_1 = __importDefault(require("./AdminRoutes"));
const TechnicianRoutes_1 = __importDefault(require("./TechnicianRoutes"));
const LoginRoutes_1 = __importDefault(require("./LoginRoutes"));
const SignupRoutes_1 = __importDefault(require("./SignupRoutes"));
const IssueRoutes_1 = __importDefault(require("./IssueRoutes"));
const RootRouter = (0, express_1.Router)();
// public routes
RootRouter.use('/signup', SignupRoutes_1.default);
RootRouter.use('/login', LoginRoutes_1.default);
// protected routes
RootRouter.use('/issue', IssueRoutes_1.default);
// CRUD routes for Entities
RootRouter.use('/student', StudentRoutes_1.default);
RootRouter.use('/admin', AdminRoutes_1.default);
RootRouter.use('/technician', TechnicianRoutes_1.default);
exports.default = RootRouter;
