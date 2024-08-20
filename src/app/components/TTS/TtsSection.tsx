import "./style.css"
import {CaretDownIcon} from "@/app/components/Icons";
import {useRef, useState} from "react";
import {TInputModes} from "@/lib/types";
import {keyPressFunc} from "@/app/components/keyboard/keyPressFunc";
import Keyboard, {keyboardKeys} from "@/app/components/keyboard/Keyboard";
import {sanitizeHTML} from "@/lib/utils";

function useKeypad() {
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

    const handleKeyPress = (key: string) => keyPressFunc(key, mode, text, setText, cursor, setCursor, keyboardKeys)

    return {mode, text, setText, cycleMode, handleKeyPress, cursor, setCursor};
}

export default function TtsSection() {
    const displayRef = useRef<HTMLParagraphElement>(null);

    const {mode, text, setText, cycleMode, handleKeyPress, cursor, setCursor} = useKeypad();

    if (displayRef.current) {
        const sanitizedText = sanitizeHTML(text)

        displayRef.current.innerHTML = `${sanitizedText.substring(0, cursor).replace(/ /g, '&nbsp;')}<span id="text-cursor"></span>${sanitizedText.substring(cursor).replace(/ /g, '&nbsp;')}`;
    }

    return <div className="fixed inset-0 bg-brand-bg z-20 flex flex-col">
        <div className="flex-1 w-full p-4 text-display" ref={displayRef}></div>

        <div className="h-[40px] w-full border-t-2 flex items-center justify-between px-4">
            <CaretDownIcon size={24}/>
            <button onClick={cycleMode}>
                {mode}
            </button>
        </div>
        <Keyboard
            text={text}
            setText={setText}
            handleKeyPress={handleKeyPress}
            mode={mode}
            cursor={cursor}
            setCursor={setCursor}
        />
    </div>
}