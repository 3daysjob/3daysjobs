const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const JoblessUser = require('../models/joblessday/jobless.user.model');

const JoblessAuth = async (req, res, next) => {
  const BearerHeader = req.headers['authorization'];
  if (typeof BearerHeader != undefined) {
    const bearer = BearerHeader.split(' ');
    const token = bearer[1];
    if (!token) {
      return res.send(httpStatus.UNAUTHORIZED, 'user must be LoggedIn....');
    }
    try {
      const payload = jwt.verify(token, config.jwt.secret);
      
      let findEmoloyer = await JoblessUser.findById(payload.id);
      if (!findEmoloyer) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:'Envalid User'});
      }
      req.userId = payload.id;
      return next();
    } catch {
      return res.send(httpStatus.UNAUTHORIZED, {message:'Invalid Access Token'});
    }
  } else {
    return res.send(httpStatus.UNAUTHORIZED, { message: 'Invalid Bearer Token' });
  }
};

module.exports = JoblessAuth;
