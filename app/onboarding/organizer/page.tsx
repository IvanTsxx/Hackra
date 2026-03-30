"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { CodeText } from "@/shared/components/code-text";

const organizerSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  company: z.string().optional(),
  organizerRole: z.enum(["individual", "company", "community"]),
});

type OrganizerFormData = z.infer<typeof organizerSchema>;

export default function OrganizerOnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrganizerFormData>({
    defaultValues: {
      organizerRole: "individual",
    },
    resolver: zodResolver(organizerSchema),
  });

  const onSubmit = async (data: OrganizerFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("company", data.company || "");
      formData.append("bio", data.bio || "");
      formData.append("organizerRole", data.organizerRole);

      const response = await fetch("/api/onboarding/organizer-details", {
        body: formData,
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to save organizer details");
        return;
      }

      toast.success("Organizer profile saved!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = watch("organizerRole");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="w-full px-4 relative z-10 flex flex-col items-center justify-center max-w-lg">
        <Card className="bg-card/80 backdrop-blur-sm border-border w-full">
          <CardHeader>
            <CardTitle className=" uppercase tracking-wider">
              {">"} ORGANIZER PROFILE
            </CardTitle>
            <CardDescription className=" text-xs">
              <CodeText>Tell us more about yourself</CodeText>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Organizer Role */}
              <FieldGroup>
                <Field>
                  <FieldLabel className="text-xs uppercase tracking-wider ">
                    <CodeText>I organize hackathons as</CodeText>
                  </FieldLabel>
                  <Select
                    value={selectedRole}
                    onValueChange={(v) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const field = register("organizerRole");
                      field.onChange({ target: { value: v } });
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual" className="">
                        Individual — I organize as a person
                      </SelectItem>
                      <SelectItem value="company" className="">
                        Company — I organize for a company
                      </SelectItem>
                      <SelectItem value="community" className="">
                        Community — I organize for a community
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register("organizerRole")}
                    value={selectedRole}
                  />
                </Field>
              </FieldGroup>

              {/* Company (shown for company/organizer) */}
              {(selectedRole === "company" || selectedRole === "community") && (
                <FieldGroup>
                  <Field>
                    <FieldLabel
                      htmlFor="company"
                      className="text-xs uppercase tracking-wider "
                    >
                      <CodeText>company_name</CodeText>
                    </FieldLabel>
                    <Input
                      id="company"
                      placeholder="Acme Inc."
                      {...register("company")}
                      className=" text-sm"
                    />
                    {errors.company && (
                      <FieldDescription className="text-destructive text-xs ">
                        <CodeText>{errors.company.message}</CodeText>
                      </FieldDescription>
                    )}
                  </Field>
                </FieldGroup>
              )}

              {/* Bio */}
              <FieldGroup>
                <Field>
                  <FieldLabel
                    htmlFor="bio"
                    className="text-xs uppercase tracking-wider "
                  >
                    <CodeText>bio</CodeText>
                  </FieldLabel>
                  <Textarea
                    id="bio"
                    placeholder="Tell participants about yourself and your hackathons..."
                    {...register("bio")}
                    className=" text-sm min-h-[120px]"
                  />
                  {errors.bio && (
                    <FieldDescription className="text-destructive text-xs ">
                      <CodeText>{errors.bio.message}</CodeText>
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full gap-2 uppercase tracking-wider text-xs "
                disabled={isLoading}
              >
                {isLoading && <Spinner className="w-4 h-4" />}
                {">"} Save & Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
