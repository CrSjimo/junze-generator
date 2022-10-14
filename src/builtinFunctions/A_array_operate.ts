import boolToValue from "../lib/boolToValue";
import listFormat from "../lib/listFormat";
import listParse from "../lib/listParse";
import { functionRegistry } from "../registries";

functionRegistry.set('A', (context, args)=>{
    let array = listParse(args[0]);
    switch(args[1]){
        case 'concat':
            return listFormat(array.concat(...listParse(args[2])));
        case 'slice':
            let [l, r] = args.slice(2).map(parseInt).map(a=>isNaN(a)?undefined:a);
            return listFormat(array.slice(l,r));
        case 'indexOf':{
            let index: number|undefined = parseInt(args[3]);
            index = isNaN(index)?undefined:index;
            return array.indexOf(args[2], index);
        }
        case 'lastIndexOf':{
            let item = args[2];
            let index: number|undefined = parseInt(args[3]);
            index = isNaN(index)?undefined:index;
            return array.indexOf(item, index);
        }
        case 'length':
            return array.length;
        case 'includes':{
            let item = args[2];
            let index: number|undefined = parseInt(args[3]);
            index = isNaN(index)?undefined:index;
            return boolToValue(array.includes(item, index));
        }
        default:
            throw new SyntaxError('Invalid operation.');
    }
});