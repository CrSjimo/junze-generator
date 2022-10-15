import { throwNotDefinedError } from "./errors";
import { parsePattern } from "./walkers";

export interface variableStorage {
    isTemplateMode: boolean;
    value: string;
}

export type VariableMap = Map<string, variableStorage>;

export class Context {

    pattern: string = '';

    date?: Date;

    private _variables: VariableMap = new Map();

    constructor(pattern: string, date?: Date, env?: VariableMap)
    constructor(context: Context, pattern: string)
    constructor(...args: any[]){
        if(typeof args[0] === 'string'){
            let [pattern, date, env] = args;
            this.pattern = pattern;
            this.date = date;
            if(env){
                for(let entry of (env as VariableMap)){
                    this._variables.set(...entry);
                }
            }
            
        }else if(args[0] instanceof Context){
            let [context, pattern] = args;
            this.date = context.date;
            this._variables = context._variables;
            this.pattern = pattern;
        }
    }

    private _index = 0;

    get index(){
        return this._index;
    }

    get(delta = 0){
        return this.pattern[this.index + delta];
    }

    next(){
        this._index++;
    }

    private _anonymousVariableCounter = 0;

    evaluate(pattern: string){
        return parsePattern(new Context(this, pattern));
    }

    getValueOfVariable(name: string){
        let storage = this._variables.get(name);
        if(storage){
            if(storage.isTemplateMode){
                return this.evaluate(storage.value);
            }else{
                return storage.value;
            }
        }else{
            throwNotDefinedError(this, name);
        }
    }

    getLiteralValueOfVariable(name: string){
        let storage = this._variables.get(name);
        if(storage){
            return storage.value;
        }else{
            throwNotDefinedError(this, name);
        }
    }

    setVariable(name: string, value: string, isTemplateMode: boolean = false){
        if(name == ''){
            name = `!${this._anonymousVariableCounter++}`;
        }
        this._variables.set(name, {isTemplateMode, value});
        return name;
    }
}