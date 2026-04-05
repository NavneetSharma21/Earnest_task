import { NextFunction, Request, Response } from "express";
import { validateSchema } from "../../../utils/validator";

const schema = {
  type: "object",
  properties: {
    fullName: { type: "string", minLength: 3 },
    email: { type: "string", format: "email" },
    password: { type: "string" },
    cnfPassword: { 
        type: "string", 
        const: { $data: "1/password" },
        errorMessage: {
            const: "Password and Confirm Password must match"
        }
    }
  },
  required: ["fullName", "email", "password", "cnfPassword"],
  additionalProperties: false
};

export const signupValidator = (req : Request, res : Response, next : NextFunction) => {   
    const isValid = validateSchema(req, schema);
   
    if (isValid) {   
        return res.status(400).json({ code: 105, errors : isValid.errors});
    }  
    next();  
}
