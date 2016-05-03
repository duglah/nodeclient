"use strict";
var express = require("express");
var request = require("request");
var INodeClient_1 = require("./interfaces/INodeClient");
var bodyParser = require("body-parser");
var NodeClient = (function () {
    function NodeClient() {
        this.debug = true;
        this.command = "";
        this.port = "8085";
        this.host = "";
        this.mainNodePort = "8080";
        this.defaultTimeout = 1000 * 30;
        this.jsonParser = bodyParser.json();
        this.app = express();
    }
    NodeClient.prototype.init = function (cb) {
        var _this = this;
        try {
            this.app.post("/command", this.jsonParser, function (req, res) {
                console.log("/command called from Client: %s", req.connection.remoteAddress);
                if (!req.body) {
                    console.error("Invalid json!");
                    return res.sendStatus(400);
                }
                try {
                    var a = new INodeClient_1.Answer(res);
                    if (req.body.param)
                        _this.onRecieveHandler && _this.onRecieveHandler(a, req.body.param);
                    else
                        _this.onRecieveHandler && _this.onRecieveHandler(a);
                }
                catch (error) {
                    console.error(error);
                }
            });
            if (cb)
                cb();
        }
        catch (err) {
            if (cb)
                cb(err);
        }
    };
    NodeClient.prototype.start = function (cb) {
        var _this = this;
        this.server = this.app.listen(this.port, function (d) {
            try {
                if (_this.server.address()) {
                    var host = _this.server.address().address;
                    var port = _this.server.address().port;
                    console.log("SlackBot app listening at http://%s:%s", host, port);
                    if (cb)
                        cb();
                }
                else if (cb)
                    cb(new Error("server start failed (dunno why)"));
            }
            catch (err) {
                if (cb)
                    cb(err);
            }
        });
    };
    NodeClient.prototype.createCommand = function () {
        return {
            command: this.command,
            port: this.port
        };
    };
    NodeClient.prototype.ping = function () {
        var commandObject = this.createCommand();
        var options = {
            uri: "http://" + this.host + ":" + this.mainNodePort + "/ping",
            method: 'POST',
            json: commandObject
        };
        console.log("ping");
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("pong");
            }
            else {
                console.error("no pong :( Error: " + error);
            }
        });
    };
    NodeClient.prototype.register = function (callback) {
        var _this = this;
        if (!this.command || this.command.length == 0)
            throw new Error("No command defined!");
        var commandObject = this.createCommand();
        var options = {
            uri: "http://" + this.host + ":" + this.mainNodePort + "/register",
            method: 'POST',
            json: commandObject
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Register was successfull");
                _this.interval = setInterval(_this.ping, _this.defaultTimeout);
                callback && callback(null, true);
            }
            else {
                console.error(error);
                callback && callback(error, false);
            }
        });
    };
    NodeClient.prototype.onReceive = function (handler) {
        if (handler)
            this.onRecieveHandler = handler;
        else
            throw new Error("Empty handler!");
    };
    return NodeClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NodeClient;

//# sourceMappingURL=NodeClient.js.map
