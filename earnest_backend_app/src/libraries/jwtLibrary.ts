import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/authTypes";

class jwtLibrary {
    constructor() {        
    }

    // Common function to create access and refresh token
    async generateToken(userPayload : any, isRefreshToken = false ){
        try {
            const userData = JSON.parse(JSON.stringify(userPayload));

            const secretKey = isRefreshToken ? process.env.REFRESH_TOKEN_SECRET :  process.env.ACCESS_TOKEN_SECRET;
            const expiresIn = isRefreshToken ? "7d" : "1m";

            if (!secretKey) {
                throw new Error("JWT secret key missing");
            }
            
            const token = await jwt.sign(userData, secretKey, { expiresIn : expiresIn})

            return token;
            
        } catch (error) {
            return error;
        }       
    }

    // Common function to create access and refresh token
    async verifyToken(token : string, isRefreshToken = false ){
        try {
            const secretKey = isRefreshToken ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET;
    
            if (!secretKey) {
                throw new Error("JWT secret key missing");
            }

            const tokenData = await jwt.verify(token, secretKey);            
            return tokenData as JwtPayload;
            
        } catch (error) {
            throw error
        }       
    }
}

export default jwtLibrary;