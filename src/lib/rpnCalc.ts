function calc(a :number, b: number, op: string){
    switch(op){
        case '+': return a+b;
        case '-': return a-b;
        case '*': return a*b;
        case '/': return a/b;
        case '//': return Math.floor(a/b);
        case '^': return Math.pow(a,b);
        case '_': return a.toFixed(b);
        default: throw new SyntaxError(`Invalid Operand: ${op}`);
    }
}

export default function(...args: (number|string)[]){
    let s: number[] = [];
    let lastPushed: string|number = 0;
    for(let t of args){
        if(typeof t === 'number'){
            s.push(t);
            lastPushed = t;
        }else{
            let op2 = s.pop();
            let op1 = s.pop();
            if(op1 === undefined || op2 === undefined){
                throw new Error('Invalid RPN Expression');
            }
            lastPushed = calc(op1,op2,t);
            s.push(parseFloat(lastPushed as any));
        }
    }
    if(s.length !== 1){
        throw new Error('RPN Expression Overflowed');
    }
    return lastPushed.toString();
}