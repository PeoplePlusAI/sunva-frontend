import {StateSetter, TKeyboardKeys} from "@/lib/types";

let charIndex = 0;
let lastTime = 0;
let lastKey: string | null = null;

export function keyPressFunc(
    key: string,
    mode: "abc" | "ABC" | "123",
    text: string,
    setText: StateSetter<string>,
    cursor: number,
    setCursor: StateSetter<number>,
    keyboardKeys: TKeyboardKeys
) {
    switch (mode) {
        case "123":
            setCursor((prevState) => prevState + 1);
            setText((prevState) => prevState + key);
            break;
        case "abc":
        case "ABC":
            let sameKey = false;
            if (lastKey === key) {
                sameKey = true;
                charIndex = (charIndex + 1) % keyboardKeys[key].length;
            } else {
                charIndex = 0;
            }

            const substr = sameKey ?
                ((Date.now() - lastTime < 1000) ? text.slice(0, -1) : text) :
                text;

            const newText = substr + keyboardKeys[key][sameKey ? charIndex : 0];

            console.log(cursor)

            setText(newText);

            if (!sameKey) {
                console.log("Updated")
                setCursor((prevState) => prevState + 1);
            } else if(Date.now() - lastTime > 1000) {
                console.log("Else")

                setCursor((prevState) => prevState + 1);
            }

            lastKey = key;
            lastTime = Date.now();
            break;
    }
}