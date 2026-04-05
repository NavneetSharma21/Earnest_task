import Ajv, { JSONSchemaType, ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";
import { Request } from "express";

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  $data: true,
});

addFormats(ajv);
ajvErrors(ajv);

// define return type
interface ValidationResult {
  valid: boolean;
  errors: string[] | null;
}

export const validateSchema = (
  req: Request,
  schema: JSONSchemaType<any> | any
): ValidationResult | null => {
  
  const validate = ajv.compile(schema);

  // safely pick data
  const data =
    req.body && Object.keys(req.body).length > 0
      ? req.body
      : (req.query as any);

  const valid = validate(data);

  if (!valid) {
    return {
      valid: false,
      errors: validate.errors
        ? validate.errors.map((err: ErrorObject) => err.message || "Invalid value")
        : ["Validation error"]
    };
  }

  return null; // no errors
};