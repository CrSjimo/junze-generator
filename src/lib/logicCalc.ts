import boolToValue from "./boolToValue";
import valueToBool from "./toBool";

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