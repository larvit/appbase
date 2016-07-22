'use strict';

// Publisher
function publisher(conn) {
	conn.createChannel(function(err, ch) {
		if (err) throw err;

		ch.assertExchange('autobahn', 'fanout', {durable: false});

		console.log('Sending message');
		ch.publish('autobahn', '', new Buffer('Message content'));
	});
}

// Subscriber
function subscriber(conn, subNr) {
	conn.createChannel(function(err, ch) {
		if (err) throw err;

		ch.assertExchange('autobahn', 'fanout', {durable: false});

		ch.assertQueue('', {exclusive: true}, function(err, q) {
			ch.bindQueue(q.queue, 'autobahn', '');

			ch.consume(q.queue, function(msg) {
				console.log('nr ' + subNr + ' Received message!!! :D');
				console.log(msg.content.toString());
				console.log('------');
			});
		});
	});
}

require('amqplib/callback_api').connect('amqp://test:test@172.17.0.2/', function(err, conn) {
	if (err) throw err;

	console.log('Connected to server');

	subscriber(conn, 1);
	subscriber(conn, 2);
	subscriber(conn, 3);

	setInterval(function() {
		console.log('publishing');
		publisher(conn)
	}, 2000);
	;
});
