var Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server,
	BSON = require('mongodb').BSON,
	ObjectID = require('mongodb').ObjectID;

ChatProvider = function (host, port) {
	this.db = new Db('node-chat-item', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
	this.db.open(function(){});
}

ChatProvider.prototype.getCollection = function (callback) {
	this.db.collection('chats', function (error, chat_collection) {
		if (error) callback(error);
		else callback(null, chat_collection);
	});
};

ChatProvider.prototype.getAll = function (callback) {
	this.getCollection(function (error, chat_collection) {
		if (error) callback(error)
		else {
			chat_collection.find().toArray(function (error, results) {
				if (error) callback(error)
				else callback(null, results)
			});
		}
	});
};

ChatProvider.prototype.addNew = function (chats, callback) {
	this.getCollection(function (error, chats_collection) {
		if (error) callback(error);
		else {
			if (typeof(chats.length) == 'undefined')
				chats = [chats];

			for (var i = 0; i < chats.length; i++) {
				chat = chats[i];
				console.log(chat);
				chat.created_at = new Date();
			}

			chats_collection.insert(chats, function () {
				callback(null, chats);
			});
		}
	});
};

exports.ChatProvider = ChatProvider;