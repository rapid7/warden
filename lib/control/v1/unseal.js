'use strict';

const bodyParser = require('body-parser');

const HTTP_OK = 200;

function Unseal(app) {
  app.use(bodyParser.json());

  app.post('/v1/unseal',
    (req, res, next) => {
      if (req.body){
        Config.set('vault:token', req.body.token);
        Log.info(Config.get('vault'));
        return res.status(HTTP_OK).json({
          code: HTTP_OK,
          status: 'Warden token updated to be: '+req.body.token
        });
      };
    });

};

exports.attach = Unseal;
