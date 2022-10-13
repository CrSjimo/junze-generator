export default function listParse(array: any){
    try{
        let a = JSON.parse(array);
        if(a instanceof Array){
            return a;
        }else{
            throw new Error();
        }
    }catch(e){
        return array.toString() as string;
    }
}