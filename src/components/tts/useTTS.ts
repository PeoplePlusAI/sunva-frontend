import {StateSetter} from "@/lib/types";

function sendTtsText(text: string, lang: string) {
    let ttsSocket: WebSocket;
    // @ts-ignore
    if (!ttsSocket || ttsSocket.readyState !== WebSocket.OPEN) {
        ttsSocket = new WebSocket("api/v1/ws/speech");
        ttsSocket.onopen = () => {
            console.log("TTS WebSocket connected");
            ttsSocket.send(JSON.stringify({
                text,
                language: lang
            }));
        };
    } else {
        ttsSocket.send(text);
    }

    ttsSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
        if (message.audio) {
            console.log("Received TTS audio data");
            playTtsAudio(message.audio);
        }
    };

    ttsSocket.onclose = () => {
        console.log("TTS WebSocket disconnected");
    };
}

function playTtsAudio(audioBase64: any) {
    const audioBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(audioBytes.buffer, buffer => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
    });

    console.log("Reached here");
}

export default function useTTS(text: string, setText: StateSetter<string>, setCursor: StateSetter<number>, lang: string) {
    const sentenceEndings = /[.?!]/g;
    const sentences = text.split(sentenceEndings);

    if (sentences.length > 1) {
        const buffer = sentences.slice(0, -1).join('.') + text.match(sentenceEndings)?.slice(0, -1).join('');
        console.log("Sending TTS text:", buffer);
        sendTtsText(buffer, lang);
        let currText = sentences[sentences.length - 1];
        setText(currText);
        setCursor(currText.length - 1 < 0 ? 0 : currText.length - 1);
    }

    return {
        sendText: (text: string) => {
            sendTtsText(text, lang);
        }
    }
}