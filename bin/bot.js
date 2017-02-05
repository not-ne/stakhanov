#!/usr/bin/env node

'use strict';

var Stakhanov = require( '../lib/stakhanov' );
var KeepAlive = require( '../lib/keepAlive' );

var token = process.env.BOT_API_KEY || require( '../token' );
var name = process.env.BOT_NAME;
var ivl = process.env.KEEP_ALIVE_INTERVAL;

var stakhanov = new Stakhanov( {
	token: token,
	name: name
} );

stakhanov.run();
KeepAlive.init( ivl );