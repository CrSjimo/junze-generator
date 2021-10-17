import { Context } from "./Context";

export interface IParseError extends Error{
    context: Context
}

export function throwNotDefinedError(context: Context, funcName: string): never{
    let error: IParseError = new ReferenceError(`${funcName} is not defined (jz001)`) as IParseError;
    error.context = context;
    throw error;
}

export function throwUnexpectedEndOfInput(context: Context, expected: string[]): never{
    let error: IParseError = new SyntaxError(`Expected ${expected.join(' or ')}, but read end of input (jz101)`) as IParseError;
    error.context = context;
    throw error;
}

export function throwUnexpectedToken(context: Context, token: string): never{
    let error: IParseError = new SyntaxError(`Unexpected token: ${token} (jz102)`) as IParseError;
    error.context = context;
    throw error;
}

export function throwInvalidTagName(context: Context, char: string): never{
    let error: IParseError = new Error(`Invalid character in tag name: '${char}'. Only hyphen, underline, latin letter and '$' are valid (jz103)`) as IParseError;
    error.context = context;
    throw error;
}

export function throwRuntimeError(context: Context, e: any): never{
    let error: IParseError = new Error(`Runtime error: ${e} (jz201)`) as IParseError;
    error.context = context;
    throw error;
}

export function throwInternalError(context: Context, e: any): never{
    let error: IParseError = new Error(`Internal error: ${e} (jz202)`) as IParseError;
    error.context = context;
    throw error;
}