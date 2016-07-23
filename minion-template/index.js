'use strict';

const	log	= require('winston');

// Set current working directory
process.cwd(__dirname);

// Add support for daily rotate file
log.transports.DailyRotateFile = require('winston-daily-rotate-file');

// Handle logging from config file
log.remove(log.transports.Console);
try {
	const logConf = require(__dirname + '/config/log.json');

	for (const logName of Object.keys(logConf)) {
		let logInstances = logConf[logName];

		if (typeof logInstances !== Array) {
			logInstances = [logInstances];
		}

		for (let i = 0; logInstances[i] !== undefined; i ++) {
			log.add(log.transports[logName], logInstances[i]);
		}
	}
} catch(err) {
	log.add(log.transports.Console, {
		'colorize':	true,
		'timestamp':	true,
		'level':	'info',
		'json':	false
	});
	log.warn('Could not load log config from file "' + __dirname + '/config/log.json" falling back to console only');
}

// Application specific stuff below
function amqpTest() {
	const	conStr	= 'amqp://test:test@172.17.0.2/',
		amqp	= require('amqplib/callback_api');

	// Publisher
	function publisher() {
		amqp.connect(conStr, function(err, conn) {
			if (err) throw err;

			conn.createChannel(function(err, ch) {
				if (err) throw err;

				ch.assertExchange('autobahn', 'fanout', {durable: false});

				log.info('Sending message');
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
						log.info('nr ' + subNr + ' Received message!!! :D');
						log.info(msg.content.toString());
						log.info('------');
					});
				});
			});
		});
	}

	subscriber(1);
	subscriber(2);
	subscriber(3);

	setInterval(function() {
		log.info('publishing');
		publisher();
	}, 2000);
}
amqpTest();
