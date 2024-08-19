import "./style.css"
import "./keyboard.css"
import {BackspaceIcon, CaretDownIcon, CaretLeftIcon, CaretRightIcon} from "@/app/components/Icons";
import React, {useState} from "react";

interface IKeyboardData {
    value: number | string,
    otherValues: (number | string)[] | React.ReactElement[]
}


const keyboardKeys: {
    [key: string]: string[]
} = {
    '1': ['.', ','],
    '2': ['a', 'b', 'c'],
    '3': ['d', 'e', 'f'],
    '4': ['g', 'h', 'i'],
    '5': ['j', 'k', 'l'],
    '6': ['m', 'n', 'o'],
    '7': ['p', 'q', 'r', 's'],
    '8': ['t', 'u', 'v'],
    '9': ['w', 'x', 'y', 'z'],
    '*': ['*'],

};

const keyboardData: IKeyboardData[] = [
    {
        value: 1,
        otherValues: []
    }, {
        value: 2,
        otherValues: ['a', 'b', 'c']
    }, {
        value: 3,
        otherValues: ['d', 'e', 'f']
    }, {
        value: 4,
        otherValues: ['g', 'h', 'i']
    }, {
        value: 5,
        otherValues: ['j', 'k', 'l']
    }, {
        value: 6,
        otherValues: ['m', 'n', 'o']
    }, {
        value: 7,
        otherValues: ['q', 'q', 'r', 's']
    }, {
        value: 8,
        otherValues: ['t', 'u', 'v']
    }, {
        value: 9,
        otherValues: ['w', 'x', 'y', 'z']
    }, {
        value: '*',
        otherValues: ['+']
    }, {
        value: 0,
        otherValues: ['⎵']
    }, {
        value: '#',
        otherValues: []
    }
]

export default function Keyboard() {
    const [mode, setMode] = useState<'abc' | 'ABC' | '123'>('abc');
    const [text, setText] = useState('dd');
    const [lastKey, setLastKey] = useState<string | null>(null);
    const [charIndex, setCharIndex] = useState(0);
    const [lastTime, setLastTime] = useState(0);

    function cycleMode() {
        if (mode[0] === 'a') {
            setMode('ABC');
        } else if (mode[0] == 'A') {
            setMode('123');
        } else {
            setMode('abc');
        }
    }

    const handleKeyPress = (key: string) => {
        switch (mode) {
            case "123":
                setText((prevState) => prevState + key);
                break;
            case "abc":
            case "ABC":
                let sameKey = false;

                if(Date.now() - lastTime > 2000)
                    setLastKey(null);

                if (lastKey === key) {
                    sameKey = true;
                    setLastTime(Date.now());
                    setCharIndex((prevIndex) => (prevIndex + 1) % keyboardKeys[key].length);
                } else {
                    setCharIndex(0);
                }

                const substr = sameKey ?
                    ((Date.now() - lastTime < 2000) ? text.substring(0, text.length - 1) : text) :
                    text;

                const newText = substr + keyboardKeys[key][charIndex];
                setText(() => newText);
                setLastKey(key);
                setLastTime(0);

                console.log(key);
                break;
        }
    };

    return <div className="fixed inset-0 bg-brand-bg z-20 flex flex-col">
        <div className="flex-1 w-full p-4">
            {text ?
                text :
                <label className="mt-10 opacity-50 text-[24px]">Type...</label>
            }
        </div>

        <div className="h-[40px] w-full border-t-2 flex items-center justify-between px-4">
            <CaretDownIcon size={24}/>
            <button className="" onClick={cycleMode}>
                {mode}
            </button>
        </div>

        <div className="keyboard-cont w-full h-fit">
            <button className="kbc-button keys">
                <CaretLeftIcon/>
            </button>
            <button className="kbc-button keys">
                <CaretRightIcon/>
            </button>
            <button className="kbc-button keys" onClick={() =>
                setText(text.slice(0, -1))
            }>
                <BackspaceIcon/>
            </button>
            {
                Object.keys(keyboardKeys).map((key, i) => {
                    let alphabets = keyboardKeys[key].join('');

                    return <button className="keys kbc-button" key={i} onClick={() => {
                        handleKeyPress(key);
                    }}>
                        <span className="value">{key}</span>
                        {alphabets && <span className="subvalues">{alphabets}</span>}
                    </button>
                })
            }
            <button className="keys kbc-button" onClick={() => {
                if (mode != '123')
                    setText((prevState) => prevState + ' ');
                else
                    setText((prevState) => prevState + '0')
            }}>
                <span className="value">0</span>
                <span className="subvalues">⎵</span>
            </button>
            <button className="keys kbc-button">
                <span className="value">#</span>
                <span className="subvalues"></span>
            </button>
        </div>
    </div>
}