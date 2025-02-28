const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const employer = require('./employer.route');
const candidate = require('./candidate.route');
const joblessUser = require('./joblessday/jobless.user.route');
const joblessAuth = require('./joblessday/jobless.auth.route');
const joblessPost = require('./joblessday/jobless.jobpost.route');


const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/employer',
    route: employer,
  },
  {
    path: '/candidate',
    route: candidate,
  },
  {
    path: '/jobless',
    route: joblessUser,
  },
  {
    path: '/jobless/auth',
    route: joblessAuth,
  },
  {
    path: '/jobless/post',
    route: joblessPost,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
