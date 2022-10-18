import { functionRegistry } from "../registries";

functionRegistry.set('h', (context, args)=>{
    return args[0]
});