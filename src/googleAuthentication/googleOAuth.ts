import { Request, Response } from "express";
import "dotenv/config"
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { prisma } from "../index";

const client = new OAuth2Client(process.env.CLIENT_ID);

const googleLogin = async (req: Request, res: Response) => {
    const token = req.body.token;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });

    if (ticket.getPayload()) {
        const userInfo = ticket.getPayload();
        const name = userInfo?.name;
        const email = userInfo?.email;

        const student = await prisma.student.findUnique({
            where: {
                domain_id: email
            },
        });
       
        if (student != null || student != undefined) {
            const accessToken = jwt.sign({
                domain_id: student?.domain_id,
                role: 'student'
            }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true
            };
            res.cookie("token", accessToken, options).status(200).json({
                message: "Login successful",
                student,
                accessToken
            });
        }
        else {
            res.json({
                message: "User not found Register first"
            });
        }

    }
}

export default googleLogin;