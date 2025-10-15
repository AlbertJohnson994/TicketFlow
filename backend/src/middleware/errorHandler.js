const errorHandler = (err, req, res, next) => {
  console.error("Error Stack:", err.stack);

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  // Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      message: "Duplicate entry",
      error: err.errors[0]?.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });
};

export default errorHandler;
