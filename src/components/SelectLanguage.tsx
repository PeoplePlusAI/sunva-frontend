"use client";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {TPages} from "@/lib/types";
import {toast} from "sonner";
import {useLang} from "@/lib/context/langContext";
import {langDict} from "@/lib/lang";
import useLangAvail from "@/lib/hooks/useLangAvail";


export default function SelectLanguage({pageSetter}: { pageSetter: (val: TPages) => void }) {
    const {langList} = useLangAvail();
    const [lang, setLang] = useLang();

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

            pageSetter("accessibility");
        }}>
            Continue
        </button>
    </section>
}