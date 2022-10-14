export default function listStringify(a: any[]){
    return JSON.stringify(a.map(v=>v.toString()));
}