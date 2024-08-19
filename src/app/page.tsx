"use client";

import {useState} from "react";
import Login from "@/app/components/Login";
import SelectLanguage from "@/app/components/SelectLanguage";
import TextSize from "@/app/components/TextSize";
import {StateSetter, TPages} from "@/lib/types";


function ShowPage({currPage, pageSetter}: {currPage: TPages, pageSetter: StateSetter<TPages>}) {
    switch(currPage) {
        case 0:
            return <Login pageSetter={pageSetter}/>;
        case 1:
            return <SelectLanguage pageSetter={pageSetter}/>;
        case 2:
            return <TextSize/>
    }
}

export default function Home() {
    const [currPage, setCurrPage] = useState<TPages>(0);

    return (
        <main className="w-full h-full">
            <ShowPage currPage={currPage} pageSetter={setCurrPage}/>
        </main>
    );
}
