import valueToBool from "../lib/valueToBool";
import { functionRegistry } from "../registries";

functionRegistry.set('i', (context, args)=>{
    if(valueToBool(
        context.getValueOfVariable(args[0])
    )){
        return context.getValueOfVariable(args[1]);
    }else{
        return context.getValueOfVariable(args[2]);
    }
});