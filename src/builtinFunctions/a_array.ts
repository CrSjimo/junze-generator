import random from "random";
import listParse from "../lib/listParse";
import { functionRegistry } from "../registries";

functionRegistry.set('a', (context, args)=>{
    let array = listParse(args[0]);
    let index = parseInt(args[1]);
    index = isNaN(index) ? random.int(0, array.length-1) : index;
    return array[index];
});