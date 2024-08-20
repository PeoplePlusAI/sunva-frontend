import "./keyboard/keyboard.css"
import {CaretDownIcon} from "@/app/components/Icons";
import {useState} from "react";
import {TInputModes} from "@/lib/types";
import {keyPressFunc} from "@/app/components/keyboard/keyPressFunc";
import Keyboard, {keyboardKeys} from "@/app/components/keyboard/Keyboard";


function useKeypad() {
    const [mode, setMode] = useState<TInputModes>('abc');
    const [text, setText] = useState('dd');

    function cycleMode() {
        if (mode[0] === 'a') {
            setMode('ABC');
        } else if (mode[0] == 'A') {
            setMode('123');
        } else {
            setMode('abc');
        }
    }

    const handleKeyPress = (key: string) => keyPressFunc(key, mode, setText, text, keyboardKeys)

    return {mode, text, setText, cycleMode, handleKeyPress};
}

export default function TtsSection() {
    const {mode, text, setText, cycleMode, handleKeyPress} = useKeypad();



    return <div className="fixed inset-0 bg-brand-bg z-20 flex flex-col">
        <div className="flex-1 w-full p-4">
            {text ?
                text :
                <label className="mt-10 opacity-50 text-[24px]">Type...</label>
            }
        </div>

        <div className="h-[40px] w-full border-t-2 flex items-center justify-between px-4">
            <CaretDownIcon size={24}/>
            <button onClick={cycleMode}>
                {mode}
            </button>
        </div>
        <Keyboard setText={setText} handleKeyPress={handleKeyPress} backspaceHandle={() => {
            setText(text.slice(0, -1));
        }} mode={mode}/>
    </div>
}