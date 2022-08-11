import {controller} from "./controller";

export interface method{
	controller?: controller;
	name: string;
	middleware:middleware|middleware[];
	arguments?: {[name:string]: polyarg};
	callback(...args:any):any;
}

export interface service{
	controller?: controller | controller[];
	version?: string;
	name: string;
	method: method[];
}

export type polyarg = {
	type?:string;
	ensure?:(obj:any) => boolean|any;
}

export interface ensurefail {
	blame:{culprit:any; type:string, expected:string, key?:string}
	toString():string;
}

export function invoke(method:method, data:any):any{
	const result = validate(method,data)
	if(!result || (typeof result !== "boolean" && ('blame' in (result as ensurefail)))) {console.log(result.toString()); return result}
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

export function validate(method:method, data:{[index:string]:any}):boolean|ensurefail{
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
	if(!argument.type || typeof types === "undefined" ||types.includes("any") || types.includes("undefined") || types.includes(typeof against)) return true;
	return {blame:{culprit:against, type: typeof against, expected:types.length > 1 ? types : types[0], key:key}, 
		toString:() => `${against} is typeof ${typeof against} expected type of ${Array.isArray(types)? types.join(" OR ") : types}${key ? " for " + key : ""}`};
}
