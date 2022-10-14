import random from "random";
import { functionRegistry, corpusRegistry } from "../registries";

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