import { Context } from "../Context";
import valueToBool from "../lib/toBool";
import { functionRegistry } from "../registries";
import { parsePattern } from "../walkers";

functionRegistry.set('i', (context, args)=>{
    let conditionTemplate = context.variables.get(args[0]);
    let trueVariableStorage = context.variables.get(args[1]);
    let falseVariableStorage = context.variables.get(args[2]);
    if(conditionTemplate && valueToBool(
        parsePattern(new Context(context, conditionTemplate.value))
    )){
        return trueVariableStorage ? parsePattern(new Context(context, trueVariableStorage.value)) : '';
    }else{
        return falseVariableStorage ? parsePattern(new Context(context, falseVariableStorage.value)) : '';
    }
});