import { functionRegistry } from "../registries";

functionRegistry.set('I', (context, args)=>{
    return context.getValueOfVariable(args[0]);
});