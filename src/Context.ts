export interface variableStorage {
    isTemplateMode: boolean;
    value: string;
}

export class Context {

    pattern: string = '';

    date?: Date;

    variables: Map<string, variableStorage> = new Map();

    constructor(pattern: string, date?: Date)
    constructor(context: Context, pattern: string)
    constructor(...args: any[]){
        if(typeof args[0] === 'string'){
            let [pattern, date] = args;
            this.pattern = pattern;
            this.date = date;
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