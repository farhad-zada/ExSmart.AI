module.exports = async (err, req, res, next) => {
  res.status(500);
  res.json({
    status: "error",
    role: "exSmart",
    content:
      "Something went wrong 🥺 We are handling it 🤓 If it persists, please contact us at farhad.szd@gmail.com 💌",
  });
};
