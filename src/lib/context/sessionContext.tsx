'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {StateSetter} from "@/lib/types";

interface IUserSession {
    lang: string;
    email: string | null;
    user_id: string | null;
}

export type TSessionCtx = IUserSession | null;

const SessionContext = createContext<[TSessionCtx, StateSetter<TSessionCtx>] | undefined>(undefined);

const LocalStoreKey = "user-session";

export function SessionProvider({children}: { children: React.ReactNode }) {
    const [session, setSession] = useState<TSessionCtx>({
        lang: "en",
        email: null,
        user_id: null
    });

    function setSessionAndStore(value: IUserSession) {
        console.log(value)
        localStorage.setItem(LocalStoreKey, JSON.stringify(value));
        setSession(value);
    }

    useEffect(() => {
        try {
            const rawData = localStorage.getItem(LocalStoreKey);

            if (rawData === "undefined" || !rawData) {
                setSessionAndStore({
                    lang: "en",
                    email: null,
                    user_id: null
                })
                return;
            }

            const item = JSON.parse(rawData!) as IUserSession;

            if (item)
                setSession(item);
        } catch (e) {
            console.error("Error while loading session from local storage", e);
            setSession(null);
        }
    }, []);

    return (
        <SessionContext.Provider value={[session, setSessionAndStore as StateSetter<TSessionCtx>]}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('use ctx hook must be used within that ctx provider');
    }

    return context;
}