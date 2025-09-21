// This is a wrapper function that handles async/await errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('Async Handler Error:', err);
    next(err);
  });
};

module.exports = asyncHandler;
