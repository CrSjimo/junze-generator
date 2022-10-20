import { functionRegistry } from "../registries";
import boolToValue from "../lib/boolToValue";
import valueToBool from "../lib/valueToBool";

function _logicCalc(operand1: string, operator: string, operand2: string){
    switch(operator){
        case '==': return operand1 == operand2;
        case '!=': return operand1 != operand2;
        case '===': return parseFloat(operand1) == parseFloat(operand2);
        case '!==': return parseFloat(operand1) != parseFloat(operand2);
        case '>': return parseFloat(operand1) > parseFloat(operand2);
        case '<': return parseFloat(operand1) < parseFloat(operand2);
        case '>=': return parseFloat(operand1) >= parseFloat(operand2);
        case '<=': return parseFloat(operand1) <= parseFloat(operand2);
        case '||': return valueToBool(operand1) || valueToBool(operand2);
        case '&&': return valueToBool(operand1) && valueToBool(operand2);
        case '!': return !valueToBool(operand1);
        default: throw new SyntaxError('Invalid operator.');
    }
}

export default function logicCalc(operand1: string, operator: string, operand2: string){
    return boolToValue(_logicCalc(operand1, operator, operand2));
}

functionRegistry.set('L', (context, args)=>{
    return logicCalc(args[0], args[1], args[2]);
});