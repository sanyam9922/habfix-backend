import { Router } from "express";
import { edit_profile } from "../controllers/Technician";
import authenticateToken from "../middlewares/jwtVerification";
import { technicianAuth } from "../middlewares/roleAuthentication";

const TechnicianRoutes:Router = Router();
TechnicianRoutes.put("/edit_profile",authenticateToken, technicianAuth ,edit_profile);

export default TechnicianRoutes;