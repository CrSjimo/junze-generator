import valueToBool from "../lib/toBool";
import { functionRegistry } from "../registries";

functionRegistry.set('w', (context, args)=>{
    let result = '';
    do{
        result += context.getValueOfVariable(args[1]);
    }while(
        valueToBool(
            context.getValueOfVariable(args[0])
        )
    )
    return result;
});