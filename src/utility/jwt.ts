import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

export const generateToken = (userId: number, role: string) => {
    console.log(process.env.JWT_SECRET);
    
    return jwt.sign({id: userId, role}, process.env.JWT_SECRET!, {expiresIn: "2d"});
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
}