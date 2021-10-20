import { cli } from "./cli";
import { socket } from "./socket";
import { web } from "./web";
//@TODO: add way to register interfaces, expose the IO make it inhert from a general class
export default{
    cli,
    web,
    socket,
}