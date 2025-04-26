import { ValidationError } from 'yup';

export const validate = (schemas) => async (req, res, next) => {
  try {
    req.validated = {}; // safe place to store validated data

    for (const key of Object.keys(schemas)) {
      if (schemas[key]) {
        req.validated[key] = await schemas[key].validate(req[key], {
          abortEarly: false,
          stripUnknown: true,
        });
      }
    }

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      const formatted = error.inner.reduce((acc, curr) => {
        if (!acc[curr.path]) {
          acc[curr.path] = curr.message;
        }
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        message: error.errors[0] || "Validation failed",
        errors: formatted,
      });
    }

    next(error);
  }
};
