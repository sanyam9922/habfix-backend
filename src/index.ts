import express, {Express, Request, Response} from "express"
import { PrismaClient } from '@prisma/client'
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import Razorpay from "razorpay";
import  RootRouter  from "./routes";

const prisma = new PrismaClient();
const app: Express = express();
const port = process.env.PORT;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use('/api',RootRouter);

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

app.get("/", async (req: Request, res: Response)=>{
    res.json("Express server");
});

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});

export { prisma };