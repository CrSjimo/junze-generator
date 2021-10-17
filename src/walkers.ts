import random, { Random } from "random";
import { Context } from "./Context";
import { throwInvalidTagName, throwNotDefinedError, throwRuntimeError, throwUnexpectedEndOfInput, throwUnexpectedToken } from "./errors";
import { FunctionRegistry, functionRegistry } from "./registries";

export function parsePattern(context: Context, terminator?: string){
    let generated = '';
    for(;;){
        let char = context.get();
        if(char === undefined){
            if(terminator){
                throwUnexpectedEndOfInput(context, terminator.split('').map(v=>`'${v}'`));
            }else{
                return generated;
            }
        }else if(terminator?.includes(char)){
            return generated;
        }else if(char === '%'){
            generated+=parseTemplate(context, terminator);
        }else{
            generated += char;
        }
        context.next();
    }
}

export function parseTemplate(context: Context, terminator?: string){
    context.next();
    let char = context.get();
    if(char === undefined){
        throwUnexpectedEndOfInput(context, ['function', 'list', 'tag']);
    }else if(terminator?.includes(char)){
        throwUnexpectedToken(context, '%');
    }else if(char === '{'){
        return parseList(context);
    }else if(char === '['){
        return parseTag(context);
    }else if(/[A-Za-z]/.test(char)){
        return parseFunction(context);
    }else{
        throwUnexpectedToken(context, char);
    }

}

export function parseFunction(context: Context){
    let funcName = context.get();
    let func = functionRegistry.get(funcName);
    if(!func){
        throwNotDefinedError(context, funcName);
    }
    let args: string[] = [];
    if(context.get(1) === '('){
        context.next();
        args = parseArgs(context);
    }
    try{
        return func(context,args);
    }catch(e){
        throwRuntimeError(context, e);
    }
    
}

export function parseArgs(context: Context){
    let args: string[] = [];
    for(;;){
        let char = context.get();
        if(char === undefined){
            throwUnexpectedEndOfInput(context,[')']);
        }else if(char === ')'){
            return args;
        }else if(char === '(' || char === ','){
            context.next();
            args.push(parsePattern(context,',)'));
        }
    }
}

export function parseList(context: Context){
    let items: string[] = [];
    for(;;){
        let char = context.get();
        if(char === undefined){
            throwUnexpectedEndOfInput(context,['}']);
        }else if(char === '}'){
            return items[random.int(0, items.length-1)];
        }else if(char === '{' || char === ','){
            context.next();
            items.push(parsePattern(context,',}'));
        }
    }
}

export function parseTag(context: Context){
    let tagName = '';
    let isTemplateMode = false;
    context.next();
    if(context.get() === '%'){
        isTemplateMode = true;
        context.next();
    }
    for(;;){
        let char = context.get();
        if(char === undefined){
            throwUnexpectedEndOfInput(context, [']']);
        }else if(char === ':'){
            context.next();
            let startPos = context.index;
            let result = parsePattern(context, ']');
            let endPos = context.index;
            if(isTemplateMode){
                context.variables.set(tagName, {
                    value: context.pattern.slice(startPos, endPos),
                    isTemplateMode,
                });
            }else{
                context.variables.set(tagName, {
                    value: result,
                    isTemplateMode,
                });
            }
            return result;
        }else if(char === ']'){
            let variableStorage = context.variables.get(tagName);
            if(variableStorage){
                if(variableStorage.isTemplateMode){
                    return parsePattern(new Context(context, variableStorage.value));
                }else{
                    return variableStorage.value;
                }
            }else{
                throwNotDefinedError(context, tagName);
            }
        }else{
            if(/[$\-0-9A-Z_a-z]/.test(char)){
                tagName += char;
            }else{
                throwInvalidTagName(context, char);
            }
        }
        context.next();
    }
}

export interface FunctionMap {
    [p: string]: (...args: string[])=>string;
}

export function parseEval(context: Context):string{
    let f: FunctionMap = {};
    functionRegistry.forEach((func,funcName)=>{
        f[funcName] = (...args: string[])=>func(context, args);
    });
    return (function(context: Context, junze: FunctionMap, random: Random){
        return eval('`' + context.pattern + '`').toString();
    })(context, f, random);
}