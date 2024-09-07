"use client";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {useEffect, useState} from "react";
import {TPages} from "@/lib/types";
import {toast} from "sonner";
import {useLang} from "@/lib/context/langContext";

interface I_Lang {
    [code: string]: string;
}

const langDict: I_Lang = {
    'en': 'English',
    'hi': 'Hindi',
    'kn': 'Kannada',
    'ml': 'Malayalam',
};

export default function SelectLanguage({pageSetter}: { pageSetter: (val: TPages) => void }) {
    const [langList, setLangList] = useState<string[]>(['en']);
    // const {lang, setLang} = useLang();
    const [lang, setLang] = useLang();

    useEffect(() => {
        fetch(`/api/v1/languages`)
            .then(res => {
                console.log(res)
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setLangList(data.languages);
            })
            .catch((e) => {
                toast.error("Error while fetching languages");
                console.error("Error while fetching languages from server:", e);
            })
    }, []);

    console.log(langList)

    return <section className="page flex items-center justify-between flex-col">
        <div className="flex h-[80%] flex-col justify-center w-full px-4">
            <h1 className="text-[24px] leading-[28px] w-full mb-10">
                Select your language
            </h1>
            <label className="mb-2">Language</label>
            <Select value={lang} onValueChange={(e) => {
                setLang(e);
            }}>
                <SelectTrigger className="w-full h-[40px]">
                    <SelectValue placeholder="en" defaultValue="en" className="bg-red-500"/>
                </SelectTrigger>
                <SelectContent>
                    {langList.map((langCode) => {
                        return <SelectItem key={langCode} value={langCode}>
                            {langDict[langCode]}
                        </SelectItem>
                    })}
                </SelectContent>
            </Select>

        </div>
        <button className="btn-primary w-full" onClick={() => {
            if (lang === "") {
                toast.error("Please select a language");
                return;
            }

            pageSetter("2");
        }}>
            Continue
        </button>
    </section>
}