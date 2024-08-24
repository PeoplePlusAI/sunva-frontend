import {useEffect, useState} from "react";
import {StateSetter, TMessage, TServerStates} from "@/lib/types";
import RecordRTC from "recordrtc";
import {arrayBufferToBase64} from "@/lib/sunva-ai";
import {toast} from "sonner";
import {BACKEND_URL, BACKEND_WS_URL} from "@/data/main";

let transcribeAndProcessSocket: WebSocket;
let recorder: RecordRTC;
const audioQueue: Blob[] = [];
let isSending = false;


async function startRecording(setRecording: StateSetter<boolean>, setIsActive: StateSetter<TServerStates>) {
    try {
        // console.log('Starting recording...');
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        // console.log('Microphone access granted');

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
        // console.log('Recording started');
    } catch (error) {
        toast.error("Error accessing microphone");
        setRecording(false);
        setIsActive("inactive");
    }
}

function stopRecording() {
    // console.log('Stopping recording...');
    if (recorder && recorder.getState() !== 'inactive') {
        recorder.stopRecording(() => {
            sendAudioChunks();
        });
    }
}

async function sendAudioChunks() {
    if (audioQueue.length > 0 && !isSending) {
        isSending = true;
        const audioBlob = audioQueue.shift();
        if (!audioBlob)
            return;

        const arrayBuffer = await audioBlob.arrayBuffer();
        const base64String = arrayBufferToBase64(arrayBuffer);
        // console.log('Sending audio data to server');
        transcribeAndProcessSocket.send(JSON.stringify({audio: base64String}));
        // console.log('Sent audio data to server');
        isSending = false;
        sendAudioChunks();  // Continue sending remaining chunks
    } else {
        console.log('No audio chunks to send');
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
        transcribeAndProcessSocket = new WebSocket(`${BACKEND_WS_URL}/v1/ws/transcription`);

        transcribeAndProcessSocket.onopen = () => {
            console.log('Transcription and Processing WebSocket connected');
            startRecording(setIsRecording, setIsActive);
        };

        transcribeAndProcessSocket.onmessage = (event) => {
            const data = JSON.parse(event.data) as IServerRes;
            console.log(data);

            // setMessages((prevState) => {
            //     let index = -1;
            //     console.log("\nStarting loop")
            //     for(let i = 0; i < prevState.length; i++) {
            //         console.log(prevState[i])
            //         if(prevState[i].id === data.message_id) {
            //             index = i;
            //             break;
            //         }
            //     }
            //     console.log("Ending loop\n")
            //
            //     console.log("Index =", index, "is existing:", index !== -1, "ID:", data.message_id);
            //
            //     return [...prevState, {
            //         message: data.text,
            //         id: data.message_id,
            //         name: "Person 1"
            //     }]
            // })

            if (data.type === "transcription") {
                setMessages((prevState) => {
                    let temp = [...prevState];
                    let index = -1;

                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i].id === data.message_id) {
                            index = i;
                            break;
                        }
                    }

                    if (index === -1) {
                        return [...prevState, {
                            name: "Person 1",
                            message: data.text,
                            id: data.message_id
                        }]
                    }

                    temp[index].summarized = '';
                    temp[index].message += ' ' + data.text;
                    return temp;
                })
            }
            else if (data.type === "concise" || data.type === "highlight") {
                setMessages(prevState => {
                    let temp = [...prevState];
                    let index: number | null = null;

                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i].id === data.message_id) {
                            index = i;
                            break;
                        }
                    }

                    if (index !== null) {
                        temp[index].summarized = data.text;
                        return temp;
                    }

                    return [...prevState, {
                        name: "Person 1",
                        message: data.text,
                        summarized: data.text,
                        id: data.message_id
                    }]
                })
            } else {
                throw new Error("Undefined type found in the server response");
            }
        };

        transcribeAndProcessSocket.onclose = (e) => {
            setIsRecording(false);
            if (!e.wasClean) {
                setIsActive("inactive");
                toast.error("Connection to server closed unexpectedly");
            }
            console.log('Transcription and Processing WebSocket disconnected');
            stopRecording();
        };

        transcribeAndProcessSocket.onerror = () => {
            setIsRecording(false);
            setIsActive("inactive");
            toast.error("Couldn't connect to the server");
        }
    } catch (e) {
        console.log("Error:", e);
        setIsRecording(false);
    }
}

function stopTranscriptionAndProcessing() {
    if (transcribeAndProcessSocket) {
        transcribeAndProcessSocket.close();
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