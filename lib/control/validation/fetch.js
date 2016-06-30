'use strict';

exports.metadata = function(req, res, next) {

  var params = {
    InstanceIds: [ req.document.instanceId.toString() ]
  };

  ec2.describeInstances(params, function(err, data) {
    if (err){
      console.log(err, err.stack);
    } else {
      console.log(data);
      next();
    }
  });

};
