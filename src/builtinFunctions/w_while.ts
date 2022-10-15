import valueToBool from "../lib/toBool";
import { functionRegistry } from "../registries";

functionRegistry.set('w', (context, args)=>{
    let result = '';
    while(
        valueToBool(
            context.getValueOfVariable(args[0])
        )
    ){
        result += context.getValueOfVariable(args[1]);
    }
    return result;
});