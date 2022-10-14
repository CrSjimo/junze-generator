import random from "random";
import { functionRegistry } from "../registries";

functionRegistry.set('c', ()=>{
    return String.fromCharCode(random.int(0x4e00,0x9fff));
});