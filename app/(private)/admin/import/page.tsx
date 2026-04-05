// oxlint-disable react/no-children-prop
"use client";

import { useForm } from "@tanstack/react-form";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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

import { importFromLumaAction, previewLumaAction } from "../_actions";

const formSchema = z.object({
  url: z
    .url("Must be a valid URL.")
    .refine(
      (url) => url.includes("luma.com"),
      "URL must be a Luma event (luma.com)."
    ),
});

function LumaPreviewSkeleton() {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="animate-pulse">Loading preview...</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

function LumaPreviewCard({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof previewLumaAction>>["data"]>;
}) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const isLongDesc = data.description.length > 200;
  const displayDesc =
    isLongDesc && !showFullDesc
      ? `${data.description.slice(0, 200)}...`
      : data.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="max-w-xl">
        {data.image && (
          <img
            src={data.image}
            alt={data.title}
            className="w-full object-cover"
            style={{ maxHeight: "200px" }}
          />
        )}
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Start: </span>
              {data.startDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div>
              <span className="font-medium text-foreground">End: </span>
              {data.endDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            {data.location && (
              <div>
                <span className="font-medium text-foreground">Location: </span>
                {data.location}
              </div>
            )}
            {data.organizerName && (
              <div>
                <span className="font-medium text-foreground">Host: </span>
                {data.organizerName}
              </div>
            )}
            {data.participantCount !== undefined && (
              <div>
                <span className="font-medium text-foreground">Going: </span>
                {data.participantCount}
              </div>
            )}
          </div>

          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Description</p>
            <p className="text-muted-foreground">{displayDesc}</p>
            {isLongDesc && (
              <button
                type="button"
                className="mt-1 text-xs text-brand-green underline underline-offset-2 hover:opacity-80"
                onClick={() => setShowFullDesc(!showFullDesc)}
              >
                {showFullDesc ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          <div className="rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            This event will be imported as a{" "}
            <Badge variant="secondary" className="ml-0.5">
              draft
            </Badge>{" "}
            hackathon.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LumaPreviewError({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="max-w-xl border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Preview failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={onRetry} type="button">
            Retry
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

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
            setPreviewData(null);
            setPreviewError(null);
            return "Event imported successfully!";
          }
          throw new Error(result.error ?? "Import failed.");
        },
      });
    },
    validators: { onSubmit: formSchema },
  });

  const [previewData, setPreviewData] = useState<NonNullable<
    Awaited<ReturnType<typeof previewLumaAction>>["data"]
  > | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPreview = useCallback(async (url: string) => {
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewData(null);

    const result = await previewLumaAction(url);
    setPreviewLoading(false);

    if (result.success && result.data) {
      setPreviewData(result.data);
    } else {
      setPreviewError(result.error ?? "Failed to preview event.");
    }
  }, []);

  const handleUrlChange = useCallback(
    (value: string) => {
      setPreviewData(null);
      setPreviewError(null);
      setPreviewLoading(false);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      const isValid = value.includes("luma.com") && URL.canParse(value);
      if (!isValid) return;

      debounceRef.current = setTimeout(() => {
        void fetchPreview(value);
      }, 1000);
    },
    [fetchPreview]
  );

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

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
                        onBlur={() => {
                          field.handleBlur();
                          const isValid =
                            field.state.value.includes("luma.com") &&
                            URL.canParse(field.state.value);
                          if (isValid) {
                            void fetchPreview(field.state.value);
                          }
                        }}
                        onChange={(e) => {
                          const { value } = e.target;
                          field.handleChange(value);
                          handleUrlChange(value);
                        }}
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
                onClick={() => {
                  form.reset();
                  setPreviewData(null);
                  setPreviewError(null);
                  setPreviewLoading(false);
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {previewLoading && <LumaPreviewSkeleton />}
      {previewError && (
        <LumaPreviewError
          error={previewError}
          onRetry={() => {
            const url = form.getFieldValue("url");
            if (url) void fetchPreview(url);
          }}
        />
      )}
      {previewData && <LumaPreviewCard data={previewData} />}

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            1. Paste a Luma event URL (e.g.{" "}
            <Badge variant="outline">https://luma.com/st2g1u2</Badge>)
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
