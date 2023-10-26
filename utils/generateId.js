const catchAsync = require("./catchAsync");

module.exports = catchAsync(async (req, res, next) => {
  const random = Math.random() * 10 ** 17;
  const id = (Date.now() * random).toString(36);
  res.cookie("id", `${id}`, {
    maxAge: 60 * 60 * 24 * 1000,
    httpOnly: true,
    secure: false,
  });
  next();
});
