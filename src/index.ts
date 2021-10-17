import { Context } from './Context';
import './builtinFunctions';
import { corpusRegistry } from './registries';
import { parseEval, parsePattern } from './walkers';

export function generate(pattern: string, date?: Date, enableEval?: boolean){
    let context = new Context(pattern, date);
    if(enableEval){
        return parseEval(context);
    }else{
        return parsePattern(context);
    }
}

export function registerCorpus(corpus: [string, string][]){
    corpus.forEach(([word, partOfSpeech])=>{
        let set = corpusRegistry.get(partOfSpeech);
        if(!set){
            corpusRegistry.set(partOfSpeech, set = new Set());
        }
        set.add(word);
    });
}