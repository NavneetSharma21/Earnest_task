import { NextFunction, Request, Response } from "express";
import { tableConstants } from "../constants/tableConstants";
import prisma from "../prismaClient";
import jwtLibrary from "../libraries/jwtLibrary";
const jwtLibraryObj = new jwtLibrary();

interface AuthRequest extends Request {
  user?: any;
}

export const jwtVerify = async (req : AuthRequest, res: Response, next : NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
        return res.status(401).json({
            code: 401,
            error: "Token missing",
        });
        }

        const token = authHeader.split(" ")[1];
   
        const decode = await jwtLibraryObj.verifyToken(token);
        
        const userDetails = await prisma[tableConstants.USER].findUnique({ where: { id: decode.userId } });       
        if (!userDetails) return res.status(403).json({ code : 108, error : "invalid access token"})
            
        req.user = decode;
        
    } catch (error : any) {        
        if (error.name == "TokenExpiredError") {
            return res.status(401).json({ code : 109,  error : "Token expired" });
        }
        return res.status(403).json({ code : 108,  error : "Invalid access token" });    
    }
    next();
}