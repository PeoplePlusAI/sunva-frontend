"use client";

import "./home.css"
import {
    KeyboardIcon,
    MicroPhoneIcon,
    NoteIcon,
    SettingsIcon,
    StopIcon,
    TrashIcon,
    UpAndDownArrow
} from "@/components/Icons";
import {useEffect, useState} from "react";
import MessagesList from "@/components/MessageList";
import Link from "next/link";
import useSunvaAI from "@/lib/hooks/useSunvaAI";
import TTS from "@/components/tts/TTS";
import ChangeLangBtn from "@/components/ChangeLangBtn";
import {useSession} from "@/lib/context/sessionContext";
import {redirect} from "next/navigation";
import {SaveAndDeletePrompts} from "@/components/SaveAndDeletePrompts";


export default function Home() {
    const [session] = useSession();
    const {
        messages,
        setMessages,
        isRecording,
        setIsRecording,
        isActive,
        startRecording,
        stopRecording
    } = useSunvaAI(session);
    const [isTTSOpen, setIsTTSOpen] = useState(false);
    const [isDelOpen, setIsDelOpen] = useState(false);
    const ttsClose = () => {
        setIsTTSOpen(false);
    };

    // If use isn't logged then redirect to the home page
    useEffect(() => {
        try {
            let stored = localStorage.getItem("user-session");
            if (stored) {
                let data = JSON.parse(atob(stored));
                if (!data.email)
                    redirect("/");
            } else {
                redirect("/");
            }
        } catch (e) {
            redirect("/");
        }
    }, [session?.email]);

    return <main className="accessibility flex justify-between flex-col w-full h-full px-4 pt-3 pb-4">
        <button onClick={() => {
            fetch("http://localhost:8000/user/verify", {
                method: 'GET',
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }}>
            Hello
        </button>

        <div className="w-full h-[40px] flex items-center justify-between">
            <Link href="/home/saved" className="w-[24px]">
                <NoteIcon/>
            </Link>
            <ChangeLangBtn/>
            <div
                className="w-[90px] flex items-center justify-center gap-2 rounded-full border-[1px] border-[#e6e6e6] px-2 text-sm text-black text-opacity-60">
                <div className={`status-indicator ${isActive}`}></div>
                {isActive}
            </div>
        </div>
        <MessagesList messages={messages}/>

        {isTTSOpen ? <TTS setMessages={setMessages} onClose={ttsClose}/> :
            <div className="px-5 h-[75px] py-1 bg-white shadow flex rounded-3xl gap-7 justify-evenly items-center">
                <Link href="/settings">
                    <SettingsIcon/>
                </Link>
                <button onClick={() => setIsDelOpen(true)}><TrashIcon/></button>
                <button
                    className={`h-[65%] aspect-square rounded-full flex items-center justify-center record-btn ${isRecording ? 'recording' : ''}`}
                    onClick={() => {
                        setIsRecording((prev) => !prev);

                        if (isRecording) {
                            stopRecording();
                        } else {
                            startRecording();
                        }
                    }}
                >
                    {isRecording ? <StopIcon/> : <MicroPhoneIcon/>}
                </button>
                <button onClick={() => {
                    setIsTTSOpen(true);
                    setIsRecording(false);
                    stopRecording();
                }}>
                    <KeyboardIcon/>
                </button>
                <UpAndDownArrow/>
            </div>}

        <SaveAndDeletePrompts isDelOpen={isDelOpen} setIsDelOpen={setIsDelOpen} session={session}/>
    </main>
}