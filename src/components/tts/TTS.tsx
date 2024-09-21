import "./style.css"
import {memo, useEffect, useRef} from "react";
import useTTS from "@/components/tts/useTTS";
import {SendIcon} from "@/components/Icons";
import {useLang} from "@/lib/context/langContext";
import {toast} from "sonner";
import {StateSetter, TMessage} from "@/lib/types";

function TTS({setMessages, onClose}: { setMessages: StateSetter<TMessage[]>, onClose: () => void }) {
    const inputElmRef = useRef<HTMLInputElement>(null);
    const [lang] = useLang();
    const {text, setText, sendText} = useTTS(lang, () => {
        // When a new text is sent to the server, add the message to the message list;
        setMessages((prev) => [...prev, {name: "You", message: text, id: "" + (Date.now() + Math.random())}]);
    });

    // When opening focus the input element
    useEffect(() => {
        inputElmRef.current?.focus();
    }, []);

    function sendTextOnly() {
        sendText(text);
        setText('');
    }

    function sendTextAndClear() {
        sendTextOnly();
    }

    return <section className="-mb-4">
        <div className="w-full flex gap-2 px-0 mb-4">
            <input type="text" value={text} placeholder="Type something" onChange={(e) => {
                setText(e.target.value);
            }}
                   onKeyDown={(e) => {
                       if (e.key === "Enter" && text) {
                           sendTextAndClear();
                       }
                   }}
                   onBlur={() => {
                       setTimeout(() => onClose(), 0);
                   }}
                   className="px-2 rounded-lg box-shadow flex-1 border-brand-secondary border-[1px] resize-none"
                   ref={inputElmRef}
            />
            <button className="p-2 rounded-xl bg-black" onClick={() => {
                inputElmRef.current?.focus();
                console.log("hello");
                if (text) {
                    sendTextAndClear();
                } else {
                    toast.warning("Please type something first");
                }
            }}>
                <SendIcon size={24} className="fill-white"/>
            </button>
        </div>
    </section>
}

export default memo(TTS);