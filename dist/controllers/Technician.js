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
exports.edit_profile = exports.technicianList = exports.resolveIssue = exports.Issuelist = exports.login_technician = exports.signup_technician = void 0;
const index_1 = require("../index");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup_technician = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, role, category, password, phone_number, Address } = req.body;
        if (!name || !email || !password || !category || !phone_number) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }
        if (role !== "technician") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign up as a technician."
            });
        }
        //check whether the technician already exists or not
        const existingTechnician = yield index_1.prisma.technician.findFirst({
            where: {
                email: email
            }
        });
        if (existingTechnician) {
            return res.status(400).json({
                success: false,
                message: "Technician already exists. Please Log in to continue."
            });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const technician = yield index_1.prisma.technician.create({
            data: {
                name,
                email,
                category,
                phone_number,
                Address,
                password: hashedPassword
            }
        });
        return res.status(200).json({
            success: true,
            message: "Technician created successfully",
            technician
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.signup_technician = signup_technician;
const login_technician = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }
        if (req.body.role !== "technician") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a technician."
            });
        }
        const technician = yield index_1.prisma.technician.findFirst({
            where: {
                email
            },
        });
        if (!technician) {
            return res.status(400).json({
                success: false,
                message: "Technician does not exist. Please sign up to continue."
            });
        }
        //compare the password
        const isPassword = yield bcrypt_1.default.compare(password, technician.password);
        if (!isPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            email: technician.email,
            role: "technician"
        }, process.env.JWT_SECRET);
        // Set cookie for token and return success response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        return res.cookie("token", token, options).status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            technician
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.login_technician = login_technician;
const Issuelist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.user;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }
        const issues = yield index_1.prisma.issue.findMany({
            where: {
                technician: {
                    email: email
                }
            }
        });
        if (!issues) {
            return res.status(200).json({
                success: true,
                message: "No issues found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "These are the issues assigned to you.",
            issues
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.Issuelist = Issuelist;
const resolveIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issue_id = parseInt(req.params.issue_id);
        const { email } = req.user;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }
        if (!issue_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue id"
            });
        }
        yield index_1.prisma.issue.update({
            where: {
                issue_id: issue_id,
                technician: {
                    email: email
                }
            },
            data: {
                is_resolved: true
            }
        });
        return res.status(200).json({
            success: true,
            message: "Issue resolved successfully"
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.resolveIssue = resolveIssue;
const technicianList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id } = req.user;
        if (!domain_id) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        const technicians = yield index_1.prisma.technician.findMany();
        if (technicians.length == 0) {
            return res.json({
                success: false,
                message: "No technicians found"
            });
        }
        res.json({
            success: true,
            technicians
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.technicianList = technicianList;
//route for edit Technician profile
const edit_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.user;
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.edit_profile = edit_profile;
