import {controller} from "./controller";
import {polyarg} from "./polyarg";
import {middleware} from "./middleware";

export interface method{
	controller?: controller;
	name: string;
	middleware?:middleware|middleware[];
	arguments?: {[name:string]: polyarg};
	callback(...args:any):any;
}

export interface service{
	controller?: controller | controller[];
	version?: string;
	name: string;
	method: method[];
}

export interface ensurefail {
	blame:{culprit:any; type:string, expected:string, key?:string}
	toString():string;
}

export function invoke(method:method|middleware, data:any):Promise<any>{
	const result = validate(method,data);
	// @TODO: allow this to be customized where instead of resolving on ensurefail it will reject
	if(!result || (typeof result !== "boolean" && ('blame' in (result as ensurefail))))
		return new Promise((resolve:any, reject:any) => { console.log(result.toString()); return resolve(result) });
	// Will attempt to parse out the function variable order and use that to order incoming data
	const expected:string[] = ((f:any):string[] => f.toString().replace (/[\r\n\s]+/g, ' ').
            match (/(?:function\s*\w*)?\s*(?:\((.*?)\)|([^\s]+))/).
            slice (1,3).
            join ('').
            split (/\s*,\s*/))(method.callback);
	const args:any[] = [];
	for(let index = 0, len = expected.length; index < len; index++){
		args[index] = data[expected[index]];
	}
	return new Promise(async (resolve:any, reject:any)=>{
		resolve(await method.callback(...args));
	});
}

export function validate(method:method|middleware, data:{[index:string]:any}):boolean|ensurefail{
	if(!method.arguments) return true;
	if(Object.keys(method.arguments).length < method.callback.length) {}
	for(const key in method.arguments){
		const result = ensure(method.arguments[key], data[key], key);
		if(!result || (typeof result !== "boolean" && ('blame' in (result as ensurefail)))) return result;
	}
	return true;
}

export function ensure(argument:polyarg, against:any, key?:string):boolean|ensurefail|any{
	if(argument.ensure) return argument.ensure(against);
	const types:string[]|undefined = argument.type?.replace(/\s+/g, '').split("|");
	if(!argument.type || typeof types === "undefined" || types.includes("any") || (types.includes("undefined") && !against)  || types.includes(typeof against)) return true;
	return {blame:{culprit:against, type: typeof against, expected:types.length > 1 ? types : types[0], key:key}, 
		toString:() => `${(Array.isArray(against)) ? "Array" : against} is typeof ${typeof against} expected type of ${Array.isArray(types)? types.join(" OR ") : types}${key ? " for " + key : ""}`};
}
