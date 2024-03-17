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
exports.getkey = exports.completePayment = exports.initiateBillpayment = exports.getMessRebate = exports.fileMessRebate = exports.edit_profile = exports.getAllIssues = exports.createIssue = exports.login_student = exports.signup_student = void 0;
const index_1 = require("../index");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinaryManager_1 = require("../utilities/cloudinaryManager");
const crypto_1 = __importDefault(require("crypto"));
const signup_student = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = yield (0, cloudinaryManager_1.handleUpload)(dataURI);
        req.body.profile_pic = cldRes;
    }
    catch (error) {
        console.log(error);
        req.body.profile_pic = null;
    }
    try {
        const { domain_id, name, role, hostel, password, phone_number, room_number, profile_pic, } = req.body;
        if (!domain_id || !name || !hostel || !password) {
            return res.status(400).json({
                success: false,
                error: "Please fill all fields",
            });
        }
        if (role !== "student") {
            return res.status(400).json({
                success: false,
                error: "Invalid access to this route. Please sign up as a student.",
            });
        }
        // check if user already exists or not
        const existingstudent = yield index_1.prisma.student.findUnique({
            where: {
                domain_id,
            },
        });
        if (existingstudent) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const student = yield index_1.prisma.student.create({
            data: {
                name,
                domain_id,
                hostel,
                phone_number,
                room_number,
                password: hashedPassword,
                profile_picture: profile_pic,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Student created successfully",
            student,
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            error: "Something went wrong",
        });
    }
});
exports.signup_student = signup_student;
const login_student = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id, password } = req.body;
        if (!domain_id || !password) {
            return res.status(400).json({
                success: false,
                error: "Please fill all fields",
            });
        }
        if (req.body.role !== "student") {
            return res.status(400).json({
                success: false,
                error: "Invalid access to this route. Please sign in as a student.",
            });
        }
        const student = yield index_1.prisma.student.findUnique({
            where: {
                domain_id,
            },
        });
        if (!student) {
            return res.status(400).json({
                success: false,
                error: "Invalid credentials",
            });
        }
        // check if password is correct
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, student.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                error: "Invalid credentials",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            domain_id: student.domain_id,
            role: "student",
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // Set cookie for token and return success response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        return res.cookie("token", token, options).status(200).json({
            success: true,
            message: "Login successful",
            token,
            student,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Something went wrong",
        });
    }
});
exports.login_student = login_student;
const createIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, location, title, is_public, description } = req.body;
        const student_id = req.user.domain_id;
        const role = req.user.role;
        if (!category || !title || !location || !description) {
            return res.status(400).json({
                success: false,
                error: "Please fill all fields",
            });
        }
        if (role !== "student") {
            return res.status(400).json({
                success: false,
                error: "Invalid access to this route. Please sign in as a student.",
            });
        }
        let isPublic = false;
        if (is_public === "true") {
            isPublic = true;
        }
        let issue_media = null;
        try {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cldRes = yield (0, cloudinaryManager_1.handleUpload)(dataURI);
            req.body.issue_media = cldRes;
            issue_media = req.body.issue_media;
        }
        catch (error) {
            req.body.issue_media = null;
        }
        const issue = yield index_1.prisma.issue.create({
            data: {
                category,
                title,
                location,
                is_public: isPublic,
                description,
                issue_media: issue_media,
                student: {
                    connect: { domain_id: student_id },
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: "Issue created successfully",
            issue,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Something went wrong",
        });
    }
});
exports.createIssue = createIssue;
const getAllIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id } = req.user;
        const { role } = req.user;
        if (role !== "student") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a student.",
            });
        }
        const issues = yield index_1.prisma.issue.findMany({
            where: {
                student_id: domain_id,
            },
        });
        if (issues.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No issues found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Issues fetched successfully",
            issues,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
exports.getAllIssues = getAllIssues;
// generate a Notification once issue created preferably sms ( TODO :)
//route for edit student profile
const edit_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id } = req.user;
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
exports.edit_profile = edit_profile;
// file Mess rebate
const fileMessRebate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to, reason } = req.body;
        const student_id = req.user.domain_id;
        const { role } = req.user;
        if (role != "student") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a student.",
            });
        }
        if (!student_id) {
            return res.status(400).json({
                success: false,
                error: "Invalid access to this route. Please sign in as a student.",
            });
        }
        if (!to || !reason) {
            return res.status(400).json({
                success: false,
                error: "Please fill all fields",
            });
        }
        const formattedFrom = new Date(from);
        const formattedTo = new Date(to);
        const messRebate = yield index_1.prisma.rebate.create({
            data: {
                from: formattedFrom,
                to: formattedTo,
                reason,
                student: {
                    connect: { domain_id: student_id },
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: "Mess Rebate filed successfully",
            messRebate,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
exports.fileMessRebate = fileMessRebate;
const getMessRebate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id } = req.user;
        const { role } = req.user;
        if (role !== "student") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a student.",
            });
        }
        if (!domain_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a student.",
            });
        }
        const messRebates = yield index_1.prisma.rebate.findMany({
            where: {
                student_id: domain_id,
            },
        });
        if (messRebates.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No mess rebates found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Mess rebates fetched successfully",
            messRebates,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
exports.getMessRebate = getMessRebate;
const initiateBillpayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id } = req.user;
        const { role } = req.user;
        if (!domain_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a student.",
            });
        }
        if (role !== "student") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a student.",
            });
        }
        const student = yield index_1.prisma.student.findUnique({
            where: {
                domain_id,
            }
        });
        const billAmount = student === null || student === void 0 ? void 0 : student.mess_due;
        const options = {
            amount: Number(billAmount * 100),
            currency: "INR",
        };
        const order = yield index_1.instance.orders.create(options);
        return res.status(200).json({
            success: true,
            message: "Bill payment initiated",
            order
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
exports.initiateBillpayment = initiateBillpayment;
const completePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");
        const isAuthentic = expectedSignature === razorpay_signature;
        if (isAuthentic) {
            yield index_1.prisma.payment.create({
                data: {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    student: {
                        connect: {
                            domain_id: req.user.domain_id
                        }
                    }
                }
            });
            const student = yield index_1.prisma.student.update({
                where: {
                    domain_id: req.user.domain_id,
                },
                data: {
                    mess_due: "0",
                },
            });
            return res.status(200).json({
                message: "Payment successful",
                student
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
exports.completePayment = completePayment;
const getkey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain_id } = req.user;
        const { role } = req.user;
        if (!domain_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a student.",
            });
        }
        if (role !== "student") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a student.",
            });
        }
        const key = process.env.RAZORPAY_KEY_ID;
        return res.status(200).json({
            success: true,
            key
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
exports.getkey = getkey;
