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

export function SignupForm({
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

      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const confirmPassword = formData.get("confirm-password");

      if (password !== confirmPassword) {
        sileo.error({
          title: "Error",
          description: "Passwords do not match.",
        });
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.status == 429) {
        sileo.warning({
          title: "Too many attempts",
          description: data.message,
        });
      } else if (res.ok) {
        sileo.success({
          title: "Account created successfully",
          description: "You can now login to your account.",
        })
        router.replace("/recipient/login");
      } else {
        sileo.error({
          title: data.status || "Registration failed",
          description: data.message || "Please check your details.",
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
      <Card className="py-0 relative rounded-none border-none bg-transparent shadow-none ring-0">
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
          <CardTitle className="font-body">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 bg-transparent">
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input name="name" id="name" type="text" placeholder="Your Name" required className="rounded-[5px] border-white/10 focus:border-white/50" />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input name="email" id="email" type="email" placeholder="m@example.com" required className="rounded-[5px] border-white/10 focus:border-white/50" />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input name="password" id="password" type="password" required className="rounded-[5px] border-white/10 focus:border-white/50" />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input name="confirm-password" id="confirm-password" type="password" required className="rounded-[5px] border-white/10 focus:border-white/50" />
              </Field>
              <Field>
                <Button type="submit" className="rounded-[5px] mb-3" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/recipient/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
