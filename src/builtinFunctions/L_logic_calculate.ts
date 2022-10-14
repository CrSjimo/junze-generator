import logicCalc from "../lib/logicCalc";
import { functionRegistry } from "../registries";

functionRegistry.set('L', (context, args)=>{
    return logicCalc(args[0], args[1], args[2]);
});