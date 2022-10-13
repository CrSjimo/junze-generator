export default function valueToBool(a: any){
    return !(a == false || a === 'false')
}