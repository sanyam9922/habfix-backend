import { Request, Response, NextFunction } from "express";
import AuthenticatedRequest from "../interfaces/authenticatedRequest";

function studentAuth(req: Request, res: Response, next: NextFunction) {
    if ((req as AuthenticatedRequest).user.role === 'student') {
        next();
    }
    else {
        return res.sendStatus(403);
    }
}

function hostelAdminAuth(req: Request, res: Response, next: NextFunction) {
    if ((req as AuthenticatedRequest).user.role === 'hostel_admin') {
        next();
    }
    else {
        return res.sendStatus(403);
    }
}

function collegeAdminAuth(req: Request, res: Response, next: NextFunction) {
    if ((req as AuthenticatedRequest).user.role === 'college_admin') {
        next();
    }
    else {
        return res.sendStatus(403);
    }
}


function technicianAuth(req: Request, res: Response, next: NextFunction) {
    if ((req as AuthenticatedRequest).user.role === 'technician') {
        next();
    }
    else {
        return res.sendStatus(403);
    }
}

function adminAuth(req: Request, res: Response, next: NextFunction){
    if ((req as AuthenticatedRequest).user.role === 'hostel_admin' || (req as AuthenticatedRequest).user.role === 'college_admin') {
        next();
    }
    else {
        return res.sendStatus(403);
    }
}

export { studentAuth, hostelAdminAuth, collegeAdminAuth, technicianAuth, adminAuth };