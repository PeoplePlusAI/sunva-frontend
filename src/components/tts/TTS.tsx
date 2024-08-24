import "./style.css"
import {CaretLeftIcon, KeyboardIcon, SendIcon, SwapIcon} from "@/components/Icons";
import {memo, useEffect, useRef, useState} from "react";
import Keyboard from "@/components/keyboard/Keyboard";
import {sanitizeHTML} from "@/lib/utils";
import {useKeypad} from "@/components/tts/useKeypad";
import useTTS from "@/components/tts/useTTS";

function TTS({className, onClose}: { className?: string, onClose: () => void }) {
    const displayRef = useRef<HTMLParagraphElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {mode, text, setText, cycleMode, handleKeyPress, cursor, setCursor} = useKeypad();
    const [inputMode, setInputMode] = useState<"keyboard" | "keypad">("keypad");
    const {sendText} = useTTS(text, setText, setCursor);

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

    return <main
        className={`accessibility flex justify-between flex-col w-full h-full window bg-brand-bg z-30 ${className}`}>
        <div className="h-[44px] flex items-center justify-between w-full">
            <div className="flex w-auto">
                <button onClick={onClose}><CaretLeftIcon/></button>
                <h1 className="text-2xl ml-3">TTS</h1>
            </div>
            {inputMode === "keyboard" &&
                <div className="mr-4 flex text-[10px] gap-2 items-center border-[1px] rounded-full px-2 py-1">
                    <div className="status-indicator active"></div>
                    Keyboard input</div>}
        </div>
        {inputMode === "keypad" ?
            <div onClick={() => {
                setInputMode(() => "keyboard");
                setTimeout(() => {
                    document.getElementById("textarea_input")?.focus();
                }, 0);
            }}
                 className={`flex-1 w-full p-4 text-display ${text === '' ? 'text-black text-opacity-60' : ''}`}
                 ref={displayRef}>
            </div> :
            <textarea ref={textareaRef} id="textarea_input" className="bg-brand-bg flex-1 w-full p-4 focus:outline-none"
                      value={text}
                      onKeyDown={e => {
                          setCursor((e.target as HTMLTextAreaElement).selectionStart)
                      }} onChange={(e) => {
                setCursor(e.target.selectionStart);

                setText(e.target.value)
            }} placeholder="Type here..."/>
        }
        <div className="h-[40px] w-full border-t-2 flex items-center justify-between px-2">
            <button onClick={() => setInputMode(prevState => prevState === "keyboard" ? "keypad" : "keyboard")}
                    className={`p-1 rounded-md ${inputMode === 'keyboard' ? 'bg-blue-100 shadow ' : ''}`}>
                <KeyboardIcon/>
            </button>
            <button onClick={cycleMode}
                    className="flex items-center gap-1 bg-white rounded-md px-2 border-[1px] border-[#e6e6e6]">
                <SwapIcon size={18}/>
                <span className="w-[40px]">{mode}</span>
            </button>
            <button onClick={() => {
                if (text) {
                    sendText(text);
                    setText('');
                    setCursor(0);
                }
            }} className="hover:scale-105 hover:bg-green-300 active:bg-green-300 rounded-md p-1">
                <SendIcon size={24}/>
            </button>
        </div>
        <Keyboard
            text={text}
            setText={setText}
            handleKeyPress={handleKeyPress}
            mode={mode}
            changeMode={cycleMode}
            cursor={cursor}
            setCursor={setCursor}
        />
    </main>
}

export default memo(TTS);