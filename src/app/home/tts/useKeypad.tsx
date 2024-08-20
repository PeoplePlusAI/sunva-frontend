import {useState} from "react";
import {TInputModes} from "@/lib/types";
import {keyboardKeys} from "@/app/components/keyboard/Keyboard";
import handleKeypad from "@/app/components/keyboard/handleKeypad";

export function useKeypad() {
    const [mode, setMode] = useState<TInputModes>('abc');
    const [text, setText] = useState('');
    const [cursor, setCursor] = useState(0);

    function cycleMode() {
        if (mode[0] === 'a') {
            setMode('ABC');
        } else if (mode[0] == 'A') {
            setMode('123');
        } else {
            setMode('abc');
        }
    }

    const handleKeyPress = (key: string) => handleKeypad(key, mode, text, setText, cursor, setCursor, keyboardKeys);

    return {mode, text, setText, cycleMode, handleKeyPress, cursor, setCursor};
}