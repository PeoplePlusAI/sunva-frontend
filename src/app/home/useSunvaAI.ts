import {useState} from "react";
import {StateSetter, TMessage} from "@/lib/types";
import RecordRTC from "recordrtc";
import {arrayBufferToBase64} from "@/lib/sunva-ai";


let transcribeAndProcessSocket: WebSocket;
let recorder: RecordRTC;
const audioQueue: Blob[] = [];
let isSending = false;

async function startRecording() {
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
            }
        });

        recorder.startRecording();
        console.log('Recording started');
    } catch (error) {
        console.log('Error accessing microphone:', error);
    }
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
        isSending = true;
        const audioBlob = audioQueue.shift();
        if (!audioBlob)
            return;

        const arrayBuffer = await audioBlob.arrayBuffer();
        const base64String = arrayBufferToBase64(arrayBuffer);
        console.log('Sending audio data to server');
        transcribeAndProcessSocket.send(JSON.stringify({audio: base64String}));
        console.log('Sent audio data to server');
        isSending = false;
        sendAudioChunks();  // Continue sending remaining chunks
    } else {
        console.log('No audio chunks to send');
    }
}

function startTranscriptionAndProcessing(setMessages: StateSetter<TMessage[]>) {
    transcribeAndProcessSocket = new WebSocket("ws://localhost:8000/v1/ws/transcription");

    transcribeAndProcessSocket.onopen = () => {
        console.log('Transcription and Processing WebSocket connected');
        startRecording();
    };

    transcribeAndProcessSocket.onmessage = (event) => {
        const data = JSON.parse(event.data) as { transcription: string, processed_text: string };
        console.log(data);
        if (data.transcription)
            setMessages(prevState => [...prevState, {
                name: "Person 1",
                message: data.transcription,
                summarized: data.processed_text || ''
            }]);

    };

    transcribeAndProcessSocket.onclose = () => {
        console.log('Transcription and Processing WebSocket disconnected');
        stopRecording();
    };
}

function stopTranscriptionAndProcessing() {
    if (transcribeAndProcessSocket) {
        transcribeAndProcessSocket.close();
    }
    stopRecording();
}


export function useSunvaAI() {
    const [messages, setMessages] = useState<TMessage[]>([]);

    function handleRecord(isRecording: boolean) {
        if (isRecording) {
            stopTranscriptionAndProcessing();
        } else {
            startTranscriptionAndProcessing(setMessages);
        }
    }

    return [messages, handleRecord] as [TMessage[], (isRecording: boolean) => void];
}