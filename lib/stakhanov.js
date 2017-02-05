#!/usr/bin/env node

'use strict';

var http = require( 'http' );
var util = require( 'util' );
var path = require( 'path' );
var fs = require( 'fs' );
var Bot = require( 'slackbots' );
var wit = require( 'node-wit' );
var WIT_ACCESS_TOKEN = process.env.WIT_ACCESS_TOKEN;

var Stakhanov = function Constructor( settings ) {
	this.settings = settings;
	this.settings.name = this.settings.name || 'stakhanov';

	this.user = null;
};

Stakhanov.prototype.run = function () {
	console.log( 'Loading canary into cage...' );

	Stakhanov.super_.call( this, this.settings );

	this.slogansPath = __dirname + '/../slogans.json';
	this.user = this.getUser( this.name );

	this.on( 'start', this._onStart );

	console.log( 'Flipping on power to the lift...' )

	this.on( 'message', this._onMessage );
};

Stakhanov.prototype._slogans = [];

Stakhanov.prototype._onStart = function () {
	this._loadBotUser();
	this._getSlogans();
};

Stakhanov.prototype._loadBotUser = function () {
	var self = this;

	this.user = this.users.filter( function ( user ) {
		return user.name === self.name;
	} )[0];
};

Stakhanov.prototype._getSlogans = function () {
	var self = this;

	fs.exists( self.slogansPath, function ( exists ) {
		if ( exists ) {
			fs.readFile( self.slogansPath, function ( error, data ) {
				console.log( 'Inspiration locked and loaded...' );
				self._slogans = JSON.parse( data );
			} );
		} else {
			console.log( "Slogans not found" );
		}
	} );
};

Stakhanov.prototype._onMessage = function ( message ) {

	console.log( 'I have been summoned by a ' + message.type );
	if (
		this._isChatOrMentionMessage( message ) &&
		this._usingMe( message ) &&
		this._isChannelConversation( message ) && ! this._isFromStakhanov( message ) &&
		this._isSocialist( message )
	) {
		this._inspireTheWorkers( message );
	}
};

Stakhanov.prototype._isChatOrMentionMessage = function ( message ) {
	return ( message.type === 'message' || message.type === 'desktop_notification' ) && Boolean( message.text );
};

Stakhanov.prototype._usingMe = function ( message ) {
	return message.text.toLowerCase().indexOf( 'working on' ) > - 1;
};

Stakhanov.prototype._isChannelConversation = function ( message ) {
	return typeof message.channel === 'string' &&
	       message.channel[0] === 'C'; // If first letter of channel ID is C, it's a chat channel
};

Stakhanov.prototype._isFromStakhanov = function ( message ) {
	return message.user === this.user.id;
};

Stakhanov.prototype._isSocialist = function ( message ) {
	return message.text.toLowerCase().indexOf( 'comrade' ) > - 1 ||
	       message.text.toLowerCase().indexOf( this.name ) > - 1 ||
	       message.text.indexOf( this.user.id ) > - 1 ||
	       message.text.toLowerCase().indexOf( 'worker' ) > - 1 ||
	       message.text.toLowerCase().indexOf( 'work' ) > - 1
};

Stakhanov.prototype._inspireTheWorkers = function ( originalMessage ) {
	var self = this,
		channel = self._getChannelById( originalMessage.channel ),
		slogan;

	console.log( 'Inspiring...' );

	slogan = self._slogans[Math.floor( Math.random() * self._slogans.length )];

	self.postMessageToChannel( channel.name, slogan, {
		as_user: true
	} );
};

Stakhanov.prototype._witWit = function ( message ) {
	// Send to Wit for processing
	var data = this._processWit( message );

	// Determine from response whether to save or access agenda item
	var status = this._parseWit();

	// Send response
	this._beAllSoviet( status );
};

Stakhanov.prototype._processWit = function ( message ) {

	wit.captureTextIntent( WIT_ACCESS_TOKEN, message, function ( err, res ) {
		if ( err ) {
			console.log( err );
		}
		return JSON.stringify( res, null, " " );
	} );
};

Stakhanov.prototype._parseWit = function ( data ) {
	// if this is a question about someone, get their u/n and see if they're in the DB; return empty string if not, their status if so

	// else if get the u/n and save the agenda item with u/n key in DB and return 'success'
};

Stakhanov.prototype._beAllSoviet = function( status ) {
	// if status is empty, some generic response

	// else if status is 'success' some other generic response

	// else echo the status back with some Soviet flourish
};

Stakhanov.prototype._getChannelById = function ( channelId ) {
	return this.channels.filter( function ( item ) {
		return item.id === channelId;
	} )[0];
};

http.createServer().listen( process.env.PORT || 5000 );

// inherits methods and properties from the Bot constructor
util.inherits( Stakhanov, Bot );

module.exports = Stakhanov;
