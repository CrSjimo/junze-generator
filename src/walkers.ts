import random, { Random } from "random";
import { Context } from "./Context";
import { throwInvalidTagName, throwNotDefinedError, throwRuntimeError, throwUnexpectedEndOfInput, throwUnexpectedToken } from "./errors";
import functionNameRegExp from "./lib/functionNameRegExp";
import listStringify from "./lib/listStringify";
import { FunctionRegistry, functionRegistry } from "./registries";

export function parsePattern(context: Context, terminator?: string, doNotExecute?: boolean){
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
            generated+=parseTemplate(context, terminator, doNotExecute);
        }else if(char === '\\'){
            generated+=parseEscape(context);
        }else{
            generated += char;
        }
        context.next();
    }
}

export function parseTemplate(context: Context, terminator?: string, doNotExecute?: boolean){
    context.next();
    let char = context.get();
    if(char === undefined){
        throwUnexpectedEndOfInput(context, ['function', 'list', 'tag']);
    }else if(terminator?.includes(char)){
        throwUnexpectedToken(context, '%');
    }else if(char === '{'){
        return parseList(context, doNotExecute);
    }else if(char === '['){
        return parseTag(context, doNotExecute);
    }else if(functionNameRegExp.test(char)){
        return parseFunction(context, doNotExecute);
    }else{
        throwUnexpectedToken(context, char);
    }

}

export function parseFunction(context: Context, doNotExecute?: boolean){
    let funcName = context.get();
    let func = functionRegistry.get(funcName);
    if(!doNotExecute && !func){
        throwNotDefinedError(context, funcName);
    }
    let args: string[] = [];
    if(context.get(1) === '('){
        context.next();
        args = parseArgs(context, doNotExecute);
    }
    try{
        return doNotExecute ? '':(func as any)(context,args);
    }catch(e){
        throwRuntimeError(context, e);
    }
    
}

export function parseArgs(context: Context, doNotExecute?: boolean){
    let args: string[] = [];
    for(;;){
        let char = context.get();
        if(char === undefined){
            throwUnexpectedEndOfInput(context,[')']);
        }else if(char === ')'){
            return args;
        }else if(char === '(' || char === ','){
            context.next();
            args.push(parsePattern(context, ',)', doNotExecute));
        }
    }
}

export function parseList(context: Context, doNotExecute?: boolean){
    let items: string[] = [];
    for(;;){
        let char = context.get();
        if(char === undefined){
            throwUnexpectedEndOfInput(context,['}']);
        }else if(char === '}'){
            return listStringify(items);
        }else if(char === '{' || char === ','){
            context.next();
            items.push(parsePattern(context,',}', doNotExecute));
        }
    }
}

export function parseTag(context: Context, doNotExecute?: boolean){
    let tagName = '';
    let isTemplateMode = false;
    let isReference = false;
    let isParsingTagName = true;
    let doNotReturn = false;
    context.next();
    if(context.get() === '&'){
        isReference = true;
        context.next();
    }else if(context.get() === '@'){
        isReference = true;
        doNotReturn = true;
        context.next();
    }
    if(context.get() === '%'){
        isTemplateMode = true;
        context.next();
    }
    for(;;context.next()){
        let char = context.get();
        if(char === undefined){
            throwUnexpectedEndOfInput(context, [']']);
        }else if(char === ':'){
            isParsingTagName = false;
            context.next();
            let startPos = context.index;
            let result = parsePattern(context, ']', doNotExecute || (isTemplateMode && isReference));
            let endPos = context.index;
            if(!doNotExecute){
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
            }
            if(isReference){
                return doNotReturn ? '' : tagName;
            }else{
                return result;
            }
        }else if(char === ']'){
            isParsingTagName = false;
            if(!doNotExecute){
                let variableStorage = context.variables.get(tagName);
                if(variableStorage){
                    if(isReference){
                        return tagName;
                    }
                    if(variableStorage.isTemplateMode){
                        return parsePattern(new Context(context, variableStorage.value));
                    }else{
                        return variableStorage.value;
                    }
                }else{
                    throwNotDefinedError(context, tagName);
                }
            }else{
                return '';
            }
        }else if(isParsingTagName){
            if(/[$\-0-9A-Z_a-z]/.test(char)){
                tagName += char;
            }else{
                throwInvalidTagName(context, char);
            }
        }
    }
}

export function parseEscape(context: Context, doNotExecute?: boolean){
    context.next();
    return context.get();
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