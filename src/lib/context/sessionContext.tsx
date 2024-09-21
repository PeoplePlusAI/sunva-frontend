// 'use client';
// import {createContext, useState} from 'react';
// import {StateSetter} from "@/lib/types";
//
// interface IUserData {
//     "user_id": string,
//     "email": string,
//     "language": string
// }
//
// const SessionContext = createContext<
//     [string, React.Dispatch<StateSetter<IUserData>>] | undefined
// >(undefined);
//
// function UserProvider({children}: { children: React.ReactNode }) {
//     const [lang, setLang] = useState("en");
//
//
//     function setLangAndStore(value: string) {
//         setLang(value)
//     }
//
//     return (
//         <SessionContext.Provider value={[lang, setLangAndStore as StateSetter<string>]}>
//             {children}
//         </SessionContext.Provider>
//     );
// }
//
// export function useSession() {
//     const context = React.useContext(SessionContext);
//     if (context === undefined) {
//         throw new Error('useCounter must be used within a CounterProvider');
//     }
//     return context;
// }