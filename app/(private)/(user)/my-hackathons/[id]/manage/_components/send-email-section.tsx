// oxlint-disable require-await
"use client";

import { useForm } from "@tanstack/react-form";
import { Mail, Send, Users } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CodeText } from "@/shared/components/code-text";

// ─── Schema ───────────────────────────────────────────────────────────────────

const emailSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  targetEmail: z.string(),
});

// ─── Component ────────────────────────────────────────────────────────────────

export function SendEmailSection({ hackathonId }: { hackathonId: string }) {
  const form = useForm({
    defaultValues: {
      message: "",
      subject: "",
      targetEmail: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Email action not implemented yet", {
        hackathonId,
        ...value,
      });
      toast.info("Email sending is coming soon.");
    },
    validators: { onSubmit: emailSchema },
  });

  return (
    <div className="glass border border-border/40 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail size={13} className="text-brand-green" />
          <CodeText as="p">send message</CodeText>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs   border border-brand-purple/40 text-brand-purple bg-brand-purple/5">
          COMING SOON
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Target: all or single */}
        <div className="flex items-center gap-3 p-3 border border-border/40 bg-secondary/10">
          <Users size={12} className="text-muted-foreground shrink-0" />
          <p className="  text-xs text-muted-foreground">
            Leave recipient blank to send to{" "}
            <span className="text-foreground font-medium">
              all participants
            </span>
            , or enter an email to send to a single person.
          </p>
        </div>

        <FieldGroup className="space-y-4">
          {/* Recipient */}
          <form.Field name="targetEmail">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="  text-xs text-muted-foreground tracking-widest"
                  >
                    RECIPIENT EMAIL{" "}
                    <span className="text-muted-foreground/50">(optional)</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="participant@email.com (leave blank for all)"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="  text-xs h-9 rounded-none"
                    disabled
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Subject */}
          <form.Field name="subject">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="  text-xs text-muted-foreground tracking-widest"
                  >
                    SUBJECT
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Important update about the hackathon"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="  text-xs h-9 rounded-none"
                    disabled
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Message */}
          <form.Field name="message">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="  text-xs text-muted-foreground tracking-widest"
                  >
                    MESSAGE
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder="Write your message here..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="  text-xs rounded-none min-h-[120px] resize-none"
                    disabled
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Subscribe selector={(s) => s.isSubmitting}>
            {() => (
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={true}
                className="h-9 px-5 font-pixel text-xs tracking-wider opacity-40 cursor-not-allowed"
              >
                <Send size={12} className="mr-1.5" />
                SEND EMAIL
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </div>
  );
}
