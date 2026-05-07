const { nanoid } = require("nanoid");

const generateShortCode = () => {
  return nanoid(6); // 6 char short code
};

module.exports = generateShortCode;