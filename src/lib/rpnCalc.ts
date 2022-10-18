import { Context } from "../Context";
import { VARIABLE_NAME_REGEXP } from "../regexp";

interface CalculationType{
    (a: number, b: number): string|number;
}

interface CalculationsType extends Record<string, CalculationType>{}

const Calculations: CalculationsType = {
    '+': (a,b)=>a+b,
    '-': (a,b)=>a-b,
    '*': (a,b)=>a*b,
    '/': (a,b)=>a/b,
    '//': (a,b)=>Math.floor(a/b),
    '^': (a,b)=>Math.pow(a,b),
    '_': (a,b)=>a.toFixed(b),
    'mod': (a,b)=>a % b,
}

function calculationAssign(context: Context, a: string, b: number, op: string){
    if(!op.endsWith('=') || !((op = op.slice(0, op.length-1)) in Calculations)){
        throw new SyntaxError(`Invalid Operator: ${op}`);
    }
    let valueOfA = parseFloat(context.getValueOfVariable(a));
    let result = Calculations[op](valueOfA, b).toString();
    context.setVariable(a, result);
    return a;
}

export default function rpnCalc(context: Context, args: (number|string)[]){
    let s: (string|number)[] = [];
    let lastPushed: string|number = 0;
    for(let t of args){
        if(typeof t === 'string' && /0-9/.test(t[0])){
            // handle the result of '_' operation
            t = parseFloat(t);
        }
        if(typeof t === 'number' || VARIABLE_NAME_REGEXP.test(t)){
            s.push(t);
            lastPushed = t;
        }else{
            let op2 = s.pop();
            let op1 = s.pop();
            if(op1 === undefined || op2 === undefined){
                throw new Error('Invalid RPN Expression');
            }
            if(typeof op2 !== 'number'){
                // de-reference of op2 if op2 is a variable reference
                op2 = parseFloat(context.getValueOfVariable(op2));
            }
            if(typeof op1 !== 'number' && t in Calculations){
                // de-reference of op1 if op1 is a variable reference and operator is not assignment.
                op1 = parseFloat(context.getValueOfVariable(op1));
            }
            if(typeof op1 === 'number'){
                if(t in Calculations){
                    lastPushed = Calculations[t](op1,op2);
                }else{
                    throw new SyntaxError(`Invalid Operator: ${t}`);
                }
            }else{
                lastPushed = calculationAssign(context, op1, op2, t);
            }
            
            s.push(parseFloat(lastPushed as any));
        }
    }
    if(s.length !== 1){
        throw new Error('RPN Expression Overflowed');
    }
    return lastPushed.toString();
}