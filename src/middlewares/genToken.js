const JWT = require('jsonwebtoken');
const config = require('../config/config');

const GeneretaeAuthToken = async (data) => {
  const token = await JWT.sign({ id: data._id }, config.jwt.secret);
  return token;
};

module.exports = {
  GeneretaeAuthToken,
};
