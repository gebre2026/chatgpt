/**
 * Centralized Express error-handling middleware.
 * Any error thrown or passed to next(err) in a route handler
 * will be caught and formatted into a JSON response here.
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error stack for debugging
  console.error("Error in request:", err.message);

  // Return a JSON response with the error status and message
  return res.status(err.status || 500).json({
    status: false,
    message: err.message || "Something went wrong try again later",
  });
};
