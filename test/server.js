var restify = require('restify');
var cqrs    = require('../index');
var config  = require('./config');

var server = restify.createServer({
  name: 'test',
  version: '1.0.0'
});

server.pre(restify.pre.sanitizePath());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());

cqrs.init(server, config.cqrs, function(err) {
  if (err) { console.log(err); return;}
  server.listen(config.web.port, function start() {
    console.log('%s listening at %s', server.name, server.url);
  });
});
