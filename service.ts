import {controller} from "./controller";

export interface method{
	controller?: controller;
	name: string;
	fnc(...args:any):any;
}

export interface service{
	controller?: controller | controller[];
	version?: string;
	name: string;
	method: method[];
}

export type polyarg = {
	name:string;
	optional?:boolean;
	type:string;
}
