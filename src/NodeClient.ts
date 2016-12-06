/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/request/request.d.ts" />

import express = require("express");
import {Server} from "http";
import request = require("request");
import {INodeClient, Answer}  from "./interfaces/INodeClient";
var bodyParser = require("body-parser");


export default class NodeClient implements INodeClient {
    debug: boolean = true;
    command: string = "";
    port: string = "8085";
    host: string = "";
    mainNodePort: string = "8080";
    onRecieveHandler: (answer: Answer, param?: string) => void;
    defaultTimeout: number = 1000 * 30; //1000 * 60 * 5; //5 minutes

    private interval: any;
    private server: Server;
    private jsonParser: any;
    private app: express.Express;

    constructor() {
        this.jsonParser = bodyParser.json();
        this.app = express();
    }

    public init(cb: (error?: any) => void): void {
        try {
            this.app.post("/command", this.jsonParser, (req: any, res: any) => {
                console.log("/command called from Client: %s", req.connection.remoteAddress);

                if (!req.body) {
                    console.error("Invalid json!");
                    return res.sendStatus(400);
                }

                try {
                    var a = new Answer(res);
                    if (req.body.param)
                        this.onRecieveHandler && this.onRecieveHandler(a, req.body.param);
                    else
                        this.onRecieveHandler && this.onRecieveHandler(a);
                }
                catch (error) {
                    console.error(error);
                }
            });

            if (cb) cb();

        } catch (err) {
            if (cb) cb(err);
        }
    }

    public start(cb: (error?: any) => void): void {
        this.server = this.app.listen(this.port, (d: any) => {
            try {
                if (this.server.address()) {
                    let host = this.server.address().address;
                    let port = this.server.address().port;

                    console.log("SlackBot app listening at http://%s:%s", host, port);
                    if (cb) cb();
                } else if (cb) cb(new Error("server start failed (dunno why)"));
            } catch (err) {
                if (cb) cb(err);
            }
        });
    }

    public createCommand(): { command: string, port: string } {
        return {
            command: this.command,
            port: this.port
        };
    }

    public ping(): void {
        let commandObject = this.createCommand();

        let options = {
            uri: "http://" + this.host + ":" + this.mainNodePort + "/ping",
            method: 'POST',
            json: commandObject
        };

        console.log("ping");

        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log("pong");
            }
            else {
                console.error("no pong :( Error: " + error);
            }
        });
    }

    public register(callback: (error: any, success: boolean) => void): void {
        if (!this.command || this.command.length == 0)
            throw new Error("No command defined!");

        let commandObject = this.createCommand();

        let options = {
            uri: "http://" + this.host + ":" + this.mainNodePort + "/register",
            method: 'POST',
            json: commandObject
        };

        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log("Register was successfull");
                this.interval = setInterval(()=>this.ping(), this.defaultTimeout);
                callback && callback(null, true);
            }
            else {
                console.error(error);
                callback && callback(error, false);
            }
        });
    }

    public onReceive(handler: (answer: Answer, param?: string) => void) {
        if (handler)
            this.onRecieveHandler = handler;
        else
            throw new Error("Empty handler!");
    }
}