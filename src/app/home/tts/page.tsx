"use client";

import "./style.css"
import {CaretDownIcon, CaretLeftIcon, SwapIcon} from "@/components/Icons";
import {useRef} from "react";
import Keyboard from "@/components/keyboard/Keyboard";
import {sanitizeHTML} from "@/lib/utils";
import {useKeypad} from "@/app/home/tts/useKeypad";
import useTTS from "@/app/home/tts/useTTS";
import Link from "next/link";


export default function TTS() {
    const displayRef = useRef<HTMLParagraphElement>(null);
    const {mode, text, setText, cycleMode, handleKeyPress, cursor, setCursor} = useKeypad();

    useTTS(text, setText, setCursor);

    if (displayRef.current) {
        const sanitizedText = sanitizeHTML(text)
        displayRef.current.innerHTML = `${sanitizedText.substring(0, cursor).replace(/ /g, '&nbsp;')}<span id="text-cursor"></span>${sanitizedText.substring(cursor).replace(/ /g, '&nbsp;')}`;
    }

    return <main className="accessibility flex justify-between flex-col w-full h-full">
        <div className="h-[44px] flex items-center">
            <Link href="/home"><CaretLeftIcon/></Link>
            <h1 className="text-2xl ml-3">TTS</h1>
        </div>
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
    </main>
}