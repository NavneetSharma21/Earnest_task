import responseConstants from "../constants/responseConstants";
import { Request, Response } from "express";

class commonHelpers {
    constructor() {        
    }
    
    // get response code to return
    async getResponseCode(message : string){
        return responseConstants[message as keyof typeof responseConstants];
    }

    // prepare service response for final response
    async prepareResponse(status : number, messageCode : string , response : any){
        const returnResponse = response ? response : {};
        return {
            status,
            messageCode : await this.getResponseCode(messageCode), 
            response : returnResponse
        }        
    }

    // final response that API service return 
    async handleServiceResponse(req : Request, res : Response,  data: { status: number; messageCode: string; response: any }){
        try {
            return res.status(data.status).json({
                code: data.messageCode,
                response: data.response

            });            
        } catch (error) {
            return error;
        }
    }

    // store refresh token to cookie and http-only 
    async handleCookieResponse(res : Response, returnData : any){
        try {
            if (returnData.status === 200 && returnData.response?.refreshToken) {
                res.cookie("refreshToken", returnData.response.refreshToken, 
                    {
                        httpOnly: true,
                        secure: false, // true in production
                        sameSite: "strict",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    }
                );
                delete returnData.response.refreshToken;         
            }
        } catch (error) {
            throw error;
        }
    }
}

export default commonHelpers;