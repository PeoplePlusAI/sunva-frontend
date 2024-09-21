import type {Metadata} from "next";
import "./globals.css";
import {inter} from "@/lib/font";
import {Toaster} from "@/components/ui/sonner";
import {LangProvider} from "@/lib/context/langContext";


export const metadata: Metadata = {
    title: "Sunva AI",
    description: "TODO",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <LangProvider>
            {children}
        </LangProvider>
        <Toaster richColors theme="light" closeButton position="top-center"/>
        </body>
        </html>
    );
}
