const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Candidate } = require('../models/candidate.model');


const Auth = async (req, res, next) => {
    const token = req.headers.auth
      if (!token) {
        return res.send(httpStatus.UNAUTHORIZED, 'user must be LoggedIn....');
      }
      try {
        const payload = jwt.verify(token, config.jwt.secret);
        let cand = await Candidate.findById(payload.sub);
        if (!cand) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Envalid User');
        }
        req.userId = payload.sub;
        return next();
      } catch {
        return res.send(httpStatus.UNAUTHORIZED, 'Invalid Access Token');
      }
    } 

module.exports = Auth;

