import random from "random";
import { functionRegistry } from "../registries";

functionRegistry.set('r', (context, [type, min, max, digits])=>{
    if(type === 'int'){
        return random.int(parseInt(min), parseInt(max)).toString();
    }else if(type === 'float'){
        let f =  random.float(parseFloat(min),parseFloat(max));
        if(digits){
            return f.toFixed(parseInt(digits));
        }else{
            return f.toString();
        }
    }else{
        throw new Error(`Unknown random type: ${type}`);
    }
});