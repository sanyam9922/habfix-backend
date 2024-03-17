import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import AuthenticatedRequest from "../interfaces/authenticatedRequest";

function authenticateToken(req: Request, res: Response, next: NextFunction){
    
    const authHeader = req.headers['authorization'];

    if(authHeader === undefined || authHeader === null){
        return res.sendStatus(401);
    }
    else{
        const token = authHeader.split(' ')[1];
        if(process.env.JWT_SECRET){
            jwt.verify(token, process.env.JWT_SECRET, (error: any, user: any) => {
                if(error){
                    return res.sendStatus(403);
                }
                else{
                    (req as AuthenticatedRequest).user = user;
                    next();
                }
            });
        }
        else{
            res.sendStatus(403);
        }

    }
}

export default authenticateToken;