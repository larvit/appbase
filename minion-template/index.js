'use strict';

const	conStr	= 'amqp://test:test@172.17.0.2/',
	amqp	= require('amqplib/callback_api');

// Publisher
function publisher() {
	amqp.connect(conStr, function(err, conn) {
		if (err) throw err;

		conn.createChannel(function(err, ch) {
			if (err) throw err;

			ch.assertExchange('autobahn', 'fanout', {durable: false});

			console.log('Sending message');
			ch.publish('autobahn', '', new Buffer('Message content'));
		});
	});
}

// Subscriber
function subscriber(subNr) {
	amqp.connect(conStr, function(err, conn) {
		if (err) throw err;

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
	});
}

subscriber(1);
subscriber(2);
subscriber(3);

setInterval(function() {
	console.log('publishing');
	publisher()
}, 2000);
