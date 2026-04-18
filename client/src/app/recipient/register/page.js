'use client'

import { useRef } from "react";
import { SignupForm } from "@/components/recipient-signup"

export default function RecipientRegister() {
    const refs = {
        glow: useRef(null),
    };

    return (
        <section className="relative z-0 min-h-screen flex items-center justify-center px-6 text-center overflow-hidden">

            <div className="pointer-events-none absolute z-1 inset-0">
                <div ref={refs.glow} className="absolute bottom-0 left-1/2 w-full h-[80vh] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-white/10 blur-[120px] will-change-[transform,opacity]" />
                <div
                    className="absolute inset-0 bg-repeat mix-blend-lighten opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "url('https://framerusercontent.com/images/kelEr6s1qyt801dQcO45jKcaNkk.gif')",
                    }}
                />
            </div>

            <div className="relative z-20 w-full max-w-sm 
                bg-black/40 backdrop-blur-xl 
                border border-white/10 
                rounded-[20px] p-6">
                <SignupForm />
            </div>

        </section>
    );
}