import { corpusRegistry, functionRegistry } from "./registries";
import { default as random } from "random";
import { default as juejuezi } from './lib/juejuezi';
import { default as rpnCalc } from './lib/rpnCalc';
import listFormat from "./lib/listFormat";
import listParse from "./lib/checkIsList";
import valueToBool from "./lib/toBool";
import boolToValue from "./lib/boolToValue";
import logicCalc from "./lib/logicCalc";

functionRegistry.set('a', (context, args)=>{
    let array = listParse(args[0]);
    let index = parseInt(args[1]);
    index = isNaN(index) ? random.int(0, array.length-1) : index;
    return array[index];
});

functionRegistry.set('A', (context, args)=>{
    let array = listParse(args[0]);
    switch(args[1]){
        case 'concat':
            return listFormat(array.concat(...listParse(args[2])));
        case 'slice':
            let [l, r] = args.slice(2).map(parseInt).map(a=>isNaN(a)?undefined:a);
            return listFormat(array.slice(l,r));
        case 'indexOf':{
            let index: number|undefined = parseInt(args[3]);
            index = isNaN(index)?undefined:index;
            return array.indexOf(args[2], index);
        }
        case 'lastIndexOf':{
            let item = args[2];
            let index: number|undefined = parseInt(args[3]);
            index = isNaN(index)?undefined:index;
            return array.indexOf(item, index);
        }
        case 'length':
            return array.length;
        case 'includes':{
            let item = args[2];
            let index: number|undefined = parseInt(args[3]);
            index = isNaN(index)?undefined:index;
            return boolToValue(array.includes(item, index));
        }
        default:
            throw new SyntaxError('Invalid operation.');
    }
});

functionRegistry.set('c', ()=>{
    return String.fromCharCode(random.int(0x4e00,0x9fff));
});

functionRegistry.set('C', (context, args)=>{
    return rpnCalc(...args.map(v=>{
        let n = parseFloat(v);
        if(isNaN(n))return v;
        else return n;
    }));
});

functionRegistry.set('d', (context)=>{
    if(!context.date)context.date = new Date('2021/04/28');
    return Math.floor((Date.now() - Number(context.date))/(1000*86400));
});

functionRegistry.set('e', (context)=>{
    if(!context.date)context.date = new Date('2021/04/28');
    return -Math.floor((Date.now() - Number(context.date))/(1000*86400));
});

const EMOJI_CATEGORY_LIST = '😀,😃,😄,😁,😆,😅,😂,🤣,😇,😉,😊,🙂,🙃,☺,😋,😌,😍,🥰,😘,😗,😙,😚,🥲,🤪,😜,😝,😛,🤑,😎,🤓,🥸,🧐,🤠,🥳,🤗,🤡,😏,😶,😐,😑,😒,🙄,🤨,🤔,🤫,🤭,🤥,😳,😞,😟,😠,😡,🤬,😔,😕,🙁,☹,😬,🥺,😣,😖,😫,😩,🥱,😤,😮‍💨,😮,😱,😨,😰,😯,😦,😧,😢,😥,😪,🤤,😓,😭,🤩,😵,😵‍💫,🥴,😲,🤯,🤐,😷,🤕,🤒,🤮,🤢,🤧,🥵,🥶,😶‍🌫️,😴,💤,😈,👿,👹,👺,💩,👻,💀,☠,👽,🤖,🎃,😺,😸,😹,😻,😼,😽,🙀,😿,😾,👐,🤲,🙌,👏,🙏,🤝,👍,👎,👊,✊,🤛,🤜,🤞,✌,🤘,🤟,👌,🤌,🤏,👈,👉,👆,👇,☝,✋,🤚,🖐,🖖,👋,🤙,💪,🦾,🖕,✍,🤳,💅,🦵,🦿,🦶,👄,🦷,👅,👂,🦻,👃,👁,👀,🧠,🫀,🫁,🦴,👤,👥,🗣,🫂,👶,👧,🧒,👦,👩,🧑,👨,👩‍🦱,🧑‍🦱,👨‍🦱,👩‍🦰,🧑‍🦰,👨‍🦰,👱‍♀️,👱,👱‍♂️,👩‍🦳,🧑‍🦳,👨‍🦳,👩‍🦲,🧑‍🦲,👨‍🦲,🧔‍♀️,🧔,🧔‍♂️,👵,🧓,👴,👲,👳‍♀️,👳,👳‍♂️,🧕,👼,👸,🤴,👰,👰‍♀️,👰‍♂️,🤵‍♀️,🤵,🤵‍♂️,🙇‍♀️,🙇,🙇‍♂️,💁‍♀️,💁,💁‍♂️,🙅‍♀️,🙅,🙅‍♂️,🙆‍♀️,🙆,🙆‍♂️,🤷‍♀️,🤷,🤷‍♂️,🙋‍♀️,🙋,🙋‍♂️,🤦‍♀️,🤦,🤦‍♂️,🧏‍♀️,🧏,🧏‍♂️,🙎‍♀️,🙎,🙎‍♂️,🙍‍♀️,🙍,🙍‍♂️,💇‍♀️,💇,💇‍♂️,💆‍♀️,💆,💆‍♂️,🤰,🤱,👩‍🍼,🧑‍🍼,👨‍🍼,🧎‍♀️,🧎,🧎‍♂️,🧍‍♀️,🧍,🧍‍♂️,🚶‍♀️,🚶,🚶‍♂️,👩‍🦯,🧑‍🦯,👨‍🦯,🏃‍♀️,🏃,🏃‍♂️,👩‍🦼,🧑‍🦼,👨‍🦼,👩‍🦽,🧑‍🦽,👨‍🦽,💃,🕺,👫,👭,👬,🧑‍🤝‍🧑,👩‍❤️‍👨,👩‍❤️‍👩,💑,👨‍❤️‍👨,👩‍❤️‍💋‍👨,👩‍❤️‍💋‍👩,💏,👨‍❤️‍💋‍👨,❤,🧡💛,💚,💙,💜,🤎,🖤,🤍,💔,❣,💕,💞,💓,💗,💖,💘,💝,❤️‍🔥,❤️‍🩹,💟;🐶,🐱,🐭,🐹,🐰,🐻,🧸,🐼,🐻‍❄️,🐨,🐯,🦁,🐮,🐷,🐽,🐸,🐵,🙈,🙉,🙊,🐒,🦍,🦧,🐔,🐧,🐦,🐤,🐣,🐥,🐺,🦊,🦝,🐗,🐴,🦓,🦒,🦌,🦘,🦥,🦦,🦫,🦄,🐝,🐛,🦋,🐌,🪲,🐞,🐜,🦗,🪳,🕷,🕸,🦂,🦟,🪰,🪱,🦠,🐢,🐍,🦎,🐙,🦑,🦞,🦀,🦐,🦪,🐠,🐟,🐡,🐬,🦈,🦭,🐳,🐋,🐊,🐆,🐅,🐃,🐂,🐄,🦬,🐪,🐫,🦙,🐘,🦏,🦛,🦣,🐐,🐏,🐑,🐎,🐖,🦇,🐓,🦃,🕊,🦅,🦆,🦢,🦉,🦩,🦚,🦜,🦤,🪶,🐕,🦮,🐕‍🦺,🐩,🐈,🐈‍⬛,🐇,🐀,🐁,🐿,🦨,🦡,🦔,🐾,🐉,🐲,🦕,🦖,🌵,🎄,🌲,🌳,🌴,🪴,🌱,🌿,☘,🍀,🎍,🎋,🍃,🍂,🍁,🌾,🌺,🌻,🌹,🥀,🌷,🌼,🌸,💐,🍄,🌰,🐚,🌎,🌍,🌏,🌕,🌖,🌗,🌘,🌑,🌒,🌓,🌔,🌙,🌚,🌝,🌛,🌜,⭐,🌟,💫,✨,☄,🪐,🌞,☀,🌤,⛅,🌥,🌦,☁,🌧,⛈,🌩,⚡,🔥,💥,❄,🌨,☃,⛄,🌬,💨,🌪,🌫,🌈,☔,💧,💦,🌊;🍏,🍎,🍐,🍊,🍋,🍌,🍉,🍇,🍓,🍈,🍒,🫐,🍑,🥭,🍍,🥥,🥝,🍅,🥑,🫒,🍆,🌶,🫑,🥒,🥬,🥦,🧄,🧅,🌽,🥕,🥗,🥔,🍠,🥜,🍯,🍞,🥐,🥖,🫓,🥨,🥯,🥞,🧇,🧀,🍗,🍖,🥩,🍤,🥚,🍳,🥓,🍔,🍟,🌭,🍕,🍝,🥪,🌮,🌯,🫔,🥙,🧆,🍜,🥘,🍲,🫕,🥫,🧂,🧈,🍥,🍣,🍱,🍛,🍙,🍚,🍘,🥟,🍢,🍡,🍧,🍨,🍦,🍰,🎂,🧁,🥧,🍮,🍭,🍬,🍫,🍿,🍩,🍪,🥠,🥮,☕,🍵,🫖,🥣,🍼,🥤,🧋,🧃,🧉,🥛,🍺,🍻,🍷,🥂,🥃,🍸,🍹,🍾,🍶,🧊,🥄,🍴,🍽,🥢,🥡;⚽,🏀,🏈,⚾,🥎,🎾,🏐,🏉,🎱,🥏,🪃,🏓,🏸,🥅,🏒,🏑,🏏,🥍,🥌,⛳,🏹,🎣,🤿,🥊,🥋,⛸,🎿,🛷,⛷,🏂,🏋️‍♀️,🏋,🏋️‍♂️,🤺,🤼‍♀️,🤼,🤼‍♂️,🤸‍♀️,🤸,🤸‍♂️,⛹️‍♀️,⛹,⛹️‍♂️,🤾‍♀️,🤾,🤾‍♂️,🧗‍♀️,🧗,🧗‍♂️,🏌️‍♀️,🏌,🏌️‍♂️,🧘‍♀️,🧘,🧘‍♂️,🧖‍♀️,🧖,🧖‍♂️,🏄‍♀️,🏄,🏄‍♂️,🏊‍♀️,🏊,🏊‍♂️,🤽‍♀️,🤽,🤽‍♂️,🚣‍♀️,🚣,🚣‍♂️,🏇,🚴‍♀️,🚴,🚴‍♂️,🚵‍♀️,🚵,🚵‍♂️,🎽,🎖,🏅,🥇,🥈,🥉,🏆,🏵,🎗,🎫,🎟,🎪,🤹‍♀️,🤹,🤹‍♂️,🎭,🎨,🎬,🎤,🎧,🎼,🎹,🪗,🥁,🪘,🎷,🎺,🎸,🪕,🎻,🎲,🧩,♟,🎯,🎳,🪀,🪁,🎮,👾,🎰,👮‍♀️,👮,👮‍♂️,👩‍🚒,🧑‍🚒,👨‍🚒,👷‍♀️,👷,👷‍♂️,👩‍🏭,🧑‍🏭,👨‍🏭,👩‍🔧,🧑‍🔧,👨‍🔧,👩‍🌾,🧑‍🌾,👨‍🌾,👩‍🍳,🧑‍🍳,👨‍🍳,👩‍🎤,🧑‍🎤,👨‍🎤,👩‍🎨,🧑‍🎨,👨‍🎨,👩‍🏫,🧑‍🏫,👨‍🏫,👩‍🎓,🧑‍🎓,👨‍🎓,👩‍💼,🧑‍💼,👨‍💼,👩‍💻,🧑‍💻,👨‍💻,👩‍🔬,🧑‍🔬,👨‍🔬,👩‍🚀,🧑‍🚀,👨‍🚀,👩‍⚕️,🧑‍⚕️,👨‍⚕️,👩‍⚖️,🧑‍⚖️,👨‍⚖️,👩‍✈️,🧑‍✈️,👨‍✈️,💂‍♀️,💂,💂‍♂️,🥷,🕵️‍♀️,🕵,🕵️‍♂️,🤶,🧑‍🎄,🎅,🕴️‍♀️,🕴,🕴️‍♂️,🦸‍♀️,🦸,🦸‍♂️,🦹‍♀️,🦹,🦹‍♂️,🧙‍♀️,🧙,🧙‍♂️,🧝‍♀️,🧝,🧝‍♂️,🧚‍♀️,🧚,🧚‍♂️,🧞‍♀️,🧞,🧞‍♂️,🧜‍♀️,🧜,🧜‍♂️,🧛‍♀️,🧛,🧛‍♂️,🧟‍♀️,🧟,🧟‍♂️,👯‍♀️,👯,👯‍♂️,👪,👨‍👩‍👧,👨‍👩‍👧‍👦,👨‍👩‍👦‍👦,👨‍👩‍👧‍👧,👩‍👩‍👦,👩‍👩‍👧,👩‍👩‍👧‍👦,👩‍👩‍👦‍👦,👩‍👩‍👧‍👧,👨‍👨‍👦,👨‍👨‍👧,👨‍👨‍👧‍👦,👨‍👨‍👦‍👦,👨‍👨‍👧‍👧,👩‍👦,👩‍👧,👩‍👧‍👦,👩‍👦‍👦,👩‍👧‍👧,👨‍👦,👨‍👧,👨‍👧‍👦,👨‍👦‍👦,👨‍👧‍👧;🚗,🚙,🚕,🛺,🚌,🚎,🏎,🚓,🚑,🚒,🚐,🛻,🚚,🚛,🚜,🏍,🛵,🚲,🦼,🦽,🛴,🛹,🛼,🚨,🚔,🚍,🚘,🚖,🚡,🚠,🚟,🚃,🚋,🚝,🚄,🚅,🚈,🚞,🚂,🚆,🚇,🚊,🚉,🚁,🛩,✈,🛫,🛬,🪂,💺,🛰,🚀,🛸,🛶,⛵,🛥,🚤,⛴,🛳,🚢,⚓,⛽,🚧,🚏,🚦,🚥,🛑,🎡,🎢,🎠,🏗,🌁,🗼,🏭,⛲,🎑,⛰,🏔,🗻,🌋,🗾,🏕,⛺,🏞,🛣,🛤,🌅,🌄,🏜,🏖,🏝,🌇,🌆,🏙,🌃,🌉,🌌,🌠,🎇,🎆,🛖,🏘,🏰,🏯,🏟,🗽,🏠,🏡,🏚,🏢,🏬,🏣,🏤,🏥,🏦,🏨,🏪,🏫,🏩,💒,🏛,⛪,🕌,🛕,🕍,🕋,⛩;⌚,📱,📲,💻,⌨,🖥,🖨,🖱,🖲,🕹,🗜,💽,💾,💿,📀,📼,📷,📸,📹,🎥,📽,🎞,📞,☎,📟,📠,📺,📻,🎙,🎚,🎛,⏱,⏲,⏰,🕰,⏳,⌛,🧮,📡,🔋,🔌,💡,🔦,🕯,🧯,🗑,🛢,🛒,💸,💵,💴,💶,💷,💰,🪙,💳,🧾,💎,⚖,🦯,🧰,🔧,🪛,🔨,⚒,🛠,⛏,🪓,🪚,🔩,⚙,⛓,🪝,🪜,🧱,🪨,🪵,🔫,🧨,💣,🔪,🗡,⚔,🛡,🚬,⚰,🪦,⚱,🏺,🔮,🪄,📿,🧿,💈,🧲,⚗,🧪,🧫,🧬,🔭,🔬,🕳,💊,💉,🩸,🩹,🩺,🌡,🏷,🔖,🚽,🪠,🚿,🛁,🛀,🪥,🪒,🧴,🧻,🧼,🧽,🧹,🧺,🪣,🔑,🗝,🪤,🛋,🪑,🛌,🛏,🚪,🪞,🪟,🧳,🛎,🖼,🧭,🗺,⛱,🗿,🛍,🎈,🎏,🎀,🧧,🎁,🎊,🎉,🪅,🪆,🎎,🎐,🏮,🪔,✉,📩,📨,📧,💌,📮,📪,📫,📬,📭,📦,📯,📥,📤,📜,📃,📑,📊,📈,📉,📄,📅,📆,🗓,📇,🗃,🗳,🗄,📋,🗒,📁,📂,🗂,🗞,📰,🪧,📓,📕,📗,📘,📙,📔,📒,📚,📖,🔗,📎,🖇,✂,📐,📏,📌,📍,🧷,🪡,🧵,🧶,🪢,🔐,🔒,🔓,🔏,🖊,🖋,✒,📝,✏,🖍,🖌,🔍,🔎,👚,👕,🥼,🦺,🧥,👖,👔,👗,👘,🥻,🩱,👙,🩲,🩳,💄,💋,👣,🧦,🩴,👠,👡,👢,🥿,👞,👟,🩰,🥾,🧢,👒,🎩,🎓,👑,⛑,🪖,🎒,👝,👛,👜,💼,👓,🕶,🥽,🧣,🧤,💍,🌂,☂;☮,✝,☪,🕉,☸,✡,🔯,🕎,☯,☦,🛐,⛎,♈,♉,♊,♋,♌,♍,♎,♏,♐,♑,♒,♓,🆔,⚛,⚕,☢,☣,📴,📳,🈶,🈚,🈸,🈺,🈷,✴,🆚,🉑,💮,🉐,㊙,㊗,🈴,🈵,🈹,🈲,🅰,🅱,🆎,🆑,🅾,🆘,⛔,📛,🚫,❌,⭕,💢,♨,🚷,🚯,🚳,🚱,🔞,📵,🚭,❗,❕,❓,❔,‼,⁉,💯,🔅,🔆,🔱,⚜,〽,⚠,🚸,🔰,♻,🈯,💹,❇,✳,❎,✅,💠,🌀,➿,🌐,♾,Ⓜ,🏧,🚾,♿,🅿,🈳,🈂,🛂,🛃,🛄,🛅,🚰,🛗,🚹,♂,🚺,♀,⚧,🚼,🚻,🚮,🎦,📶,🈁,🆖,🆗,🆙,🆒,🆕,🆓,0⃣,1⃣,2⃣,3⃣,4⃣,5⃣,6⃣,7⃣,8⃣,9⃣,🔟,🔢,▶,⏸,⏯,⏹,⏺,⏏,⏭,⏮,⏩,⏪,🔀,🔁,🔂,◀,🔼,🔽,⏫,⏬,➡,⬅,⬆,⬇,↗,↘,↙,↖,↕,↔,🔄,↪,↩,🔃,⤴,⤵,#⃣,*⃣,ℹ,🔤,🔡,🔠,🔣,🎵,🎶,〰,➰,✔,➕,➖,➗,✖,💲,💱,©,®,™,🔚,🔙,🔛,🔝,🔜,☑,🔘,🔴,🟠,🟡,🟢,🔵,🟣,🟤,⚫,⚪,🟥,🟧,🟨,🟩,🟦,🟪,🟫,⬛,⬜,◼,◻,◾,◽,▪,▫,🔸,🔹,🔶,🔷,🔺,🔻,🔲,🔳,🔈,🔉,🔊,🔇,📣,📢,🔔,🔕,🃏,🀄,♠,♣,♥,♦,🎴,👁‍🗨,🗨,💭,🗯,💬,🕐,🕑,🕒,🕓,🕔,🕕,🕖,🕗,🕘,🕙,🕚,🕛,🕜,🕝,🕞,🕟,🕠,🕡,🕢,🕣,🕤,🕥,🕦,🕧;🏳,🏴,🏁,🚩,🎌,🏴‍☠️,🏳️‍🌈,🏳️‍⚧️'.split(';');
const EMOJI_LIST = {
    p: EMOJI_CATEGORY_LIST[0].split(','),
    n: EMOJI_CATEGORY_LIST[1].split(','),
    d: EMOJI_CATEGORY_LIST[2].split(','),
    a: EMOJI_CATEGORY_LIST[3].split(','),
    t: EMOJI_CATEGORY_LIST[4].split(','),
    o: EMOJI_CATEGORY_LIST[5].split(','),
    s: EMOJI_CATEGORY_LIST[6].split(','),
    f: EMOJI_CATEGORY_LIST[7].split(','),
}
functionRegistry.set('E', (context, args)=>{
    if(args.length === 0)args = Object.keys(EMOJI_LIST);
    let specifiedEmojiLists = args.map(key => {
        if(Object.keys(EMOJI_LIST).includes(key)){
            return (EMOJI_LIST as any)[key];
        }else{
            throw new Error(`Unknown category: ${key}`);
        }
    });
    let candidates = [].concat(...specifiedEmojiLists);
    return candidates[random.int(0, candidates.length - 1)];
});

functionRegistry.set('i', (context, args)=>{
    return valueToBool(args[0]) ? args[1] : args[2]
})

functionRegistry.set('j', (context, args)=>{
    return juejuezi(args[0], args[1]);
});

functionRegistry.set('L', (context, args)=>{
    return logicCalc(args[0], args[1], args[2]);
});

functionRegistry.set('n',(context,args)=>{
    let words: string[] = [];
    for(let flag of args){
        let wordList = corpusRegistry.get(flag);
        if(!wordList){
            throw new Error(`Unknown part of speech: ${flag}`);
        }
        words = words.concat(words, [...wordList.values()]);
    }
    return words[random.int(0,words.length-1)];
});

functionRegistry.set('r', (context, [type, min, max, digits])=>{
    if(type === 'int'){
        return random.int(parseInt(min), parseInt(max)).toString();
    }else if(type === 'float'){
        let f =  random.float(parseFloat(min),parseFloat(max));
        if(digits){
            return f.toFixed(parseInt(digits));
        }else{
            return f.toString();
        }
    }else{
        throw new Error(`Unknown random type: ${type}`);
    }
});