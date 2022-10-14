import { Context } from "../Context";
import listParse from "../lib/listParse";
import { functionRegistry } from "../registries";
import { parsePattern } from "../walkers";

functionRegistry.set('f', (context, args)=>{
    let result = '';
    let array = listParse(args[0]);
    let iteratorVariableReference = args[1];
    let variableStorage = context.variables.get(args[2]);
    for(let x of array){
        context.variables.set(iteratorVariableReference, {
            isTemplateMode: false,
            value: x
        });
        if(variableStorage){
            result += parsePattern(new Context(context, variableStorage.value));
        }
    }
    return result;
});