import { Router } from "express";
import { signup_student } from "../controllers/Student";
import { signup_technician } from "../controllers/Technician";
import { signup_hostelAdmin } from "../controllers/HostelAdmin";
import { signup_collegeAdmin } from "../controllers/CollegeAdmin";
import upload from "../utilities/multerInitialize";

const SignupRoutes: Router = Router();

SignupRoutes.post('/student', upload.single("file"), signup_student);
SignupRoutes.post('/technician', signup_technician);
SignupRoutes.post('/admin/hostel', signup_hostelAdmin);
SignupRoutes.post('/admin/college', signup_collegeAdmin);

export default SignupRoutes;