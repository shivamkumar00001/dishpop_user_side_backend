export const validate = (schema) => (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Request body must be an object",
      });
    }

    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors ?? [{ message: error.message }],
    });
  }
};
