import { Context } from "../Context";
import boolToValue from "../lib/boolToValue";
import listFormat from "../lib/listFormat";
import listParse from "../lib/listParse";
import { functionRegistry } from "../registries";

interface ArrayOperations{
    [operation: string]: (array: string|any[], args: string[], context: Context)=>string;
}

const arrayOperations: ArrayOperations = {
    concat(array, args){
        return listFormat(array.concat(...listParse(args[2])));
    },
    slice(array, args){
        let [l, r] = [parseInt(args[2]),parseInt(args[3])].map(a=>isNaN(a)?undefined:a);
        return listFormat(array.slice(l,r));
    },
    indexOf(array, args){
        let index: number|undefined = parseInt(args[3]);
        index = isNaN(index)?undefined:index;
        return array.indexOf(args[2], index).toString();
    },
    lastIndexOf(array, args){
        let item = args[2];
        let index: number|undefined = parseInt(args[3]);
        index = isNaN(index)?undefined:index;
        return array.indexOf(item, index).toString();
    },
    length(array){
        return array.length.toString();
    },
    includes(array, args){
        let item = args[2];
        let index: number|undefined = parseInt(args[3]);
        index = isNaN(index)?undefined:index;
        return boolToValue(array.includes(item, index));
    },
    map(array, args, context){
        if(typeof array == 'string'){
            array = array.split('');
        }
        return listFormat(array.map(v=>{
            context.setVariable(args[2],v);
            return context.getValueOfVariable(args[3]);
        }));
    },
    join(array, args){
        if(typeof array == 'string'){
            array = array.split('');
        }
        return array.join(args[2]);
    },
    split(array, args){
        if(typeof array == 'string'){
            return listFormat(array.split(args[2]));
        }else{
            throw new TypeError('The operation "split" requires string.');
        }
    },
}

functionRegistry.set('A', (context, args)=>{
    let array = listParse(args[0]);
    let index = 0;
    if(!isNaN(index = parseInt(args[1]))){
        if(typeof array == 'string'){
            throw new TypeError('The access operation requires list.');
        }else{
            return listFormat(array[index] = args[2]);
        }
    }else if(args[1] in arrayOperations){
        return arrayOperations[args[1]](array, args, context);
    }else{
        throw new SyntaxError('Invalid operation.');
    }
});