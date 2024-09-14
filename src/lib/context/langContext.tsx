'use client';

import React, {useEffect} from 'react';
import {StateSetter} from "@/lib/types";

const LangContext = React.createContext<
    [string, React.Dispatch<React.SetStateAction<string>>] | undefined
>(undefined);

export function LangProvider({children}: { children: React.ReactNode }) {
    const [lang, setLang] = React.useState("en");

    useEffect(() => {
        let item = localStorage.getItem("preferred-lang");
        if(item)
            setLang(item);
    }, []);

    function setLangAndStore(value: string) {
        localStorage.setItem("preferred-lang", value);
        setLang(value)
    }

    return (
        <LangContext.Provider value={[lang, setLangAndStore as StateSetter<string>]}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    const context = React.useContext(LangContext);
    if (context === undefined) {
        throw new Error('use ctx hook must be used within that ctx provider');
    }
    return context;
}