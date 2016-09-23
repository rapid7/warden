'use strict';

const bodyParser = require('body-parser');
const reject = require('../validation/methodNotAllowed');
const HTTP_OK = 200;

function Unseal(app) {
  app.use(bodyParser.json());

  app.post('/v1/unseal',
    (req, res, next) => {
      if (req.body){
        Config.set('vault:token', req.body);
        Config.set('flag:unseal', true);
        return res.status(HTTP_OK).json({
          code: HTTP_OK,
          status: 'Warden token updated'
        });
      };
    });

};

exports.attach = Unseal;
