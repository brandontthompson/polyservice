import {service} from "../index";
import { print } from "./method.print";
import { web } from '../../polyexpress';

export const test:service = {
    name: "testservice",
    version: "v2",
    method: [print],
    controller: web 
}
