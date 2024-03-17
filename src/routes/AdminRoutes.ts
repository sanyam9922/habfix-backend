import { Router } from "express";
import collegeAdminRoutes from "./CollegeAdminRoutes";
import hostelAdminRoutes from "./HostelAdminRoutes";

const AdminRoutes:Router = Router();

// by this we can use /admin/college_admin and /admin/hostel_admin routes in AdminRoutes 
AdminRoutes.use('/college',collegeAdminRoutes);
AdminRoutes.use('/hostel',hostelAdminRoutes); 

export default AdminRoutes;