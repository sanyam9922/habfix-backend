import { Router } from "express";
import { edit_profile } from "../controllers/CollegeAdmin";
import authenticateToken from "../middlewares/jwtVerification";
import { collegeAdminAuth } from "../middlewares/roleAuthentication";

const collegeAdminRoutes: Router = Router();

collegeAdminRoutes.put("/edit_profile", authenticateToken, collegeAdminAuth, edit_profile);


export default collegeAdminRoutes;