
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , ChatProvider = require('./chatprovider').ChatProvider;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout:false});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var chatProvider = new ChatProvider('localhost', 27017);

app.get('/', function (req, res) {
	chatProvider.getAll(function (error, emps){
		res.render('index', {
			title: 'node-chat',
			chats: emps
		});
	});
});

app.post('/new', function (req, res) {
	chatProvider.addNew({
		text: req.param('text')
	}, function (error, docs) {
		res.redirect('/')
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
