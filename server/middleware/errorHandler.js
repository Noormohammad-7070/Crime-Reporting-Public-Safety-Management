module.exports = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation error', details: err.message });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large' });
  }
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Server error',
  });
};
