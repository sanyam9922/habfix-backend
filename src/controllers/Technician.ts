import { Request, Response } from "express";
import { prisma } from "../index"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { log } from "console";
import AuthenticatedRequest from "../interfaces/authenticatedRequest";


export const signup_technician = async (req: Request, res: Response) => {
    try {
        const { name, email, role, category, password, phone_number, Address } = req.body;

        if (!name || !email || !password || !category || !phone_number) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        if (role !== "technician") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign up as a technician."
            });
        }

        //check whether the technician already exists or not
        const existingTechnician = await prisma.technician.findFirst({
            where: {
                email: email
            }
        });

        if (existingTechnician) {
            return res.status(400).json({
                success: false,
                message: "Technician already exists. Please Log in to continue."
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const technician = await prisma.technician.create({
            data: {
                name,
                email,
                category,
                phone_number,
                Address,
                password: hashedPassword
            }
        });
        return res.status(200).json({
            success: true,
            message: "Technician created successfully",
            technician
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const login_technician = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        if (req.body.role !== "technician") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a technician."
            });
        }

        const technician = await prisma.technician.findFirst({
            where: {
                email
            },
        });

        if (!technician) {
            return res.status(400).json({
                success: false,
                message: "Technician does not exist. Please sign up to continue."
            });
        }

        //compare the password
        const isPassword = await bcrypt.compare(password, technician.password);

        if (!isPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({
            email: technician.email,
            role: "technician"
        }, process.env.JWT_SECRET!);

        // Set cookie for token and return success response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        return res.cookie("token", token, options).status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            technician
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}


export const Issuelist = async (req: Request, res: Response) => {
    try {
        const { email } = (req as AuthenticatedRequest).user;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        const issues = await prisma.issue.findMany({
            where: {
                technician: {
                    email: email
                }
            }
        });

        if (!issues) {
            return res.status(200).json({
                success: true,
                message: "No issues found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "These are the issues assigned to you.",
            issues
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const resolveIssue = async (req: Request, res: Response) => {
    try {
        const issue_id = parseInt(req.params.issue_id);
        const { email } = (req as AuthenticatedRequest).user;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        if (!issue_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid issue id"
            });
        }

        await prisma.issue.update({
            where: {
                issue_id: issue_id,
                technician: {
                    email: email
                }
            },
            data: {
                is_resolved: true
            }
        });

        return res.status(200).json({
            success: true,
            message: "Issue resolved successfully"
        });


    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const technicianList = async (req: Request, res: Response) => {
    try {
        const { domain_id } = (req as AuthenticatedRequest).user;
        if (!domain_id) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const technicians = await prisma.technician.findMany();
        if (technicians.length == 0) {
            return res.json({
                success: false,
                message: "No technicians found"
            });
        }

        res.json({
            success: true,
            technicians
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

//route for edit Technician profile
export const edit_profile=async(req:Request , res:Response)=>{
    try {
        const {email} = (req as AuthenticatedRequest).user;
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}