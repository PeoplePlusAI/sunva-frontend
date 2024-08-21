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
import {useRef, useState} from "react";
import MessagesList from "@/components/MessageList";
import {Dialog} from "@/components/Alerts";
import Link from "next/link";
import useSunvaAI from "@/app/home/useSunvaAI";
import {toast} from "sonner";
import {STORE_NAME} from "@/data/main";


export default function Home() {
    const [isDelOpen, setIsDelOpen] = useState(false);
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const {messages, handleRecord, isRecording, setIsRecording, isActive} = useSunvaAI();
    const saveNameRef = useRef<HTMLInputElement>(null);

    return <main className="accessibility flex justify-between flex-col w-full h-full px-4 pt-3 pb-4">
        <div className="w-full h-[40px] flex items-center justify-between">
            <Link href="/home/saved" className="w-[24px]">
                <NoteIcon/>
            </Link>
            <h1 className="ml-[50px]">English</h1>
            <div
                className="w-[90px] flex items-center justify-center gap-2 rounded-full border-[1px] border-[#e6e6e6] px-2 text-sm text-black text-opacity-60">
                <div className={`status-indicator ${isActive}`}></div>
                {isActive}
            </div>
        </div>
        <MessagesList messages={messages}/>

        <div className="px-5 h-[75px] py-1 bg-white shadow flex rounded-3xl gap-7 justify-evenly items-center">
            <SettingsIcon/>
            <button onClick={() => setIsDelOpen(true)}><TrashIcon/></button>
            <button
                className={`h-[65%] aspect-square rounded-full flex items-center justify-center record-btn ${isRecording ? 'recording' : ''}`}
                onClick={() => {
                    handleRecord(!isRecording);
                    setIsRecording(!isRecording);
                }}
            >
                {isRecording ? <StopIcon/> : <MicroPhoneIcon/>}
            </button>
            <Link href="/home/tts">
                <KeyboardIcon/>
            </Link>
            <UpAndDownArrow/>
        </div>

        <Dialog
            title="Do you want to save this conversation?"
            acceptText="Save"
            rejectText="Cancel"
            open={isDelOpen}
            setOpen={setIsDelOpen}
            onAccept={() => {
                setIsDelOpen(false);
                setIsSaveOpen(true);
            }}
        >
            <br/>
        </Dialog>

        <Dialog
            title="Save As"
            acceptText="Save"
            rejectText="Cancel"
            open={isSaveOpen}
            setOpen={setIsSaveOpen}
            onAccept={() => {
                if (!saveNameRef.current?.value) {
                    toast.error("Please enter a name");
                } else {
                    let msg_data = JSON.stringify(messages);
                    localStorage.setItem(STORE_NAME + saveNameRef.current.value, msg_data);
                }
            }}
        >
            <input type="text" ref={saveNameRef}
                   className="my-5 w-full px-2 py-2 rounded-xl border-2 border-brand-secondary"
                   placeholder="Enter here"/>
        </Dialog>
    </main>
}