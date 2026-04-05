import { NextFunction, Request, Response } from "express";
import { validateSchema } from "../../../utils/validator";

const schema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 3 }
  },
  required: ["title"],
  additionalProperties: false
};

export const addTaskValidator = (req : Request, res : Response, next : NextFunction) => {
    const isValid = validateSchema(req, schema);
   
    if (isValid) {   
        return res.status(400).json({ code: 105, errors : isValid.errors});
    }  
    next();  
}
