/** Import MongoDB */
require('./config/init_db');
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const routes = require('./routes/v1');
const helmet = require('helmet');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./middlewares/ApiError');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// http security
app.use(cors());
app.options('*', cors());

// set security HTTP headers
app.use(helmet());

// listen everything in server 
app.use(morgan('dev'));

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

/** Error Handler */
app.use(async (req, res, next) => {
    next(createError(404));
});

app.use((error, req, res, next) => {
    res.status(error.status || 500); // server error
    res.json({
        error: {
            status: error.status || 500,
            message: error.message
        }
    });
});

/** __Server set-up__ */
app.listen(process.env.PORT || 8998, () => {
    console.log(`Server running on port: ${process.env.PORT} 🏃🏃🏃`);
});





