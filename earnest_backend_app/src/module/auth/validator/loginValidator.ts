import { NextFunction, Request, Response } from "express";
import { validateSchema } from "../../../utils/validator";

const schema = {
    type : "object",
    properties : {
        email : {
            type : "string",
            minLength: 3,
            errorMessage : {
                minLength : "email should be greater than 3 character"
            }
        },
        password : {
            type :"string",
            maxLength: 10,
            errorMessage : {
                maxLength : "password should be not greater than 10 character"
            }
        }
    },
    required : ["email", "password"],
    additionalProperties : false
}

export const loginValidator = (req : Request, res : Response, next : NextFunction) =>{
    const isValid = validateSchema(req, schema);

    if (isValid) {
        return res.status(400).json({ code : 105, errors : isValid.errors});
    }
    next();  
}