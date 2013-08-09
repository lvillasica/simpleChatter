
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/router')
  , http = require('http')
  , path = require('path');

var app = express();
GLOBAL.people = [];

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', routes.setNickname);
app.get('/chat', routes.chat);
app.get('/exit_room', routes.exitRoom);
app.get('/api/people', routes.people);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('set nickname', function (name) {
    socket.set('nickname', name, function () {
    	socket.join('public');
      people.push({sid: socket.id, name: name});
      io.sockets.in('public').emit('ready', name, 'public');
    });
  });

  socket.on('join channel', function(name, channel) {
    socket.join(channel);
    io.sockets.in(channel).emit('ready', name, channel);
  });

  socket.on('send', function (data) {
    var channel = (data.channel)? data.channel : 'public';
    socket.join(channel);
    io.sockets.in(channel).emit('msg', data);
  });

  socket.on('priv send', function(data) {
    var msgData = {
      from: data.from,
      to: data.to,
      msg: data.msg
    };
    io.sockets.socket(data.to.sid).emit('priv msg', data);
  });

  socket.on('detach channel', function(channel) {
    socket.get('nickname', function(err, name){
      if(name) {
        io.sockets.in(channel).emit('ended', name, channel);
      }
    });
  });

  socket.on('disconnect', function () {
    socket.get('nickname', function(err, name){
      if(name) {
        for(var i = 0; i < people.length; i++) {
          if(people[i].name == name) people.splice(i, 1);
        }
        io.sockets.emit('ended', name, null);
      }
    });
  });
});