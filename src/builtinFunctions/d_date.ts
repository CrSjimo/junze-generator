import { functionRegistry } from "../registries";

functionRegistry.set('d', (context)=>{
    if(!context.date)context.date = new Date('2021/04/28');
    return Math.floor((Date.now() - Number(context.date))/(1000*86400));
});