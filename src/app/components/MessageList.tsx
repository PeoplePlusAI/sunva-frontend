import {TMessage} from "@/lib/types";
import {memo, useEffect, useRef, useState} from "react";

function Message({item}: { item: TMessage }) {
    const [showOriginal, setShowOriginal] = useState(true);

    useEffect(() => {
        if (item.summarized)
            setShowOriginal(false);
    }, [item.summarized]);

    return <>
        <div
            className={` ${showOriginal ? '' : 'summarize'} message-box`}
        >
            <label className={`font-bold block`}>{item.name}</label>
            <p className="h-auto">
                {item.summarized ?
                    (showOriginal ? item.summarized : item.message) :
                    item.message
                }
            </p>
        </div>
        {item.summarized &&
            <div className="relative w-full text-right h-3">
                <button className="view-og-btn absolute right-0 top-[-10px]" onClick={() => {
                    setShowOriginal(!showOriginal);
                }}>
                    {showOriginal ? "Summarized" : "Original"}
                </button>
            </div>
        }
    </>
}


function MessagesList({messages}: { messages: TMessage[] }) {
    const section = useRef<HTMLDivElement>(null);
    useEffect(() => {
        section.current?.scrollTo(0, section.current.scrollHeight);
    }, [messages]);

    return <div ref={section}
                className="w-full flex-1 rounded-lg pt-2 gap-2 overflow-y-scroll hide-scrollbar space-y-4 pb-5"
    >
        {
            messages.length === 0 ? <p className="text-center opacity-30 text-2xl mt-40">Start a conversation</p> :
                <>
                    {messages.map((item, i) => {
                        return <Message item={item} key={i}/>
                    })}
                </>
        }
    </div>;
}

export default memo(MessagesList);