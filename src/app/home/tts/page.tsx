"use client";

import "./style.css"
import {CaretDownIcon, SwapIcon} from "@/app/components/Icons";
import {useRef} from "react";
import Keyboard from "@/app/components/keyboard/Keyboard";
import {sanitizeHTML} from "@/lib/utils";
import {useKeypad} from "@/app/home/tts/useKeypad";
import useTTS from "@/app/home/tts/useTTS";


export default function TTS() {
    const displayRef = useRef<HTMLParagraphElement>(null);
    const {mode, text, setText, cycleMode, handleKeyPress, cursor, setCursor} = useKeypad();

    useTTS(text, setText, setCursor);

    if (displayRef.current) {
        const sanitizedText = sanitizeHTML(text)
        displayRef.current.innerHTML = `${sanitizedText.substring(0, cursor).replace(/ /g, '&nbsp;')}<span id="text-cursor"></span>${sanitizedText.substring(cursor).replace(/ /g, '&nbsp;')}`;
    }

    return <main className="accessibility flex justify-between flex-col w-full h-full px-4 pt-3 pb-4">
        <div className="fixed inset-0 bg-brand-bg z-20 flex flex-col">
            <div className="flex-1 w-full p-4 text-display" ref={displayRef}></div>

            <div className="h-[40px] w-full border-t-2 flex items-center justify-between px-2">
                <CaretDownIcon size={24}/>
                <button onClick={cycleMode}
                        className="flex items-center gap-1 bg-white rounded-md px-2 border-[1px] border-[#e6e6e6]">
                    <SwapIcon size={18}/>
                    <span className="w-[40px]">{mode}</span>
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
        </div>
    </main>
}