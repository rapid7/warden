'use strict';

const bodyParser = require('body-parser');
const bad = require('../validation/badRequest');

const HTTP_OK = 200;
const BAD_REQUEST = 400;

function Unseal(app) {
  app.use(bodyParser.json());

  app.post('/v1/unseal',
    (req, res, next) => {
      if (req.body){
        Config.set('vault:token', req.body.token);
        Log.info(Config.get('vault'));
        return res.status(HTTP_OK).json({
          code: HTTP_OK,
          status: 'Warden token updated'
        });
      };
    }
  ),

  function (err, req, res, next) {
    res.status(BAD_REQUEST);
    res.json({
      code: BAD_REQUEST,
      error: err,
      stack: err.stack,
      message: err.message
    });
  }

};

exports.attach = Unseal;
