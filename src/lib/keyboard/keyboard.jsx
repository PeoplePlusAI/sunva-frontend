"use client";

import React, {useState} from 'react';

export default function NokiaKeypad() {
    const [text, setText] = useState('');
    const [lastKey, setLastKey] = useState(null);
    const [charIndex, setCharIndex] = useState(0);
    const [timeoutId, setTimeoutId] = useState(null);

    const keys = {
        '2': ['a', 'b', 'c'],
        '3': ['d', 'e', 'f'],
        '4': ['g', 'h', 'i'],
        '5': ['j', 'k', 'l'],
        '6': ['m', 'n', 'o'],
        '7': ['p', 'q', 'r', 's'],
        '8': ['t', 'u', 'v'],
        '9': ['w', 'x', 'y', 'z'],
    };

    const handleKeyPress = (key) => {
        if (lastKey === key) {
            setCharIndex((prevIndex) => (prevIndex + 1) % keys[key].length);
        } else {
            setCharIndex(0);
            clearTimeout(timeoutId);
        }

        const newText = text.slice(0, -1) + keys[key][charIndex];
        setText(newText);
        setLastKey(key);

        const newTimeoutId = setTimeout(() => {
            setLastKey(null);
        }, 1000);

        setTimeoutId(newTimeoutId);
    };

    return (
        <div>
            <input type="text" value={text} readOnly/>
            <div>
                {Object.keys(keys).map((key) => (
                    <button key={key} onClick={() => handleKeyPress(key)}>
                        {key}
                    </button>
                ))}
            </div>
        </div>
    );
};

