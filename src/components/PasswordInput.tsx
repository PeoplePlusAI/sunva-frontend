import {StateSetter} from "@/lib/types";
import {useState} from "react";
import {HideEyeIcon, ViewEyeIcon} from "@/components/Icons";

export function PasswordInput({password, setPassword, name, placeholder}: {
    password: string,
    setPassword: StateSetter<string>,
    name?: string,
    placeholder?: string
}) {
    const [hidePass, setHidePass] = useState(true);

    return <div className="flex w-full">
        <input type={hidePass ? "password" : "text"}
               className="border-[2px] w-[calc(100%-44px)] rounded-l-lg border-r-0"
               name={name || "password"} placeholder={placeholder || "Password here"}

               value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <button
            className="size-[44px] bg-white flex items-center justify-center border-[2px] border-l-0 border-opacity-50 border-brand-secondary rounded-r-lg"
            onClick={(e) => {
                e.preventDefault();
                setHidePass(!hidePass);
            }}
        >
            {hidePass ? <HideEyeIcon/> : <ViewEyeIcon/>}
        </button>
    </div>
}