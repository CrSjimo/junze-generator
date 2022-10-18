import rpnCalc from "../lib/rpnCalc";
import { functionRegistry } from "../registries";

functionRegistry.set('C', (context, args)=>{
    return rpnCalc(context, args.map(v=>{
        let n = parseFloat(v);
        if(isNaN(n))return v;
        else return n;
    }));
});