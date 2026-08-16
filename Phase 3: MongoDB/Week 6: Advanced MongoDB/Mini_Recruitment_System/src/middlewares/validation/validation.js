import ValidationError from "../../errors/ValidationError.js";
import mapZodErrors from "./mapZodErrors.js";
function validate(schemas) {
  return (req, res, next) => {
    const sources = Object.keys(schemas);

    req.validated = {};
    for (const source of sources) {
      const schema = schemas[source];
      const data = req[source];

      const result = schema.safeParse(data);
      if (!result.success) {
        const errors = mapZodErrors(result.error.issues);

        throw new ValidationError(errors);
      }
      req.validated[source] = result.data;
    }

    next();
  };
}

export default validate;
