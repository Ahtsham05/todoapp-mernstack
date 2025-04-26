const asyncHandlerWithReturn = (fn) => {
    return (...args) =>
      Promise.resolve(fn(...args)).catch((err) => {
        throw err; // re-throws to let higher-level code catch it
      });
  };
  
  export { asyncHandlerWithReturn };
  