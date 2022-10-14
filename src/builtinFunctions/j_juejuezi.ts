import juejuezi from "../lib/juejuezi";
import { functionRegistry } from "../registries";

functionRegistry.set('j', (context, args)=>{
    return juejuezi(args[0], args[1]);
});