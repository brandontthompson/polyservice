"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpListener = void 0;
const fs_1 = require("fs");
class HttpListener {
    constructor(port, k, c) {
        let server;
        // @TODO: allow for http/2 
        (k && c) ? server = require('https') : server = require('http');
        if (((!k && c) || (!c && k)))
            throw Error("Trying to use HTTPS with an invalid path for CERT or KEY");
        if (!HttpListener.port)
            HttpListener.port = port;
        HttpListener.options = (k && c) ? {
            key: (0, fs_1.readFileSync)(k),
            cert: (0, fs_1.readFileSync)(c)
        } : {};
        this.httpServer = HttpListener.requestListener ? server.createServer(HttpListener === null || HttpListener === void 0 ? void 0 : HttpListener.requestListener, HttpListener.options) : server.createServer(HttpListener.options);
    }
    static createServer(app) {
        HttpListener.requestListener = app;
    }
    static get Instance() {
        return this._instance || (this._instance = new this(this.port, this.key, this.cert));
    }
    Listen(port) {
        var _a;
        HttpListener.port = (typeof port !== "number") ? parseInt(port) : port;
        (_a = this.httpServer) === null || _a === void 0 ? void 0 : _a.listen(HttpListener.port);
    }
}
exports.HttpListener = HttpListener;
