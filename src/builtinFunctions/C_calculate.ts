import { functionRegistry } from "../registries";
import { Context } from "../Context";
import { VARIABLE_NAME_REGEXP } from "../regexp";

interface CalculationType<T extends number[]>{
    (...args: T): string|number;
}

const BinaryCalculations: Record<string, CalculationType<[number, number]>> = {
    '+': (a,b)=>a+b,
    '-': (a,b)=>a-b,
    '*': (a,b)=>a*b,
    '/': (a,b)=>a/b,
    '//': (a,b)=>Math.floor(a/b),
    '^': Math.pow,
    '-floor': (a,b)=>a.toFixed(b),
    '-mod': (a,b)=>a % b,
};

const UnaryCalculations: Record<string, CalculationType<[number]>> = {
    '-sin': Math.sin,
    '-cos': Math.cos,
    '-tan': Math.tan,

    '-arcsin': Math.asin,
    '-arccos': Math.acos,
    '-arctan': Math.atan,

    '-sinh': Math.sinh,
    '-cosh': Math.cosh,
    '-tanh': Math.tanh,

    '-arcsinh': Math.asinh,
    '-arccosh': Math.acosh,
    '-arctanh': Math.atanh,

    '-ln': Math.log,
    '-log10': Math.log10,

    '-sqrt': Math.sqrt,
    '-cbrt': Math.cbrt,

    '-abs': Math.abs,
    '-sign': Math.sign,
};

const Constants: Record<string, CalculationType<[]>> = {
    '-e': ()=>Math.E,
    '-pi': ()=>Math.PI,
}

const Calculations = [Constants, UnaryCalculations, BinaryCalculations];

type RawOperand = string|number;

function getOperatorList(context: Context, t: string, s: RawOperand[], isAssignment: true): [string, number];
function getOperatorList(context: Context, t: string, s: RawOperand[], isAssignment: false): [number, number];
function getOperatorList(context: Context, t: string, s: RawOperand[], isAssignment: boolean): RawOperand[];
function getOperatorList(context: Context, t: string, s: RawOperand[], isAssignment: boolean){
    let _op: (RawOperand|undefined)[] = [];
    if(t in BinaryCalculations) [_op[1], _op[0]] = [s.pop(), s.pop()];
    else if(t in UnaryCalculations) _op[0] = s.pop();
    else if(t in Constants){}
    else throw new SyntaxError(`Invalid operator: ${t}${isAssignment?'=':''}`);

    if(!_op.every(v => v !== undefined)){
        throw new SyntaxError(`Invalid operand number.`);
    }
    let op =  _op as RawOperand[];
    for(let _i in op){
        let i = parseInt(_i);
        if(i == 0 && isAssignment){
            if(typeof op[i] != 'string'){
                throw new SyntaxError('Invalid assignment statement.');
            }
        }else{
            if(typeof op[i] == 'string'){
                op[i] = parseFloat(context.getValueOfVariable(op[i] as string));
            }
        }
    }
    return op;
}

function calculationAssign(context: Context, a: string, b: number|undefined, op: string){
    let valueOfA = parseFloat(context.getValueOfVariable(a));
    let result: string;
    if(b === undefined){
        result = UnaryCalculations[op](valueOfA).toString();
    }else{
        result = BinaryCalculations[op](valueOfA, b).toString();
    }
    context.setVariable(a, result);
    return a;
}

export default function rpnCalc(context: Context, args: (number|string)[]){
    let s: RawOperand[] = [];
    let lastPushed: RawOperand = 0;
    for(let t of args){
        if(typeof t === 'number' || VARIABLE_NAME_REGEXP.test(t)){
            s.push(t);
            lastPushed = t;
        }else{
            let operandNumber = -1;
            let isAssignment = false;
            if(t.endsWith('=')){
                isAssignment = true;
                t = t.slice(0, t.length - 1);
            }
            if(isAssignment){
                let op = getOperatorList(context, t, s, isAssignment);
                operandNumber = op.length;
                if(operandNumber == 0){
                    throw new SyntaxError(`Invalid operator: ${t}=`);
                }
                lastPushed = calculationAssign(context, op[0], op[1], t);
                s.push(lastPushed);
            }else{
                let op = getOperatorList(context, t, s, isAssignment);
                operandNumber = op.length;
                lastPushed = Calculations[operandNumber][t](...op);
                s.push(parseFloat(lastPushed as any));
            }
        }
    }
    if(s.length !== 1){
        console.log(s);
        throw new Error('RPN Expression Overflowed');
    }
    return lastPushed.toString();
}

functionRegistry.set('C', (context, args)=>{
    return rpnCalc(context, args.map(v=>{
        let n = parseFloat(v);
        if(isNaN(n))return v;
        else return n;
    }));
});