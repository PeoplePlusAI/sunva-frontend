"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useState} from "react";
import {StateSetter, TPages} from "@/lib/types";



export default function SelectLanguage({pageSetter} : {pageSetter: StateSetter<TPages>}) {
    const [lang, setLang] = useState("english");

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
                    <SelectValue placeholder="English" className="bg-red-500"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="malayalam">Malayalam</SelectItem>
                </SelectContent>
            </Select>

        </div>
        <button className="btn-primary w-full" onClick={() => {
            pageSetter(2);
        }}>
            Continue
        </button>
    </section>
}