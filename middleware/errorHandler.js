function errorHandler(err, req, res, next) {
  console.error(err.message);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON data."
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong on the server."
  });
}

module.exports = errorHandler;
