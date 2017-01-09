#!/usr/bin/env node

'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');

var Stakhanov = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'stakhanov';

    this.user = null;
};

Stakhanov.prototype.run = function() {
    Stakhanov.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

Stakhanov.prototype._onStart = function() {
    this._loadBotUser();
    this._getSlogans();
};

Stakhanov.prototype._loadBotUser = function() {
    var self = this;

    this.user = this.users.filter(function(user) {
        return user.name === self.name;
    })[0];
};

Stakhanov.prototype._getSlogans = function() {
    var self = this;

    fs.readFile('slogans.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        return data;
    });
};

Stakhanov.prototype._onMessage = function() {
    if (
        this._isChatMessage(message) &&
        //this._isChannelConversation(message) &&
        !this._isFromStakhanov(message) &&
        this._isSocialist(message)
    ) {
        this._inspireTheWorkers(message);
    }
};

Stakhanov.prototype._isChatMessage = function(message) {
    return message.type === 'message' && Boolean(message.text);
};

Stakhanov.prototype._isChannelConversation = function(message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C'; // If first letter of channel ID is C, it's a chat channel
};

Stakhanov.prototype._isFromStakhanov = function(message) {
    return message.user === this.user.id;
};

Stakhanov.prototype._isSocialist = function(message) {
    return message.text.toLowerCase().indexOf('commrade') > -1 ||
        message.text.toLowerCase().indexOf(this.name) ||
        message.text.toLowerCase().indexOf('worker') ||
        message.text.toLowerCase().indexOf('work')
}

Stakhanov.prototype._inspireTheWorkers = function(originalMessage) {
    var self = this,
        channel = self._getChannelById(originalMessage.channel);
    slogans = self._getSlogans(),
        slogan;

    slogan = slogans[Math.floor(Math.random() * slogans.length)];

    self.postMessageToChannel(channel.name, slogan, {
        as_user: true
    });
};

Stakhanov.prototype._getChannelById = function(channelId) {
    return this.channels.filter(function(item) {
        return item.id === channelId;
    })[0];
};

// inherits methods and properties from the Bot constructor
util.inherits(Stakhanov, Bot);

module.exports = Stakhanov;
