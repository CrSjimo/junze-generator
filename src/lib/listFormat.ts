export default function listFormat(list: string|any[]){
    if(list instanceof Array){
        return JSON.stringify(list);
    }else{
        return list;
    }
}