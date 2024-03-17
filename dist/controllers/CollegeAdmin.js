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
exports.edit_profile = exports.checkCollegeIssue = exports.reviewCollegeIssue = exports.assignCollegeIssue = exports.login_collegeAdmin = exports.signup_collegeAdmin = void 0;
const index_1 = require("../index");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup_collegeAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id, name, role, college_name, password, phone_number, auth_key } = req.body;
        if (!domain_id || !name || !college_name || !password || !phone_number) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }
        if (role !== "college_admin") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign up as a college admin."
            });
        }
        const authInfo = yield index_1.prisma.authKey.findFirst({
            where: {
                role,
            },
            select: {
                key: true
            }
        });
        if ((authInfo === null || authInfo === void 0 ? void 0 : authInfo.key) != auth_key) {
            return res.status(400).json({
                success: false,
                message: "Invalid Auth Key"
            });
        }
        //check whether the college admin already exists or not
        const existingcollegeAdmin = yield index_1.prisma.college_admin.findUnique({
            where: {
                domain_id
            }
        });
        if (existingcollegeAdmin) {
            return res.status(400).json({
                success: false,
                message: "college Admin already exists. Please sign in to continue."
            });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const collegeAdmin = yield index_1.prisma.college_admin.create({
            data: {
                name,
                domain_id,
                college_name,
                phone_number,
                password: hashedPassword
            }
        });
        return res.status(200).json({
            success: true,
            message: "college Admin created successfully",
            collegeAdmin
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.signup_collegeAdmin = signup_collegeAdmin;
const login_collegeAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id, password } = req.body;
        if (!domain_id || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }
        if (req.body.role !== "college_admin") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a college admin."
            });
        }
        const collegeAdmin = yield index_1.prisma.college_admin.findUnique({
            where: {
                domain_id
            }
        });
        if (!collegeAdmin) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        //check if the password is correct
        const validPassword = yield bcrypt_1.default.compare(password, collegeAdmin.password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        //create and assign a token
        const token = jsonwebtoken_1.default.sign({
            domain_id: collegeAdmin.domain_id,
            role: "college_admin"
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // Set cookie for token and return success response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        return res.cookie("token", token, options).status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            collegeAdmin
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.login_collegeAdmin = login_collegeAdmin;
const assignCollegeIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id } = req.user;
        const { issue_id, technician_id } = req.body;
        if (domain_id == null || domain_id == undefined) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        if (!technician_id) {
            return res.status(400).json({
                success: false,
                message: "No Technician selected"
            });
        }
        const issue = yield index_1.prisma.issue.findUnique({
            where: {
                issue_id: Number(issue_id),
            },
        });
        const technician = yield index_1.prisma.technician.findUnique({
            where: {
                technician_id: technician_id,
            },
        });
        if ((issue === null || issue === void 0 ? void 0 : issue.category) !== (technician === null || technician === void 0 ? void 0 : technician.category)) {
            return res.status(400).json({
                success: false,
                error: "please select technician with matching category",
            });
        }
        const updatedIssue = yield index_1.prisma.issue.update({
            where: {
                issue_id: Number(issue_id),
            },
            data: {
                technician_id: technician_id,
            },
        });
        return res.json({
            success: true,
            message: "Issue assigned successfully",
            issue: updatedIssue,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.assignCollegeIssue = assignCollegeIssue;
const reviewCollegeIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id } = req.user;
        const issue_id = parseInt(req.params.issue_id);
        if (!domain_id) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        const issue = yield index_1.prisma.issue.delete({
            where: {
                issue_id
            }
        });
        return res.status(200).json({
            success: true,
            message: "Issues reviewed and resolved successfully",
            issue
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
});
exports.reviewCollegeIssue = reviewCollegeIssue;
const checkCollegeIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id } = req.user;
        if (!domain_id) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        const issues = yield index_1.prisma.issue.findMany({
            where: {
                location: 'College'
            },
            include: {
                technician: true
            }
        });
        return res.status(200).json({
            success: true,
            message: "Here is the list of assigned issues",
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
exports.checkCollegeIssue = checkCollegeIssue;
//route for edit collegeAdmin profile
const edit_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id } = req.user;
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.edit_profile = edit_profile;
