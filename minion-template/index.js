'use strict';

// Publisher
function publisher(conn) {
	conn.createChannel(function(err, ch) {
		if (err) throw err;

		console.log('Sending message');
		ch.assertQueue('queueName');
		ch.sendToQueue('queueName', new Buffer('something to do'));
	});
}

// Consumer
function consumer(conn) {
	conn.createChannel(function(err, ch) {
		if (err) throw err;

		ch.assertQueue('queueName');
		ch.consume('queueName', function(msg) {
			if (msg !== null) {
				console.log('Incoming message:');
				console.log(msg);
				//console.log(msg.content.toString());
				ch.ack(msg);
			}
		});
	});
}

require('amqplib/callback_api').connect('amqp://test:test@172.17.0.2/', function(err, conn) {
	if (err) throw err;

	console.log('Connected to server');

	consumer(conn);
	publisher(conn);
});
