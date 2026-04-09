// oxlint-disable react/no-children-prop
"use client";

import { useForm } from "@tanstack/react-form";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

import { TagBadge } from "@/components/tag-badge";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/data/profile-actions";

const AVAILABLE_TECHS = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Python",
  "Rust",
  "Go",
  "Solidity",
  "PostgreSQL",
  "Supabase",
  "Docker",
  "Vercel",
  "GraphQL",
  "WebAssembly",
  "Three.js",
  "Vue",
  "Svelte",
  "Bun",
];

const formSchema = z.object({
  bio: z.string().max(500, "Bio must be 500 characters or less.").optional(),
  githubUsername: z.string().max(39).optional(),
  location: z.string().max(100).optional(),
  name: z.string().min(1, "Name is required."),
  position: z.string().max(100).optional(),
  techStack: z.array(z.string()),
});

type ProfileFormValues = z.infer<typeof formSchema>;

const inputClass =
  "w-full border border-border/40 bg-secondary/20 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-brand-green/40 transition-colors";

interface ProfileFormProps {
  initialData: ProfileFormValues;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [saved, setSaved] = useState(false);

  const form = useForm({
    defaultValues: initialData,
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.set("name", value.name);
      if (value.bio) formData.set("bio", value.bio);
      if (value.location) formData.set("location", value.location);
      if (value.position) formData.set("position", value.position);
      if (value.githubUsername)
        formData.set("githubUsername", value.githubUsername);
      for (const tech of value.techStack) {
        formData.append("techStack", tech);
      }

      const result = await updateProfile(formData);

      if (result.success) {
        setSaved(true);
        toast.success("Profile updated successfully");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(result.message);
      }
    },
    validators: { onSubmit: formSchema },
  });

  const toggleTech = (tech: string) => {
    const current = form.getFieldValue("techStack");
    const updated = current.includes(tech)
      ? current.filter((t) => t !== tech)
      : [...current, tech];
    form.setFieldValue("techStack", updated);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Display name + position */}
      <div className="grid sm:grid-cols-2 gap-4">
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="font-mono text-xs text-muted-foreground tracking-widest"
                >
                  DISPLAY NAME
                </label>
                <input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`${inputClass} ${isInvalid ? "border-red-500/50" : ""}`}
                  aria-invalid={isInvalid}
                />
                {isInvalid && (
                  <span className="text-xs text-red-500 font-mono">
                    {field.state.meta.errors.join(", ")}
                  </span>
                )}
              </div>
            );
          }}
        />
        <form.Field
          name="position"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="font-mono text-xs text-muted-foreground tracking-widest"
                >
                  ROLE / TITLE
                </label>
                <input
                  id={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Full-stack Developer"
                  className={`${inputClass} ${isInvalid ? "border-red-500/50" : ""}`}
                  aria-invalid={isInvalid}
                />
                {isInvalid && (
                  <span className="text-xs text-red-500 font-mono">
                    {field.state.meta.errors.join(", ")}
                  </span>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Bio */}
      <form.Field
        name="bio"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <div className="space-y-1">
              <label
                htmlFor={field.name}
                className="font-mono text-xs text-muted-foreground tracking-widest"
              >
                BIO
              </label>
              <textarea
                id={field.name}
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={3}
                className={`${inputClass} resize-none ${isInvalid ? "border-red-500/50" : ""}`}
                aria-invalid={isInvalid}
              />
              {isInvalid && (
                <span className="text-xs text-red-500 font-mono">
                  {field.state.meta.errors.join(", ")}
                </span>
              )}
            </div>
          );
        }}
      />

      {/* Location + GitHub */}
      <div className="grid sm:grid-cols-2 gap-4">
        <form.Field
          name="location"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="font-mono text-xs text-muted-foreground tracking-widest"
                >
                  LOCATION
                </label>
                <input
                  id={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="San Francisco, CA"
                  className={`${inputClass} ${isInvalid ? "border-red-500/50" : ""}`}
                  aria-invalid={isInvalid}
                />
                {isInvalid && (
                  <span className="text-xs text-red-500 font-mono">
                    {field.state.meta.errors.join(", ")}
                  </span>
                )}
              </div>
            );
          }}
        />
        <form.Field
          name="githubUsername"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="space-y-1">
                <label
                  htmlFor={field.name}
                  className="font-mono text-xs text-muted-foreground tracking-widest"
                >
                  GITHUB USERNAME
                </label>
                <div
                  className={`flex items-center border bg-secondary/20 focus-within:border-brand-green/40 transition-colors ${
                    isInvalid ? "border-red-500/50" : "border-border/40"
                  }`}
                >
                  <span className="px-2 font-mono text-xs text-muted-foreground/60 select-none border-r border-border/30">
                    github.com/
                  </span>
                  <input
                    id={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="username"
                    className="flex-1 px-2 py-2 font-mono text-xs text-foreground bg-transparent outline-none placeholder:text-muted-foreground/40"
                    aria-invalid={isInvalid}
                  />
                </div>
                {isInvalid && (
                  <span className="text-xs text-red-500 font-mono">
                    {field.state.meta.errors.join(", ")}
                  </span>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Tech stack */}
      <form.Field
        name="techStack"
        children={(field) => {
          const techs = field.state.value;
          return (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground tracking-widest">
                  TECH STACK
                </span>
                <span className="font-mono text-xs text-muted-foreground/50">
                  {techs.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TECHS.map((tech, i) => (
                  <Button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    variant="ghost"
                    className="p-0"
                  >
                    <TagBadge
                      index={i}
                      className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                        techs.includes(tech)
                          ? "border-foreground/60 text-foreground bg-foreground/5"
                          : "border-border/40 text-muted-foreground hover:border-border/70"
                      }`}
                      label={tech}
                    />
                  </Button>
                ))}
              </div>
              {techs.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {techs.map((tech, i) => (
                    <TagBadge
                      key={tech}
                      label={tech}
                      variant="tech"
                      index={i}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />

      {/* Divider + Save */}
      <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-4">
        <span
          className={`font-mono text-xs transition-all duration-300 ${saved ? "text-brand-green opacity-100" : "opacity-0"}`}
        >
          {"// SAVED."}
        </span>
        <Button
          type="submit"
          className="font-pixel text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-6"
        >
          <Save size={11} className="mr-2" />
          SAVE CHANGES
        </Button>
      </div>
    </form>
  );
}
