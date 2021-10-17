import { Context } from "./Context";

export type Registry<T> = Map<string, T>

export type FunctionRegistry = Registry<(context: Context,args: string[])=>any>;
export const functionRegistry: FunctionRegistry = new Map();

export type CorpusRegistry = Registry<Set<string>>;
export const corpusRegistry: CorpusRegistry = new Map();