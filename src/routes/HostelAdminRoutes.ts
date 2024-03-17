import { Router } from "express";
import { checkRebates, edit_profile, getStudents, updateBill } from "../controllers/HostelAdmin";
import { hostelAdminAuth } from "../middlewares/roleAuthentication";
import authenticateToken from "../middlewares/jwtVerification";

const hostelAdminRoutes: Router = Router();

hostelAdminRoutes.put("/edit_profile",authenticateToken, hostelAdminAuth, edit_profile);
hostelAdminRoutes.get("/checkRebates",authenticateToken, hostelAdminAuth, checkRebates);
hostelAdminRoutes.get("/listStudents",authenticateToken, hostelAdminAuth, getStudents);
hostelAdminRoutes.put('/messDues',authenticateToken, hostelAdminAuth, updateBill);

export default hostelAdminRoutes;