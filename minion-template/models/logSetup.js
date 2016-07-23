'use strict';

const	logConfFile	= __dirname + '/../config/log.json',
	log	= require('winston');

// Add support for daily rotate file
log.transports.DailyRotateFile = require('winston-daily-rotate-file');

// Handle logging from config file
log.remove(log.transports.Console);
try {
	const logConf = require(logConfFile);

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
	log.warn('Could not load log config from file "' + logConfFile + '" falling back to console only');
}
