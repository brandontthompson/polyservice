import { readFileSync } from "fs";
import * as dotenv from "dotenv";
import { Server as httpServer} from "http";
import { Server as httpsServer } from "https";

dotenv.config();

export class HttpListener {
    private static _instance: HttpListener;
    public static app:any;
    public static options: object;
    public static https: boolean;
    public static port: Number;
    public httpServer: httpServer | httpsServer | undefined;

    private constructor(port:Number, https:boolean = false){
        let server;
        https? server = require('https') : server = require('http');
        const p:any = process.env.HTTP_PORT;
        const k:any = process.env.HTTPS_KEY;
        const c:any = process.env.HTTPS_CERT;
        HttpListener.port = port || p;
        HttpListener.options = https? {
            key: readFileSync(k),
            cert: readFileSync(c)
        } : {};
        this.httpServer = server.createServer(HttpListener.app, HttpListener.options);       
    }

    public static get Instance(){
        return this._instance || (this._instance = new this(this.port, this.https));
    }

    public Listen(){
        this.httpServer?.listen(HttpListener.port);
    }
}
