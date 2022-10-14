import listStringify from "../lib/listStringify";
import { functionRegistry } from "../registries";

functionRegistry.set('R', (context, args)=>{
    let [l, r, step = 1] = args.map(parseFloat);
    let a = [];
    for(let i = l; i < r; i += step){
        a.push(i);
    }
    return listStringify(a);
});