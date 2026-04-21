'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowLeft } from "lucide-react"
import { sileo } from "sileo"

export function LoginForm({
  className,
  ...props
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      const email = formData.get("email");
      const password = formData.get("password");

      const res = await fetch('/api/auth/admin/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });


      const data = await res.json();

      if (res.status == 429) {
        sileo.warning({
          title: "Too many attempts",
          description: data.message,
        });
      } else if (res.ok) {
        sileo.success({
          title: "OTP Sent successfully ",
          description: data.message
        })

        sessionStorage.setItem("loginToken", data.token);

        setTimeout(() => {
          router.push("/issuer/login/otp");
        }, 100);
      } else {
        sileo.error({
          title: data.status,
          description: data.message,
        });
      }

    } catch (err) {
      sileo.error({
        title: "Error",
        description: "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative rounded-none border-none bg-transparent shadow-none ring-0">
        <CardHeader className="rounded-none px-0 pt-0">
          <div className="mb-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors group w-fit"
            >
              <ArrowLeft className="size-3" />
              Back
            </Link>
          </div>
          <CardTitle className="font-body">Issuer Login</CardTitle>
          <CardDescription>
            Enter your credentials below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input name="email" type="email" placeholder="m@example.com" required className="rounded-[5px] border-white/10 focus:border-white/50" />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input name="password" type="password" required className="rounded-[5px] border-white/10 focus:border-white/50" />
              </Field>
              <Field>
                <Button type="submit" className="rounded-[5px] mb-3" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="/issuer/register">Register</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
