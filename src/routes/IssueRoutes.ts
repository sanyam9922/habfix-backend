import { Router } from "express";
import { createIssue, getAllIssues } from "../controllers/Student";
import { assignHostelIssue, checkHostelIssue, reviewHostelIssue } from "../controllers/HostelAdmin";
import { assignCollegeIssue, checkCollegeIssue, reviewCollegeIssue } from "../controllers/CollegeAdmin";
import { Issuelist, resolveIssue, technicianList } from "../controllers/Technician";
import authenticateToken from "../middlewares/jwtVerification";
import { adminAuth, collegeAdminAuth, hostelAdminAuth, studentAuth, technicianAuth } from "../middlewares/roleAuthentication";
import upload from "../utilities/multerInitialize";

const IssueRoutes: Router = Router();

//students routes
IssueRoutes.post('/create', upload.single("file"), authenticateToken, studentAuth, createIssue);
IssueRoutes.get('/studentIssues', authenticateToken, studentAuth, getAllIssues);


//technician routes
IssueRoutes.get('/technicianIssues', authenticateToken, technicianAuth, Issuelist);
IssueRoutes.put('/resolve/:issue_id', authenticateToken, technicianAuth, resolveIssue);
IssueRoutes.get('/listTechnicians', authenticateToken, adminAuth, technicianList);


//hostel admin routes
IssueRoutes.put('/hostel/assign', authenticateToken, hostelAdminAuth, assignHostelIssue);
IssueRoutes.delete('/hostel/review/:issue_id', authenticateToken, hostelAdminAuth, reviewHostelIssue);
IssueRoutes.get('/hostel/checkIssues', authenticateToken, hostelAdminAuth, checkHostelIssue);


//college admin routes
IssueRoutes.put('/college/assign', authenticateToken, collegeAdminAuth, assignCollegeIssue);
IssueRoutes.delete('/college/review/:issue_id', authenticateToken, collegeAdminAuth, reviewCollegeIssue);
IssueRoutes.get('/college/checkIssues', authenticateToken, collegeAdminAuth, checkCollegeIssue);


export default IssueRoutes;