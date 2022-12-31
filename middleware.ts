import {controller} from "./controller";
import {polyarg} from "./polyarg";
export interface middleware{
	controller?: controller
	arguments?: {[name:string]: polyarg}
	namespace?: string | string[]
	callback: Function
}
