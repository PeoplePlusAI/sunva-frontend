import {StateSetter, TKeyboardKeys} from "@/lib/types";
import {insertAtPos} from "@/lib/utils";

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
            setText((prevState) => insertAtPos(prevState, cursor, key));
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

            const textStart = text.slice(0, cursor);

            const substr = sameKey ?
                ((Date.now() - lastTime < 1000) ? textStart.slice(0, -1) : textStart) :
                textStart;

            const insertedVal = keyboardKeys[key][sameKey ? charIndex : 0]

            const newText = substr + (mode === 'ABC' ? insertedVal.toUpperCase() : insertedVal) + text.slice(cursor);

            console.log(cursor)

            setText(newText);

            if (!sameKey) {
                setCursor((prevState) => prevState + 1);
            } else if(Date.now() - lastTime > 1000) {
                setCursor((prevState) => prevState + 1);
            }

            lastKey = key;
            lastTime = Date.now();
            break;
    }
}