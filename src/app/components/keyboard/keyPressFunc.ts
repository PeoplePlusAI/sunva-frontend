import {StateSetter, TKeyboardKeys} from "@/lib/types";


let charIndex = 0;
let lastTime = 0;
let lastKey: string | null = null;
export function keyPressFunc(
    key: string,
    mode: "abc" | "ABC" | "123",
    setText: StateSetter<string>,
    text: string,
    keyboardKeys: TKeyboardKeys
) {
    switch (mode) {
        case "123":
            setText((prevState) => prevState + key);
            break;
        case "abc":
        case "ABC":
            let sameKey = false;
            if (lastKey === key) {
                sameKey = true;
                charIndex = (charIndex + 1) % keyboardKeys[key].length;
            } else {
                charIndex = 0
            }

            const substr = sameKey ?
                ((Date.now() - lastTime < 1000) ? text.substring(0, text.length - 1) : text) :
                text;

            const newText = substr + keyboardKeys[key][sameKey ? charIndex : 0];
            setText(() => newText);
            lastKey = key;
            lastTime = Date.now();

            break;
    }
}