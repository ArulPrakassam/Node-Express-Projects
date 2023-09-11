const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      //this goes to next default error handling
      next(error);
    }
  };
};
module.exports = asyncWrapper;

// const fn=async (req, res) => {
//   const task = await Task.create(req.body);
//   res.status(201).json({ task });
// }
