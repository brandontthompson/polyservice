import { readFileSync } from "fs";
import { Server as httpServer} from "http";
import { Server as httpsServer } from "https";

export class HttpListener {
	private static _instance: HttpListener;
	public static requestListener:Function;
	public static options: object;
	public static port: number;
	public static cert: string;
	public static key: string;
	public httpServer: httpServer | httpsServer | undefined;

	private constructor(port:number, k?:string, c?:string){
		let server;
		// @TODO: allow for http/2 
		(k && c)? server = require('https') : server = require('http');
		
		if(((!k && c) || (!c && k))) throw Error("Trying to use HTTPS with an invalid path for CERT or KEY");

		if(!HttpListener.port) HttpListener.port = port;
		HttpListener.options = (k && c)? {
		    key: readFileSync(k),
		    cert: readFileSync(c),
		    ...HttpListener.options
		} : {...HttpListener.options};
		
		this.httpServer = HttpListener.requestListener ? server.createServer(HttpListener?.requestListener, HttpListener.options) : server.createServer(HttpListener.options);          
	}

	public static createServer(app?:any, options?:any) : httpServer|httpsServer|undefined|void{
		//if(this._instance) return this.Instance.httpServer;

		HttpListener.requestListener = app;
		HttpListener.options = { ...(HttpListener.options || {}), ...options };
		//return this.Instance.httpServer;
	}

	public static get Instance() : HttpListener{
		return this._instance || (this._instance = new this(this.port, this.key, this.cert));
	}

	public Listen(port:number|string){
		HttpListener.port = (typeof port !== "number") ? parseInt(port) : port;
		this.httpServer?.listen(HttpListener.port);
	}
}
