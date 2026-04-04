// oxlint-disable react/no-children-prop
"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { toast } from "sonner";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { importFromLumaAction } from "../_actions";

const formSchema = z.object({
  url: z
    .url("Must be a valid URL.")
    .refine(
      (url) => url.includes("luma.com"),
      "URL must be a Luma event (luma.com)."
    ),
});

export default function AdminImportPage() {
  const form = useForm({
    defaultValues: { url: "" },
    // oxlint-disable-next-line require-await
    onSubmit: async ({ value }) => {
      const promise = importFromLumaAction(value.url);

      toast.promise(promise, {
        error: (err: unknown) =>
          err instanceof Error ? err.message : "Import failed.",
        loading: "Importing event from Luma...",
        success: (result: { success: boolean; error?: string }) => {
          if (result.success) {
            form.reset();
            return "Event imported successfully!";
          }
          throw new Error(result.error ?? "Import failed.");
        },
      });
    },
    validators: { onSubmit: formSchema },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Import from Luma</h1>
        <p className="text-muted-foreground">
          Paste a Luma event URL to import it as a draft hackathon.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Luma Event URL</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <FieldGroup>
              <form.Field
                name="url"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Event URL</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        placeholder="https://luma.com/st2g1u2"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        The full URL of the Luma event page.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            <div className="flex gap-2">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Importing..." : "Import from Luma"}
                  </Button>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            1. Paste a Luma event URL (e.g.{" "}
            <Badge variant="outline">https://lu.ma/my-event</Badge>)
          </p>
          <p>
            2. The event is scraped and created as a{" "}
            <Badge variant="secondary">draft</Badge> hackathon.
          </p>
          <p>
            3. Review and publish it from the{" "}
            <Link
              href="/admin/hackathons"
              className="text-foreground underline"
            >
              Hackathons
            </Link>{" "}
            page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
