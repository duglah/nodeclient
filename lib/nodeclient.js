var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var defaultNodeTimeout = 1000 * 30; //1000 * 60 * 5; //5 minutes
var interval;

var client = {
    debug: true,
    command: "",
    port: "8085",
    host: "",
    mainNodePort: "8080",
    _onRecieveHandler: null
};

function answer(response) {
    this._response = response;
    this.send = function(data) {
        this._response.json({ "result": data });
    }
}

function createCommand(client) {
    var command = {
        command: client.command,
        port: client.port
    };
    return command;
}

function ping() {

    var commandObject = createCommand(client);

    var options = {
        uri: "http://" + client.host + ":" + client.mainNodePort + "/ping",
        method: 'POST',
        json: commandObject
    };

    console.log("ping");

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("pong");
        }
        else {
            console.error("no pong :( Error: " + error);
        }
    });
}

function nodeclient() {

    //Start Server
    client.start = function() {

        var server = app.listen(client.port, function() {

            var host = server.address().address;
            var port = server.address().port;

            console.log("SlackBot app listening at http://%s:%s", host, port);
            client.ready();
        });
    }

    //Register to server
    client.register = function(callback) {
        if (!client.command || client.command.length == 0)
            throw new Error("No command defined!");

        var commandObject = createCommand(client);

        var options = {
            uri: "http://" + client.host + ":" + client.mainNodePort + "/register",
            method: 'POST',
            json: commandObject
        };

        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Register was successfull");
                interval = setInterval(ping, defaultNodeTimeout);
                callback && callback(null, true);
            }
            else {
                console.error(error);
                callback && callback(error);
            }
        });
    }

    //When started is successfull
    client.ready = function(callback) {
        callback && callback();
    }

    //When data come from server
    client.onRecieve = function(handler) {
        if (handler)
            client._onRecieveHandler = handler;
        else
            throw new Error("Empty handler!");
    }

    //Setup Express
    var jsonParser = bodyParser.json();

    //REST
    app.post("/command", jsonParser, function(req, res) {
        console.log("/command called from Client: %s", req.connection.remoteAddress);

        if (!req.body) {
            console.error("Invalid json!");
            return res.sendStatus(400);
        }

        try {
            var a = new answer(res);
            if(req.body.param)
                client._onRecieveHandler && client._onRecieveHandler(a, req.body.param);
            else
                client._onRecieveHandler && client._onRecieveHandler(a);
        }
        catch (error) {
            console.error(error);
        }
    });

    return client;
}

module.exports = nodeclient;