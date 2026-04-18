'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import { ArrowLeft } from "lucide-react"

export function SignupForm({
  ...props
}) {
  return (
    <Card className="py-0 relative rounded-none border-none bg-transparent shadow-none ring-0" {...props}>
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
        <CardTitle className="font-body text-center">Create an account</CardTitle>
      </CardHeader>
      <CardContent className="px-0 bg-transparent">
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" type="text" placeholder="Your Name" required className="rounded-[5px] border-white/10 focus:border-white/50" />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="m@example.com" required className="rounded-[5px] border-white/10 focus:border-white/50" />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required className="rounded-[5px] border-white/10 focus:border-white/50" />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" required className="rounded-[5px] border-white/10 focus:border-white/50" />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" className="rounded-[5px] mb-3">Create Account</Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/recipient/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
