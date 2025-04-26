import { apiError } from "./apiError.js";
const throwIf = (
  condition,
  message = 'Something went wrong',
  statusCode = 500,
  returnValue = undefined,
  ErrorClass = apiError,
  errors = [],
  stack = ''
) => {
  if (condition) {
    throw new ErrorClass(statusCode, message, errors, stack); // Throws apiError with provided data
  }
  return returnValue;
};

export { throwIf };
