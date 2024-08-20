"use client";

import {useCallback} from "react";
import Login from "@/app/components/login/Login";
import SelectLanguage from "@/app/components/SelectLanguage";
import TextSize from "@/app/components/TextSize";
import {TPages} from "@/lib/types";
import {usePathname, useRouter, useSearchParams} from "next/navigation";


function ShowPage({currPage, pageSetter}: { currPage: TPages, pageSetter: (value: TPages) => void }) {
    switch (currPage) {
        default:
        case "0":
            return <Login pageSetter={pageSetter}/>;
        case "1":
            return <SelectLanguage pageSetter={pageSetter}/>;
        case "2":
            return <TextSize/>
    }
}

export default function Home() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currPage = searchParams.get("page") as TPages || "0";

    const changePage = useCallback((value: TPages) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", value);
        let ps = params.toString();
        router.push(pathname + '?' + ps);
    }, [pathname, router, searchParams]);

    return (
        <main className="w-full h-full">
            <ShowPage currPage={currPage} pageSetter={changePage}/>
        </main>
    );
}
