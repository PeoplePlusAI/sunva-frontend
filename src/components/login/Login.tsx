import "./login.css";
import {useState} from "react";
import {toast} from "sonner";
import {TPages} from "@/lib/types";
import {PasswordInput} from "@/components/PasswordInput";

export default function Login({pageSetter}: { pageSetter: (val: TPages) => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return <section className="w-full h-full flex items-center justify-center px-8">
        <form className="flex flex-col items-center justify-center login-form gap-4 w-full">
            <div className="unit">
                <label htmlFor="email" className="block">Email</label>
                <input type="email" name="email" placeholder="Enter here" className="border-[2px] rounded-lg w-full"
                       value={email} onChange={(e) => setEmail(e.target.value)}
                       required
                />
            </div>
            <div className="unit">
                <label htmlFor="password" className="block">Password</label>
                <PasswordInput password={password} setPassword={setPassword}/>
            </div>
            <button type="submit" className="mt-5 btn-primary px-10" onClick={(e) => {
                e.preventDefault();

                if (!email || !password) {
                    toast.error("Please enter email and password");
                } else {
                    pageSetter("lang");
                }
            }}>
                Login
            </button>

            <p className="text-sm absolute bottom-10">
                 Don&apos;t have an account?
                <button className="text-blue-600 underline ml-1" onClick={(e) => {
                    e.preventDefault();
                    pageSetter("signup");
                }}>Create one.</button>
            </p>
        </form>
    </section>
}