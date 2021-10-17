import { expect } from "chai"
import { Context } from "../Context"
import { parseEval, parsePattern } from "../walkers"
import '../builtinFunctions';
import { generate, registerCorpus } from "..";

describe('parsePattern test', ()=>{
    it('plain', ()=>{
        expect(parsePattern(new Context('123abcABC!@#'))).equal('123abcABC!@#');
    });
    it('terminator', ()=>{
        expect(parsePattern(new Context('123abcABC!@#}'),'}')).equal('123abcABC!@#');
        expect(parsePattern(new Context('123abcABC!@#}'),',}')).equal('123abcABC!@#');
        expect(()=>{parsePattern(new Context('123abcABC!@#}'),',')}).throw(/jz101/);
    });
});

describe('parseTemplate test', ()=>{
    it('errors', ()=>{
        expect(()=>{parsePattern(new Context('%,'),',')}).throw(/jz102/);
        expect(()=>{parsePattern(new Context('%'))}).throw(/jz101/);
        expect(()=>{parsePattern(new Context('%2'))}).throw(/jz102/);
    });
    it('function',()=>{
        console.log(generate('俊泽不在的第undefined天，%c他123123'));
        console.log(generate('俊泽不在的第%r(int,1,5)天，%c他123123'));
        console.log(generate('俊泽不在的第%r(int,%r(int,1,5),%r(int,15,20))天，%c他123123'));
        console.log(generate('俊泽不在的第%d天，%c他123123'));
        console.log(generate('俊泽不在的第%e天，%c他123123'));
        console.log(generate('俊泽不在的第%r(float,%d,%e,2)天，%c%c他123123'));
        console.log(generate('俊泽不在的第%r(float,%d,%e,2,)天，%c%c他123123'));
        console.log(generate('俊泽不在的第%r(float,%d,%e,2,)天，%c()%c他123123'));
    });
    it('function errors',()=>{
        expect(()=>parsePattern(new Context('俊泽不在的第%r(int,%r(int,1,5),%r(int,15,20)天，%c他123123'))).throw(/jz101/);
        expect(()=>parsePattern(new Context('俊泽不在的第%d天，%A他123123'))).throw(/jz001/);
        expect(()=>parsePattern(new Context('俊泽不在的第%r(test,%d,%e,2)天，%c%c他123123'))).throw(/Unknown.*jz201/);
        expect(()=>parsePattern(new Context('俊泽不在的第%r(int,%d,p)天，%c%c他123123'))).throw(/NaN.*jz201/);
    });
    it('list',()=>{
        expect(['1','2','3','4']).include(parsePattern(new Context('%{1,2,3,4}')));
    });
    it('tag',()=>{
        expect(parsePattern(new Context('%[a:123]%[a]'))).equal('123123');
        expect(parsePattern(new Context('%[0$aAskdbKU9328_sdkj-3478$:123]%[0$aAskdbKU9328_sdkj-3478$]'))).equal('123123');
        expect(parsePattern(new Context('%[%a:%r(int,1,1)]%[a]'))).equal('11');
        console.log(parsePattern(new Context('%[%a:%r(int,1,100)] %[a]')));
        expect(parsePattern(new Context('%[a:123]%[a]%[a:456]%[a]'))).equal('123123456456');
        expect(parsePattern(new Context('%[a:123]%[a]%[%a:%r(int,1,1)]%[a]'))).equal('12312311');
        console.log(parsePattern(new Context('%[a:123]%[a] %[%a:%r(int,1,100)] %[a]')));
        expect(parsePattern(new Context('%[a:123]%[a]%[a:%[a]111]%[a]'))).equal('123123123111123111');
        expect(()=>parsePattern(new Context('%[a:123]%[a]%[a:%[a]111]%[b]'))).throw(/jz001/);
        expect(()=>parsePattern(new Context('%[a:123]%[a:%[a:%[a]111]%[a]'))).throw(/jz101/);
        expect(()=>parsePattern(new Context('%[a^:123]'))).throw(/jz103/);
        expect(()=>parsePattern(new Context('%[a%:123]'))).throw(/jz103/);
    });
});
describe('eval', ()=>{
    it('eval', ()=>{
        expect(parseEval(new Context('${random.int(1,1)+junze.d()+junze.e()}'))).equal('0');
    });
});
describe('corpus', ()=>{
    it('corpus',()=>{
        registerCorpus([['a','n'],['b','n'],['A','v'],['B','v']]);
        expect(['Aa','Ab','Ba','Bb']).include(generate('%n(v)%n(n)'));
    });
});
describe('juejuezi', ()=>{
    it('juejuezi',()=>{
        console.log(generate('%j(撸, CuteMB)'));
    });
});
describe('rpnCalc', ()=>{
    it('rpnCalc',()=>{
        expect(generate('%C(1,2,+,4,*,5,/,2,_)')).equal('2.40');
        expect(generate('%C(1,2,+,4,*,5,/,2,^,2,_)')).equal('5.76');
        expect(generate('%C(1,2,+,4,*,5,//,2,^,2,_)')).equal('4.00');
    });
});