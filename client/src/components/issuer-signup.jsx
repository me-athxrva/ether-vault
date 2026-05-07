'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
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
import { ArrowLeft, Lock, ArrowRight } from "lucide-react"

export function SignupForm({
  className,
  ...props
}) {
  return (
    <div className={cn("relative w-full max-w-lg mx-auto min-h-[500px] flex items-center justify-center", className)}>
      {/* Background Content - Blurred and Inactive */}
      <Card className="w-full py-0 relative rounded-none border-none bg-transparent shadow-none ring-0 blur-[8px] pointer-events-none select-none opacity-20 transition-all duration-500" {...props}>
        <CardHeader className="rounded-none px-0 pt-0">
          <div className="mb-4">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <ArrowLeft className="size-3" />
              Back
            </div>
          </div>
          <CardTitle className="font-body">Create an account</CardTitle>
          <CardDescription>
              Register your organisation to start issuing documents
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 bg-transparent">
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel>Organisation</FieldLabel>
                <Input placeholder="Your Organisation Name" disabled className="rounded-[5px] border-white/10" />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" placeholder="m@example.com" disabled className="rounded-[5px] border-white/10" />
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" disabled className="rounded-[5px] border-white/10" />
              </Field>
              <Field>
                <Button className="rounded-[5px] mb-3" disabled>Create Account</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Fixed Overlay for Demo Disclaimer and Accounts */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/10 rounded-[12px] p-6 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border-t-white/20">
          <div className="flex flex-col items-center text-center space-y-4 mb-6">
            <div className="size-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <Lock className="size-5 text-amber-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-amber-500">Registration Restricted</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                Demo mode active. please use test accounts.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold px-1">Demo Credentials</div>
            <div className="rounded-[8px] border border-white/5 bg-white/2 overflow-hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left text-[11px] border-collapse min-w-[400px]">
                  <thead className="bg-white/5 text-[9px] uppercase tracking-widest text-muted-foreground border-b border-white/5">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Role</th>
                      <th className="px-4 py-2.5 font-medium">Account</th>
                      <th className="px-4 py-2.5 font-medium">Secret</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-white/40">EtherVault Global</td>
                      <td className="px-4 py-3 font-mono text-white/80 select-all whitespace-nowrap">demo.admin@ethervault.com</td>
                      <td className="px-4 py-3 font-mono text-white/80 select-all">password123</td>
                    </tr>
                    <tr className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-white/40">Meth Pvt. Ltd.</td>
                      <td className="px-4 py-3 font-mono text-white/80 select-all whitespace-nowrap">demo.admin2@ethervault.com</td>
                      <td className="px-4 py-3 font-mono text-white/80 select-all">password123</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Button asChild className="w-full rounded-[6px] bg-white text-black hover:bg-zinc-200 transition-all font-bold text-[11px] uppercase tracking-widest h-11">
              <Link href="/issuer/login" className="flex items-center justify-center gap-2">
                Continue to Login
                <ArrowRight className="size-3" />
              </Link>
            </Button>
            <Link 
              href="/" 
              className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors py-2"
            >
              <ArrowLeft className="size-2.5" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
