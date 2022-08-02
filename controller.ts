import {service} from "./service";
import {middleware} from "./middleware";
export interface controller{
	name: string;
	init(): void;
	bind(service:service): void;
	middleware(middleware:middleware): void;
}

export function instanceOfController(object:any): object is controller {
	return 'middleware' in object; 
}
