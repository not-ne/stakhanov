var http = require( "http" );

var KeepAlive = function () {
};

KeepAlive.prototype.init = function ( ivl ) {

	setInterval( function () {
		console.log( 'Some vodka to stay warm.' );
		http.get( "http://stakahnov.herokuapp.com" );
	}, ivl );
};

module.exports = new KeepAlive();