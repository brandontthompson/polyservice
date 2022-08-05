import {service} from "../index";
import { print } from "./method.print";
import { web } from "./web";

export const test:service = {
    name: "testservice",
    version: "v2",
    method: [print],
    controller: web 
}
