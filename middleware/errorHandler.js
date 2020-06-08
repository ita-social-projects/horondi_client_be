const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: err.message || 'Server Error',
  });
};

module.exports = errorHandler;
