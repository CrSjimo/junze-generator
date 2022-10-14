import { Context } from "../Context";
import valueToBool from "../lib/toBool";
import { functionRegistry } from "../registries";
import { parsePattern } from "../walkers";

functionRegistry.set('w', (context, args)=>{
    let result = '';
    let conditionTemplate = context.variables.get(args[0]);
    let variableStorage = context.variables.get(args[1]);
    if(conditionTemplate){
        do{
            if(variableStorage){
                result += parsePattern(new Context(context, variableStorage.value));
            }
        }while(
            valueToBool(
                parsePattern(new Context(context, conditionTemplate.value))
            )
        )
    }
    return result;
});