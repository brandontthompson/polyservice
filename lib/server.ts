import { readFileSync } from "fs";
import * as dotenv from "dotenv";
import { Server as httpServer} from "http";
import { Server as httpsServer } from "https";

dotenv.config();

export class HttpListener {
    private static _instance: HttpListener;
    public static app:any;
    public static options: object;
    public static port: Number;
    public httpServer: httpServer | httpsServer | undefined;

    private constructor(port:Number){
        let server;
        // @TODO: allow for http/2 
        const p:any = process.env.HTTP_PORT;
        const k:any = process.env.HTTP_KEY;
        const c:any = process.env.HTTP_CERT;
        (k && c)? server = require('https') : server = require('http');
        
        if(((!k && c) || (!c && k))) throw Error("Trying to use HTTPS with an invalid path for CERT or KEY");

        HttpListener.port = port || p;
        HttpListener.options = (k && c)? {
            key: readFileSync(k),
            cert: readFileSync(c)
        } : {};
        
        this.httpServer = HttpListener.app ? server.createServer(HttpListener?.app, HttpListener.options) : server.createServer(HttpListener.options);          
    }

    public static get Instance():HttpListener{
        return this._instance || (this._instance = new this(this.port));
    }

    public Listen(){
        this.httpServer?.listen(HttpListener.port);
    }
}
