import { Context } from "../Context";
import listParse from "../lib/listParse";
import { functionRegistry } from "../registries";
import { parsePattern } from "../walkers";

functionRegistry.set('f', (context, args)=>{
    let result = '';
    let array = listParse(args[0]);
    for(let x of array){
        context.setVariable(args[1], x);
        result += context.getValueOfVariable(args[2]);
    }
    return result;
});