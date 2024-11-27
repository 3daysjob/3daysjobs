const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Candidate } = require('../models/candidate.model');

const Auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(httpStatus.UNAUTHORIZED).send('User must be logged in.');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    console.log(payload, "Payload");
    
    let cand = await Candidate.findById(payload.id);
    if (!cand) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Envalid User');
    }
    req.userId = payload.id;
    return next();
  } catch {
    return res.send(httpStatus.UNAUTHORIZED, 'Invalid Access Token');
  }
};

module.exports = Auth;
