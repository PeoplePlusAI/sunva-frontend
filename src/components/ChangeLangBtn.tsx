import {useLang} from "@/lib/context/langContext";
import useLangAvail from "@/lib/hooks/useLangAvail";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {langDict} from "@/lib/lang";

export default function ChangeLangBtn() {
    const [lang, setLang] = useLang();
    const {langList} = useLangAvail();

    return <Select value={lang} onValueChange={(e) => {
        setLang(e);
    }}>
        <SelectTrigger className="w-fit bg-[#EDEDED] px-4 py-1 ml-[50px]">
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
}