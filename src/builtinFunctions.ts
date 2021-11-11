import { corpusRegistry, functionRegistry } from "./registries";
import { default as random } from "random";
import { default as juejuezi } from './lib/juejuezi';
import { default as rpnCalc } from './lib/rpnCalc';

functionRegistry.set('c', ()=>{
    return String.fromCharCode(random.int(0x4e00,0x9fff));
});

functionRegistry.set('C', (context, args)=>{
    return rpnCalc(...args.map(v=>{
        let n = parseFloat(v);
        if(isNaN(n))return v;
        else return n;
    }));
});

functionRegistry.set('d', (context)=>{
    if(!context.date)context.date = new Date('2021/04/28');
    return Math.floor((Date.now() - Number(context.date))/(1000*86400));
});

functionRegistry.set('e', (context)=>{
    if(!context.date)context.date = new Date('2021/04/28');
    return -Math.floor((Date.now() - Number(context.date))/(1000*86400));
});

functionRegistry.set('j', (context, args)=>{
    return juejuezi(args[0], args[1]);
})

functionRegistry.set('n',(context,args)=>{
    let words: string[] = [];
    for(let flag of args){
        let wordList = corpusRegistry.get(flag);
        if(!wordList){
            throw new Error(`Unknown part of speech: ${flag}`);
        }
        words = words.concat(words, [...wordList.values()]);
    }
    return words[random.int(0,words.length-1)];
});

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