import { Request, Response } from "express";
import { prisma } from "../index"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthenticatedRequest from "../interfaces/authenticatedRequest";

export const signup_collegeAdmin = async (req: Request, res: Response) => {
    try {
        const { domain_id, name, role, college_name, password, phone_number, auth_key } = req.body;

        if (!domain_id || !name || !college_name || !password || !phone_number) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        if (role !== "college_admin") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign up as a college admin."
            });
        }
        const authInfo = await prisma.authKey.findFirst({
            where: {
                role,
            },
            select: {
                key: true
            }
        });
        if (authInfo?.key != auth_key) {
            return res.status(400).json({
                success: false,
                message: "Invalid Auth Key"
            });
        }
        //check whether the college admin already exists or not
        const existingcollegeAdmin = await prisma.college_admin.findUnique(
            {
                where: {
                    domain_id
                }
            }
        );
        if (existingcollegeAdmin) {
            return res.status(400).json({
                success: false,
                message: "college Admin already exists. Please sign in to continue."
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const collegeAdmin = await prisma.college_admin.create({
            data: {
                name,
                domain_id,
                college_name,
                phone_number,
                password: hashedPassword
            }
        });

        return res.status(200).json({
            success: true,
            message: "college Admin created successfully",
            collegeAdmin
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const login_collegeAdmin = async (req: Request, res: Response) => {
    try {
        const { domain_id, password } = req.body;
        if (!domain_id || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        if (req.body.role !== "college_admin") {
            return res.status(400).json({
                success: false,
                message: "Invalid access to this route. Please sign in as a college admin."
            });
        }
        const collegeAdmin = await prisma.college_admin.findUnique({
            where: {
                domain_id
            }
        })

        if (!collegeAdmin) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        //check if the password is correct
        const validPassword = await bcrypt.compare(password, collegeAdmin.password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        //create and assign a token
        const token = jwt.sign({
            domain_id: collegeAdmin.domain_id,
            role: "college_admin"
        }, process.env.JWT_SECRET!,
            { expiresIn: "1h" })

        // Set cookie for token and return success response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        return res.cookie("token", token, options).status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            collegeAdmin
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }

}


export const assignCollegeIssue = async (req: Request, res: Response) => {
    try {
        const { domain_id } = (req as AuthenticatedRequest).user;
        const { issue_id, technician_id } = req.body;
        if (domain_id == null || domain_id == undefined) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        if (!technician_id) {
            return res.status(400).json({
                success: false,
                message: "No Technician selected"
            });
        }
        const issue = await prisma.issue.findUnique({
            where: {
                issue_id: Number(issue_id),
            },
        });

        const technician = await prisma.technician.findUnique({
            where: {
                technician_id: technician_id,
            },
        });

        if (issue?.category !== technician?.category) {
            return res.status(400).json({
                success: false,
                error: "please select technician with matching category",
            });
        }
        const updatedIssue = await prisma.issue.update({
            where: {
                issue_id: Number(issue_id),
            },
            data: {
                technician_id: technician_id,
            },
        });

        return res.json({
            success: true,
            message: "Issue assigned successfully",
            issue: updatedIssue,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const reviewCollegeIssue = async (req: Request, res: Response) => {
    try {
        const { domain_id } = (req as AuthenticatedRequest).user;
        const issue_id = parseInt(req.params.issue_id);

        if (!domain_id) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        const issue = await prisma.issue.delete({
            where: {
                issue_id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Issues reviewed and resolved successfully",
            issue
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
}

export const checkCollegeIssue = async (req: Request, res: Response) => {
    try {
        const { domain_id } = (req as AuthenticatedRequest).user;
        if (!domain_id) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        const issues = await prisma.issue.findMany({
            where: {
                location: 'College'
            },
            include: {
                technician: true
            }
        });
        return res.status(200).json({
            success: true,
            message: "Here is the list of assigned issues",
            issues
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });

    }
}


//route for edit collegeAdmin profile
export const edit_profile = async (req: Request, res: Response) => {
    try {
        const { domain_id } = (req as AuthenticatedRequest).user;
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}