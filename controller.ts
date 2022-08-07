import {service} from "./service";
import {middleware} from "./middleware";
export interface controller{
	name: string;
	init(options?:controllerOptions): void;
	bind(service:service): void;
	middleware(middleware:middleware): void;
}

export interface controllerOptions{
	[option:string]:any
}

export function instanceOfController(object:any): object is controller {
	return 'middleware' in object; 
}
