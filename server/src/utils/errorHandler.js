import { apiError } from "./apiError.js";

const errorHandler = (err, req, res, next) => {
    if (err instanceof apiError) {
      return res.status(err.statusCode).json({
        success: err.success,
        message: err.message,
        errors: err.errors,
        data: err.data,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      });
    }
  
    // fallback for unhandled errors
    res.status(500).json({
      success: false,
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  export default errorHandler;
  