'use strict';

const HTTP_OK = 200;
const HTTP_METHOD_NOT_ALLOWED = 405;
const started = Date.now();

function Health(app) {
  const routes = {
    health: app.route('/v1/health')
  };
  const allowedMethods = 'GET';

  /**
   * Sets headers and status for routes that should return a 405
   * @param {Express.req} req
   * @param {Express.res} res
   */
  const methodNotAllowed = (req, res) => {
    res.set('Allow', allowedMethods);
    res.status(HTTP_METHOD_NOT_ALLOWED);
    res.end();
  };

  routes.health.get((req, res) => {

    res.status(HTTP_OK).json({

      status: 'okay',
      uptime: Date.now() - started
    });
  });

  // All other METHODs should return a 405 with an 'Allow' header
  for (const r in routes) {
    if (routes.hasOwnProperty(r)) {
      routes[r].all(methodNotAllowed);
    }
  }
}

exports.attach = Health;
