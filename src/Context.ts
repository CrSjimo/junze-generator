export interface variableStorage {
    isTemplateMode: boolean;
    value: string;
}

export type VariableMap = Map<string, variableStorage>;

export class Context {

    pattern: string = '';

    date?: Date;

    variables: VariableMap = new Map();

    constructor(pattern: string, date?: Date, env?: VariableMap)
    constructor(context: Context, pattern: string)
    constructor(...args: any[]){
        if(typeof args[0] === 'string'){
            let [pattern, date, env] = args;
            this.pattern = pattern;
            this.date = date;
            if(env){
                for(let entry of (env as VariableMap)){
                    this.variables.set(...entry);
                }
            }
            
        }else if(args[0] instanceof Context){
            let [context, pattern] = args;
            this.date = context.date;
            this.variables = context.variables;
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
}