import {useEffect, useState} from "react";
import {StateSetter, TMessage, TServerStates} from "@/lib/types";
import RecordRTC from "recordrtc";
import {arrayBufferToBase64} from "@/lib/sunva-ai";
import {toast} from "sonner";
import {BACKEND_URL, BACKEND_WS_URL} from "@/data/main";

let transcribeAndProcessSocket: WebSocket | null;
let recorder: RecordRTC;
const audioQueue: Blob[] = [];
let isSending = false;


async function startRecording(setRecording: StateSetter<boolean>, setIsActive: StateSetter<TServerStates>) {
    console.group("Record Start")
    try {
        console.log('Starting recording...');
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        console.log('Microphone access granted');

        recorder = new RecordRTC(stream, {
            type: 'audio',
            recorderType: RecordRTC.StereoAudioRecorder,
            mimeType: 'audio/wav',
            numberOfAudioChannels: 1,  // Mono channel is sufficient for speech recognition
            desiredSampRate: 16000,
            timeSlice: 5000, // Get data every 5 seconds
            ondataavailable: (blob) => {
                if (blob && blob.size > 0) {
                    audioQueue.push(blob);
                    sendAudioChunks();
                }
            },
        });

        setIsActive("active");
        recorder.startRecording();
        console.log('Recording started');
    } catch (error) {
        console.error("Error accessing microphone");
        toast.error("Error accessing microphone");
        setRecording(false);
        setIsActive("inactive");
    }
    console.groupEnd();
}

function stopRecording() {
    console.log('Stopping recording...');
    if (recorder && recorder.getState() !== 'inactive') {
        recorder.stopRecording(() => {
            sendAudioChunks();
        });
    }
}

async function sendAudioChunks() {
    if (audioQueue.length > 0 && !isSending) {
        console.group("Send Audio");

        isSending = true;
        const audioBlob = audioQueue.shift();
        if (!audioBlob)
            return;

        const arrayBuffer = await audioBlob.arrayBuffer();
        const base64String = arrayBufferToBase64(arrayBuffer);
        console.log('Sending audio data to server');
        transcribeAndProcessSocket?.send(JSON.stringify({audio: base64String}));
        console.log('Sent audio data to server');
        isSending = false;
        sendAudioChunks();  // Continue sending remaining chunks
        console.groupEnd();
    } else {
        console.warn('No audio chunks to send');
    }
}

interface IServerRes {
    type: "transcription" | "concise" | "highlight";
    text: string;
    message_id: string
}

function startTranscriptionAndProcessing(
    setMessages: StateSetter<TMessage[]>,
    setIsRecording: StateSetter<boolean>,
    setIsActive: StateSetter<TServerStates>
) {
    try {
        if(transcribeAndProcessSocket)
            transcribeAndProcessSocket.close();

        transcribeAndProcessSocket = new WebSocket(`${BACKEND_WS_URL}/v1/ws/transcription`);

        transcribeAndProcessSocket.onopen = () => {
            console.log('Transcription and Processing WebSocket connected');
            startRecording(setIsRecording, setIsActive);
        };

        transcribeAndProcessSocket.onmessage = (event) => {
            const data = JSON.parse(event.data) as IServerRes;
            console.log("Received Data:", data);

            if (!data.text) {
                console.warn("The server returned empty string; skipping this.");
                return;
            }

            setMessages((prevState) => {
                console.log("%c===========State Update============", "color:red;font-size:30px")
                console.log("TIME:", Date.now());

                // Find if the message with same ID already exists.
                const index = prevState.findIndex(message => message.id === data.message_id);

                if (data.type === "transcription") {
                    if (index !== -1) {
                        const updatedMessages = [...prevState];
                        updatedMessages[index].message = `${updatedMessages[index].message} ${data.text}`;
                        return updatedMessages;
                    }

                    return [
                        ...prevState,
                        {name: "Person 1", message: data.text, id: data.message_id}
                    ];
                }

                // If the data type is "concise" or "highlight", update the summarized text or add a new message.
                if (data.type === "concise" || data.type === "highlight") {
                    if (index !== -1) {
                        const updatedMessages = [...prevState];
                        updatedMessages[index].summarized = data.text;
                        return updatedMessages;
                    }
                    return [
                        ...prevState,
                        {name: "Person 1", message: data.text, summarized: data.text, id: data.message_id}
                    ];
                }
                // Throw an error for any undefined data type.
                throw new Error("Undefined type found in the server response: " + data.type);
            });
        };

        transcribeAndProcessSocket.onclose = (e) => {
            setIsRecording(false);
            if (!e.wasClean) {
                console.error("Connection to server closed unexpectedly")
                setIsActive("inactive");
                toast.error("Connection to server closed unexpectedly");
            }
            console.log('Transcription and Processing WebSocket disconnected');
            stopRecording();
            transcribeAndProcessSocket = null;
        };

        transcribeAndProcessSocket.onerror = () => {
            setIsRecording(false);
            setIsActive("inactive");
            toast.error("Couldn't connect to the server");
            transcribeAndProcessSocket = null;
        }
    } catch (e) {
        console.log("Error:", e);
        transcribeAndProcessSocket?.close();
        transcribeAndProcessSocket = null;
        setIsRecording(false);
    }
}

function stopTranscriptionAndProcessing() {
    if (transcribeAndProcessSocket) {
        transcribeAndProcessSocket.close();
        transcribeAndProcessSocket = null;
    }
    stopRecording();
}

export default function useSunvaAI() {
    const [isActive, setIsActive] = useState<TServerStates>("active");
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState<TMessage[]>([]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/is-alive`, {
            headers: {},
            mode: "no-cors",
        })
            .then(() => {
                setIsActive("active");
            })
            .catch(error => {
                setIsActive("inactive");
                console.error("Server is not available", error);
            });
    }, []);

    function startRecording() {
        startTranscriptionAndProcessing(setMessages, setIsRecording, setIsActive);
    }

    function stopRecording() {
        stopTranscriptionAndProcessing();
    }

    return {
        isActive,
        setIsActive,
        isRecording,
        setIsRecording,
        messages,
        startRecording,
        stopRecording
    }
}