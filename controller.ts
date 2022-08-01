import {service} from "./service";

export interface controller{
	type?: "controller";
	name: string;
	init(): void;
	bind(service:service): void;
	middleware(): void;
}

export function instanceOfController(object:any): object is controller {
	return object.type === "controller";
}
