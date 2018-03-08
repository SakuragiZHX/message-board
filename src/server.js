const path = require('path');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressJwt = require('express-jwt');

const config = require('./config/server');
const router = require('./api');

const app = express();
const API_VERSION = 'v1';

app.use(compression());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  })
);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.log('[express-jwt-error]', req.cookies.id_token);
    res.clearCookie('id_token');
  }
});

app.use(`/api`, router);

app.listen(config.port || '9000', () => {
  console.info(`The server is running at http://localhost:${config.port}/`);
});

