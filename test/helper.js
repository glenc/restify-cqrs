module.exports.responseHandler = function(target, callback) {
  return function(err, req, res, obj) {
    target.err = err;
    target.req = req;
    target.res = res;
    target.obj = obj;
    if (callback) return callback();
  };
};
