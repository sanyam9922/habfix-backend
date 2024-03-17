"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = exports.technicianAuth = exports.collegeAdminAuth = exports.hostelAdminAuth = exports.studentAuth = void 0;
function studentAuth(req, res, next) {
    if (req.user.role === 'student') {
        next();
    }
    else {
        return res.sendStatus(403);
    }
}
exports.studentAuth = studentAuth;
function hostelAdminAuth(req, res, next) {
    if (req.user.role === 'hostel_admin') {
        next();
    }
    else {
        return res.sendStatus(403);
    }
}
exports.hostelAdminAuth = hostelAdminAuth;
function collegeAdminAuth(req, res, next) {
    if (req.user.role === 'college_admin') {
        next();
    }
    else {
        return res.sendStatus(403);
    }
}
exports.collegeAdminAuth = collegeAdminAuth;
function technicianAuth(req, res, next) {
    if (req.user.role === 'technician') {
        next();
    }
    else {
        return res.sendStatus(403);
    }
}
exports.technicianAuth = technicianAuth;
function adminAuth(req, res, next) {
    if (req.user.role === 'hostel_admin' || req.user.role === 'college_admin') {
        next();
    }
    else {
        return res.sendStatus(403);
    }
}
exports.adminAuth = adminAuth;
