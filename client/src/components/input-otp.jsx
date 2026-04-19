import { RefreshCwIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldLabel,
} from "@/components/ui/field"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");

    async function onVerify(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem("loginToken");

            if (!otp || otp.length < 6) {
                throw new Error("Enter valid OTP");
            }

            const res = await fetch("http://localhost:3001/api/auth/admin/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ token, otp }),
            });

            const data = await res.json();
            alert(data.message);

            if (res.ok) {
                sessionStorage.removeItem("loginToken");
                router.replace("/issuer/dashboard");
            } else {
                alert(data.message || "Invalid OTP");
            }

        } catch (err) {
            console.log(err.message);
            sessionStorage.removeItem("loginToken");
            router.replace("/issuer/login");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="rounded-none border-none bg-transparent shadow-none ring-0 mx-auto max-w-md overflow-hidden">
            <form onSubmit={onVerify}>
                <CardHeader className="rounded-none px-0 pt-0">
                    <CardTitle className="font-body">Verify your login</CardTitle>
                    <CardDescription>
                        Enter the verification code we sent to your email
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <Field>
                        <div className="flex items-center justify-between mb-2">
                            <FieldLabel htmlFor="otp-verification">
                                Verification code
                            </FieldLabel>
                            <Button variant="outline" type="button" size="xs" className="rounded-[5px] border-white/10 hover:bg-white/5" disabled={isLoading}>
                                <RefreshCwIcon className="size-3" />
                                Resend Code
                            </Button>
                        </div>
                        <div className="flex justify-center">
                            <InputOTP disabled={isLoading} value={otp} onChange={(value) => setOtp(value)} name="otp" maxLength={6} id="otp-verification" required>
                                <InputOTPGroup className="rounded-[5px] border-white/10 overflow-hidden *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl *:data-[slot=input-otp-slot]:bg-transparent *:data-[slot=input-otp-slot]:border-white/10">
                                    <InputOTPSlot index={0} className="first:rounded-l-[5px]" />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} className="last:rounded-r-[5px]" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    </Field>
                </CardContent>
                <CardFooter className="px-0 pb-0 mt-6">
                    <Field className="w-full">
                        <Button type="submit" className="w-full rounded-[5px] mb-4" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify
                        </Button>
                        <div className="text-[10px] uppercase tracking-widest text-[#696969] text-center">
                            Having trouble signing in?{" "}
                            <a
                                href="#"
                                className="text-[#8a8a8a] hover:text-white transition-colors"
                            >
                                Contact support
                            </a>
                        </div>
                    </Field>
                </CardFooter>
            </form>
        </Card>
    )
}
