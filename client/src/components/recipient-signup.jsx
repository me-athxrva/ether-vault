'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
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
import { Loader2, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react"
import { sileo } from "sileo"

export function SignupForm({
  className,
  ...props
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [organisations, setOrganisations] = useState([]);
  const [fetchingOrgs, setFetchingOrgs] = useState(true);
  const [step, setStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organisationId: ""
  });

  useEffect(() => {
    async function fetchOrgs() {
      try {
        const res = await fetch("/api/organisation/all");
        const data = await res.json();
        if (data.status === "success") {
          setOrganisations(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch organisations", err);
      } finally {
        setFetchingOrgs(false);
      }
    }
    fetchOrgs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      sileo.error({ title: "Error", description: "Please fill all fields." });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      sileo.error({ title: "Error", description: "Passwords do not match." });
      return;
    }
    if (formData.password.length < 8) {
      sileo.error({ title: "Error", description: "Password must be at least 8 characters." });
      return;
    }
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  async function onSubmit(event) {
    event.preventDefault();
    if (!formData.organisationId) {
      sileo.error({ title: "Error", description: "Please select an organisation." });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          organisationId: formData.organisationId
        }),
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
        <CardHeader className="rounded-none px-0 pt-0 text-left">
          <div className="mb-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors group w-fit"
            >
              <ArrowLeft className="size-3" />
              Back
            </Link>
          </div>
          <CardTitle className="font-body text-xl">
            {step === 1 ? "Create an account" : "Choose Organisation"}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? "Enter your details below to get started" 
              : "Select your organisation to complete registration"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 bg-transparent">
          <form onSubmit={step === 1 ? handleNextStep : onSubmit}>
            <FieldGroup>
              {step === 1 ? (
                <>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input 
                      name="name" 
                      id="name" 
                      type="text" 
                      placeholder="Your Name" 
                      required 
                      value={formData.name}
                      onChange={handleInputChange}
                      className="rounded-[5px] border-white/10 focus:border-white/50 bg-white/5" 
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input 
                      name="email" 
                      id="email" 
                      type="email" 
                      placeholder="m@example.com" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="rounded-[5px] border-white/10 focus:border-white/50 bg-white/5" 
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input 
                      name="password" 
                      id="password" 
                      type="password" 
                      required 
                      value={formData.password}
                      onChange={handleInputChange}
                      className="rounded-[5px] border-white/10 focus:border-white/50 bg-white/5" 
                    />
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <Input 
                      name="confirmPassword" 
                      id="confirmPassword" 
                      type="password" 
                      required 
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="rounded-[5px] border-white/10 focus:border-white/50 bg-white/5" 
                    />
                  </Field>
                  <Field>
                    <Button type="submit" className="rounded-[5px] w-full flex items-center justify-center gap-2">
                      Continue
                      <ChevronRight className="size-4" />
                    </Button>
                    <FieldDescription className="text-center mt-4">
                      Already have an account? <Link href="/recipient/login" className="text-white hover:underline">Sign in</Link>
                    </FieldDescription>
                  </Field>
                </>
              ) : (
                <>
                  <Field>
                    <FieldLabel htmlFor="organisationId">Organisation</FieldLabel>
                    <div className="relative group">
                      <select
                        name="organisationId"
                        id="organisationId"
                        required
                        value={formData.organisationId}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-[5px] border border-white/10 bg-white/5 px-3 py-1 text-sm shadow-sm transition-colors appearance-none focus:border-white/50 text-white outline-none"
                      >
                        <option value="" disabled className="bg-[#0a0a0a]">Select an organisation</option>
                        {organisations.map((org) => (
                          <option key={org._id} value={org._id} className="bg-[#0a0a0a] text-white">
                            {org.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none group-focus-within:text-white transition-colors" />
                    </div>
                    <FieldDescription>
                      Choose the organisation that will verify your documents.
                    </FieldDescription>
                  </Field>
                  <div className="flex flex-col gap-3 mt-4">
                    <Button 
                      type="submit" 
                      className="rounded-[5px] w-full" 
                      disabled={isLoading || fetchingOrgs}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Complete Registration
                    </Button>
                    <button 
                      type="button"
                      onClick={handlePrevStep}
                      className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-white transition-colors text-center"
                    >
                      Go Back to Details
                    </button>
                  </div>
                </>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
