import "./keyboard.css"
import "./style.css"
import {StateSetter, TInputModes, TKeyboardKeys} from "@/lib/types";
import {BackspaceIcon, CaretLeftIcon, CaretRightIcon} from "@/app/components/Icons";
import {memo} from "react";


export const keyboardKeys: TKeyboardKeys = {
    '1': ['.', ','],
    '2': ['a', 'b', 'c'],
    '3': ['d', 'e', 'f'],
    '4': ['g', 'h', 'i'],
    '5': ['j', 'k', 'l'],
    '6': ['m', 'n', 'o'],
    '7': ['p', 'q', 'r', 's'],
    '8': ['t', 'u', 'v'],
    '9': ['w', 'x', 'y', 'z'],
    '*': ['*'],
};

const keyboard_keys = Object.keys(keyboardKeys);

function Keyboard({setText, handleKeyPress, mode, backspaceHandle}: {
    setText: StateSetter<string>,
    handleKeyPress: (key: string) => void,
    mode: TInputModes,
    backspaceHandle: () => void
}) {
    console.log("Rendered");

    return <div className="keyboard-cont w-full h-fit">
        <button className="kbc-button keys">
            <CaretLeftIcon/>
        </button>
        <button className="kbc-button keys">
            <CaretRightIcon/>
        </button>
        <button className="kbc-button keys" onClick={backspaceHandle}>
            <BackspaceIcon/>
        </button>
        {
            keyboard_keys.map((key, i) => {
                let alphabets = keyboardKeys[key].join('');

                return <button className="keys kbc-button" key={i} onClick={() => {
                    handleKeyPress(key);
                }}>
                    <span className="value">{key}</span>
                    {alphabets && <span className="subvalues">{alphabets}</span>}
                </button>
            })
        }
        <button className="keys kbc-button" onClick={() => {
            if (mode != '123')
                setText((prevState) => prevState + '_');
            else
                setText((prevState) => prevState + '0')
        }}>
            <span className="value">0</span>
            <span className="subvalues">⎵</span>
        </button>
        <button className="keys kbc-button">
            <span className="value">#</span>
            <span className="subvalues"></span>
        </button>
    </div>
}

export default memo(Keyboard);