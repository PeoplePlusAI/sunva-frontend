import "./style.css"
import {memo, useEffect, useRef, useState} from "react";
import {sanitizeHTML} from "@/lib/utils";
import {useKeypad} from "@/components/tts/useKeypad";
import useTTS from "@/components/tts/useTTS";
import {CaretDownIcon, SendIcon} from "@/components/Icons";
import Keyboard from "@/components/keyboard/Keyboard";
import {useLang} from "@/lib/context/langContext";
import {toast} from "sonner";
import {StateSetter, TMessage} from "@/lib/types";

function TTS({setMessages, onClose}: { setMessages: StateSetter<TMessage[]>, onClose: () => void }) {
    const displayRef = useRef<HTMLParagraphElement>(null);

    const {mode, text, setText, cycleMode, handleKeyPress, cursor, setCursor} = useKeypad();
    const [inputMode] = useState<"keyboard" | "keypad">("keypad");
    const [lang] = useLang();
    const {sendText} = useTTS(text, setText, setCursor, lang);
    const [hasFocus, setHasFocus] = useState(false);

    useEffect(() => {
        if (displayRef.current && inputMode === "keypad") {
            if (text === '') {
                displayRef.current.textContent = "Type here...";
            } else {
                const sanitizedText = sanitizeHTML(text);
                displayRef.current.innerHTML = `${sanitizedText.substring(0, cursor).replace(/ /g, '&nbsp;')}<span id="text-cursor"></span>${sanitizedText.substring(cursor).replace(/ /g, '&nbsp;')}`;
            }
        }

    }, [cursor, inputMode, text]);

    function sendTextOnly() {
        sendText(text);
        setMessages((prev) => [...prev, {name: "You", message: text, id: "" + (Date.now() + Math.random())}]);
        setText('');
        setCursor(0);
    }

    function sendTextAndClear() {
        sendTextOnly();
        //onClose();
    }


    return <section className="-mb-4">
        <div className="w-full flex gap-2 px-0 mb-4">
            <button className="" onClick={() => {
                onClose();
            }}>
                <CaretDownIcon size={24}/>
            </button>
            <input type="text" value={text} placeholder="Type something" onChange={(e) => setText(e.target.value)}
                   onKeyDown={(e) => {
                       if (e.key === "Enter" && text) {
                           sendTextAndClear();
                       }
                   }}
                   onFocus={() => setHasFocus(true)}
                   onBlur={() => setHasFocus(false)}
                   className="px-2 rounded-lg box-shadow flex-1 border-brand-secondary border-[1px] resize-none"/>
            <button className="p-2 rounded-xl bg-black" onClick={() => {
                if (text) {
                    sendTextAndClear();
                } else {
                    toast.warning("Please type something first");
                }
            }}>
                <SendIcon size={24} className="fill-white"/>
            </button>
        </div>
        {!hasFocus &&
            <Keyboard
                text={text}
                setText={setText}
                handleKeyPress={handleKeyPress}
                mode={mode}
                changeMode={cycleMode}
                cursor={cursor}
                setCursor={setCursor}
            />}
    </section>
}

export default memo(TTS);