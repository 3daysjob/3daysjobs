const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('../daysjobs.json');
const { Cities } = require('./models/cities.model');

const app = express();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add any other configuration options if needed
});
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
// const app1Config = require('./google-services.json');

// const employer = admin.initializeApp(
//   {
//     credential: admin.credential.cert(app1Config),
//     databaseURL: app1Config.databaseURL,
//   },
//   'employer'
// );

// function getFirebaseApp(appId) {
//   if (appId === 'employer') return employer;
//   throw new Error('Invalid app ID');
// }

// const testFirebaseConfiguration = async () => {
//   try {
//     const firestore = getFirebaseApp('employer').firestore();

//     const result = await firestore.collection('testCollection').add({
//       message: 'Firebase is configured correctly!',
//       timestamp: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     console.log('Test document added with ID:', result.id);
//   } catch (error) {
//     console.error('Error testing Firebase configuration:', error.message);
//   }
// };

// testFirebaseConfiguration();

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
