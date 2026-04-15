// oxlint-disable react/no-children-prop
"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { format } from "date-fns";
import {
  Plus,
  X,
  Upload,
  Eye,
  Code,
  CalendarIcon,
  Loader2,
  Link2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TagBadge } from "@/components/tag-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Tech } from "@/lib/mock-data";
import { CodeText } from "@/shared/components/code-text";
import { LocationAutocomplete } from "@/shared/components/location-autocomplete";
import { Calendar } from "@/shared/components/ui/calendar";
import { FieldError, FieldLabel } from "@/shared/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import type { SimilarHackathon } from "@/shared/lib/similarity";

import {
  checkDuplicateHackathonAction,
  createHackathonAction,
  importLumaFormDataAction,
  previewLumaAction,
} from "../_actions";

const AVAILABLE_TAGS = [
  "Frontend",
  "Backend",
  "AI",
  "Web3",
  "Mobile",
  "DevTools",
  "Design Systems",
  "Open Source",
  "Game Dev",
  "Climate",
  "Health",
];
const AVAILABLE_TECHS: Tech[] = [
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
];

const STEPS = ["BASICS", "DETAILS", "PRIZES", "PREVIEW"];

type LocationMode = "remote" | "in_person" | "hybrid";

interface PrizeEntry {
  place: string;
  amount: string;
  description: string;
}

const LOCATION_OPTIONS: { value: LocationMode; label: string; desc: string }[] =
  [
    { desc: "Online only", label: "REMOTE", value: "remote" },
    { desc: "Physical venue", label: "IN_PERSON", value: "in_person" },
    { desc: "Both options", label: "HYBRID", value: "hybrid" },
  ];

const inputClass =
  "w-full border border-border/40 bg-secondary/20 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-brand-green/40 transition-colors";

interface CreateHackathonFormProps {
  username: string;
}

export function CreateHackathonForm({ username }: CreateHackathonFormProps) {
  const [step, setStep] = useState(0);
  const [previewMode, setPreviewMode] = useState<"form" | "preview">("form");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Duplicate check state
  const [duplicateCheck, setDuplicateCheck] = useState<{
    isChecking: boolean;
    isDuplicate: boolean;
    similarHackathons: SimilarHackathon[];
  }>({ isChecking: false, isDuplicate: false, similarHackathons: [] });

  // Luma import state
  const [lumaUrl, setLumaUrl] = useState("");
  const [lumaPreviewData, setLumaPreviewData] = useState<
    Awaited<ReturnType<typeof previewLumaAction>>["data"] | undefined
  >();
  const [lumaPreviewError, setLumaPreviewError] = useState<string | null>(null);
  const [lumaLoading, setLumaLoading] = useState(false);
  const [lumaImported, setLumaImported] = useState(false);
  const [importedImageUrl, setImportedImageUrl] = useState<
    string | undefined
  >();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm({
    defaultValues: {
      description:
        "## Overview\n\nDescribe your hackathon here...\n\n## What to Build\n\n- Build something amazing\nUse the provided tech stack\n\n## Judging Criteria\n\n- Innovation\n- Technical Execution\n- Design & UX",
      endDate: undefined as Date | undefined,
      externalId: undefined as string | undefined,
      externalUrl: undefined as string | undefined,
      isPublished: true,
      latitude: null as number | null,
      location: "",
      locationMode: "in_person" as LocationMode,
      longitude: null as number | null,
      maxParticipants: 500,
      maxTeamSize: 4,
      prizes: [] as PrizeEntry[],
      requiresApproval: false,
      source: "manual",
      startDate: undefined as Date | undefined,
      tags: [] as string[],
      techs: [] as string[],
      title: "",
    },
    onSubmit: async ({ value }) => {
      const result = await createHackathonAction({
        description: value.description,
        endDate: value.endDate,
        externalId: value.externalId,
        externalUrl: value.externalUrl,
        image: importedImageUrl,
        isPublished: value.isPublished,
        latitude: value.latitude,
        location: value.location,
        locationMode: value.locationMode,
        longitude: value.longitude,
        maxParticipants: value.maxParticipants,
        maxTeamSize: value.maxTeamSize,
        requiresApproval: value.requiresApproval,
        source: value.source,
        startDate: value.startDate,
        tags: value.tags,
        techs: value.techs,
        title: value.title,
      });

      if (result.success) {
        if (value.isPublished) {
          toast.success("Hackathon publicado con éxito!", {
            description: "El hackathon ahora es visible públicamente.",
          });
        } else {
          toast.success("Hackathon guardado como borrador", {
            description: "Puedes publicarlo más tarde desde el panel de admin.",
          });
        }
        setSubmitted(true);
      } else if (
        result.similarHackathons &&
        result.similarHackathons.length > 0
      ) {
        // Show specific duplicate warning with hackathons list
        toast.error("Hackathon duplicado", {
          description: result.error ?? "Ya existe un hackathon similar.",
        });
      } else {
        toast.error("Deploy failed", { description: result.error });
      }
    },
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // REACTIVE SUBSCRIPTIONS — MUST come right after form, before any logic
  // ═══════════════════════════════════════════════════════════════════════════
  const isPublished = useStore(form.store, (state) => state.values.isPublished);
  const latitude = useStore(form.store, (state) => state.values.latitude);
  const locationMode = useStore(
    form.store,
    (state) => state.values.locationMode
  );
  const longitude = useStore(form.store, (state) => state.values.longitude);
  const title = useStore(form.store, (state) => state.values.title);
  const description = useStore(form.store, (state) => state.values.description);
  const startDate = useStore(form.store, (state) => state.values.startDate);
  const endDate = useStore(form.store, (state) => state.values.endDate);
  const location = useStore(form.store, (state) => state.values.location);
  const tags = useStore(form.store, (state) => state.values.tags);
  const techs = useStore(form.store, (state) => state.values.techs);
  const maxParticipants = useStore(
    form.store,
    (state) => state.values.maxParticipants
  );
  const maxTeamSize = useStore(form.store, (state) => state.values.maxTeamSize);
  const prizes = useStore(form.store, (state) => state.values.prizes);

  // Merge Luma-imported tags/techs with available options
  const allAvailableTags = useMemo(
    () => [...new Set([...AVAILABLE_TAGS, ...tags])],
    [tags]
  );
  const allAvailableTechs = useMemo(
    () => [...new Set([...AVAILABLE_TECHS, ...techs])],
    [techs]
  );

  // Step validation helpers
  const canGoToDetails = !!title?.trim() && !!startDate && !!endDate;
  const canGoToPrizes = tags.length > 0 && techs.length > 0;

  const toggleTag = (t: string) => {
    const current = form.getFieldValue("tags");
    const updated = current.includes(t)
      ? current.filter((tag) => tag !== t)
      : [...current, t];
    form.setFieldValue("tags", updated);
  };

  const toggleTech = (t: string) => {
    const current = form.getFieldValue("techs");
    const updated = current.includes(t)
      ? current.filter((tech) => tech !== t)
      : [...current, t];
    form.setFieldValue("techs", updated);
  };

  const addPrize = () => {
    const current = form.getFieldValue("prizes");
    form.setFieldValue("prizes", [
      ...current,
      { amount: "", description: "", place: `${current.length + 1}th` },
    ]);
  };

  const removePrize = (i: number) => {
    const current = form.getFieldValue("prizes");
    form.setFieldValue(
      "prizes",
      current.filter((_, idx) => idx !== i)
    );
  };

  const fetchPreview = useCallback(async (url: string) => {
    setLumaLoading(true);
    setLumaPreviewError(null);
    setLumaPreviewData(undefined);

    const result = await previewLumaAction(url);
    setLumaLoading(false);

    if (result.success && result.data) {
      setLumaPreviewData(result.data);
    } else {
      setLumaPreviewError(result.error ?? "Failed to preview event.");
    }
  }, []);

  const handleLumaUrlChange = useCallback(
    (value: string) => {
      setLumaPreviewData(undefined);
      setLumaPreviewError(null);
      setLumaLoading(false);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      const isValid = value.includes("luma.com") && URL.canParse(value);
      if (!isValid) return;

      debounceRef.current = setTimeout(() => {
        void fetchPreview(value);
      }, 1000);
    },
    [fetchPreview]
  );

  const handleImportFromLuma = useCallback(async () => {
    if (!lumaUrl) return;

    // Use cached preview data if available — no second server call needed
    if (lumaPreviewData) {
      const d = lumaPreviewData;
      form.setFieldValue("title", d.title);
      form.setFieldValue("description", d.description);
      if (d.startDate) form.setFieldValue("startDate", d.startDate);
      if (d.endDate) form.setFieldValue("endDate", d.endDate);
      if (d.location) form.setFieldValue("location", d.location);
      form.setFieldValue("locationMode", d.locationMode ?? "in_person");
      if (d.latitude !== undefined) form.setFieldValue("latitude", d.latitude);
      if (d.longitude !== undefined)
        form.setFieldValue("longitude", d.longitude);
      if (d.isFull) {
        form.setFieldValue("requiresApproval", true);
        toast.info("Event is full - registrations will require approval");
      }
      if (d.image) setImportedImageUrl(d.image);

      if (d.externalId) form.setFieldValue("externalId", d.externalId);
      if (d.externalUrl) form.setFieldValue("externalUrl", d.externalUrl);
      form.setFieldValue("source", "luma");

      if (d.tags && d.tags.length > 0) {
        const current = form.getFieldValue("tags");
        form.setFieldValue("tags", [...new Set([...current, ...d.tags])]);
      }

      if (d.techs && d.techs.length > 0) {
        const current = form.getFieldValue("techs");
        form.setFieldValue("techs", [...new Set([...current, ...d.techs])]);
      }

      if (d.prizes && d.prizes.length > 0) {
        form.setFieldValue(
          "prizes",
          d.prizes.map((p, i) => ({
            amount: p.amount,
            description: p.description,
            place:
              i === 0
                ? "1st"
                : i === 1
                  ? "2nd"
                  : i === 2
                    ? "3rd"
                    : `${i + 1}th`,
          }))
        );
        toast.info(`Found ${d.prizes.length} prize(s) in description!`);
      }

      const missingFields: string[] = [];
      if (!d.startDate) missingFields.push("startDate");
      if (!d.endDate) missingFields.push("endDate");
      if (!d.location) missingFields.push("location");

      if (missingFields.length > 0) {
        toast.success("Imported from Luma!", {
          description: `Please fill in: ${missingFields.join(", ")}`,
        });
      } else {
        toast.success("Imported from Luma!", {
          description: "All fields have been auto-filled.",
        });
      }
      setLumaImported(true);
      return;
    }

    // Fallback: no preview data available — call server
    setLumaLoading(true);
    const result = await importLumaFormDataAction(lumaUrl);
    setLumaLoading(false);

    if (result.success && result.data) {
      const d = result.data;
      form.setFieldValue("title", d.title);
      form.setFieldValue("description", d.description);
      if (d.startDate) form.setFieldValue("startDate", d.startDate);
      if (d.endDate) form.setFieldValue("endDate", d.endDate);
      if (d.location) form.setFieldValue("location", d.location);
      form.setFieldValue("locationMode", d.locationMode);
      if (d.latitude !== undefined) form.setFieldValue("latitude", d.latitude);
      if (d.longitude !== undefined)
        form.setFieldValue("longitude", d.longitude);
      if (d.requiresApproval) {
        form.setFieldValue("requiresApproval", true);
        toast.info("Event is full - registrations will require approval");
      }
      if (d.image) setImportedImageUrl(d.image);

      if (d.externalId) form.setFieldValue("externalId", d.externalId);
      if (d.externalUrl) form.setFieldValue("externalUrl", d.externalUrl);
      form.setFieldValue("source", "luma");

      if (d.tags && d.tags.length > 0) {
        const current = form.getFieldValue("tags");
        form.setFieldValue("tags", [...new Set([...current, ...d.tags])]);
      }

      if (d.techs && d.techs.length > 0) {
        const current = form.getFieldValue("techs");
        form.setFieldValue("techs", [...new Set([...current, ...d.techs])]);
      }

      if (d.prizes && d.prizes.length > 0) {
        form.setFieldValue(
          "prizes",
          d.prizes.map((p, i) => ({
            amount: p.amount,
            description: p.description,
            place:
              i === 0
                ? "1st"
                : i === 1
                  ? "2nd"
                  : i === 2
                    ? "3rd"
                    : `${i + 1}th`,
          }))
        );
        toast.info(`Found ${d.prizes.length} prize(s) in description!`);
      }

      if (result.missingFields && result.missingFields.length > 0) {
        toast.success("Imported from Luma!", {
          description: `Please fill in: ${result.missingFields.join(", ")}`,
        });
      } else {
        toast.success("Imported from Luma!", {
          description: "All fields have been auto-filled.",
        });
      }
      setLumaImported(true);
    } else {
      toast.error("Import failed", {
        description: result.error ?? "Could not import event data.",
      });
    }
  }, [lumaUrl, lumaPreviewData, form]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  // Clear lat/lng when switching to remote mode
  useEffect(() => {
    if (locationMode === "remote") {
      form.setFieldValue("latitude", null);
      form.setFieldValue("longitude", null);
    }
  }, [locationMode, form]);

  // Debounced duplicate check effect
  useEffect(() => {
    if (!title?.trim() || !description?.trim()) return;

    const timeout = setTimeout(async () => {
      setDuplicateCheck((prev) => ({ ...prev, isChecking: true }));
      try {
        const result = await checkDuplicateHackathonAction({
          description,
          title,
        });
        setDuplicateCheck({
          isChecking: false,
          isDuplicate: result.isDuplicate,
          similarHackathons: result.similarHackathons,
        });
      } catch {
        // Gracefully handle errors - allow creation if check fails
        setDuplicateCheck((prev) => ({ ...prev, isChecking: false }));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [title, description]);

  const handleReset = () => {
    form.reset();
    setStep(0);
    setDuplicateCheck({
      isChecking: false,
      isDuplicate: false,
      similarHackathons: [],
    });
    setLumaUrl("");
    setLumaPreviewData(undefined);
    setLumaPreviewError(null);
    setLumaLoading(false);
    setLumaImported(false);
    setImportedImageUrl(undefined);
  };

  const handleSubmit = async () => {
    // Use getFieldValue in event handlers — NOT useStore (breaks Rules of Hooks)
    const startDate = form.getFieldValue("startDate");
    const endDate = form.getFieldValue("endDate");
    const title = form.getFieldValue("title");

    if (!startDate || !endDate) {
      toast.error("Missing dates", {
        description: "Please select both start and end dates.",
      });
      return;
    }

    if (!title.trim()) {
      toast.error("Missing title", {
        description: "Please provide a hackathon title.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await form.handleSubmit();
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      handleReset();
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  if (submitted) {
    return (
      <section className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 p-12 border border-brand-green/30 bg-brand-green/5"
        >
          <p className=" text-3xl text-brand-green">DEPLOYED.</p>
          <p className="text-xs text-muted-foreground">
            Your hackathon has been created successfully.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Link
              href="/explore"
              className=" text-xs border border-border/50 px-4 py-2 hover:border-brand-green/50 hover:text-brand-green transition-all"
            >
              VIEW ALL
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className=" text-xs bg-foreground text-background px-4 py-2 hover:opacity-90"
            >
              CREATE ANOTHER
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  const handleNextStep = () => {
    // Validate current step before advancing
    if (step === 0 && !canGoToDetails) {
      toast.error("Missing required fields", {
        description: "Please fill in title and dates.",
      });
      return;
    }
    if (step === 1 && !canGoToPrizes) {
      toast.error("Missing tags or techs", {
        description: "Please select at least one tag and one technology.",
      });
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  return (
    <section>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 mt-4">
        <Link href={`/user/${username}`} className="hover:text-foreground">
          {username.toUpperCase()}
        </Link>
      </div>

      <AnimatedSection>
        <div className="space-y-1 mb-7">
          <CodeText as="p">navigation</CodeText>
          <h1 className=" text-2xl text-foreground">CREATE</h1>
        </div>
      </AnimatedSection>

      {/* Publicar switch - siempre visible, antes del stepper */}
      <div className="flex items-center justify-between p-4 border border-border/40 bg-brand-green/5 mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${
              isPublished
                ? "bg-brand-green animate-pulse"
                : "bg-muted-foreground"
            }`}
          />
          <div>
            <p className="text-xs text-foreground tracking-wide">
              {isPublished ? "PUBLICAR INMEDIATAMENTE" : "ESTADO: BORRADOR"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPublished
                ? "El hackathon será visible públicamente"
                : "Guardar como borrador"}
            </p>
          </div>
        </div>
        <Switch
          checked={isPublished}
          onCheckedChange={(checked) =>
            form.setFieldValue("isPublished", checked)
          }
        />
      </div>

      <div className="flex justify-end">
        <Button variant="destructive" type="button" onClick={handleReset}>
          <X className="size-5" />
          LIMPIAR
        </Button>
      </div>

      {/* Step tabs */}
      <div className="flex border-b border-border/40 mb-8 overflow-x-auto">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(i)}
            className={` text-xs tracking-wider px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
              step === i
                ? "border-brand-green text-brand-green"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {i < step ? "✓ " : `${i + 1}. `}
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* ─── STEP 0 — BASICS ─────────────────────────────────────────────── */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            {/* ─── LUMA IMPORT ─────────────────────────────────────────────── */}
            <div className="space-y-3 border border-brand-green/30 bg-brand-green/5 p-4">
              <div className="flex items-center gap-2">
                <Link2 size={12} className="text-brand-green" />
                <label className="text-xs text-brand-green tracking-widest">
                  IMPORT FROM LUMA
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lumaUrl}
                  onChange={(e) => {
                    setLumaUrl(e.target.value);
                    handleLumaUrlChange(e.target.value);
                  }}
                  onBlur={() => {
                    const isValid =
                      lumaUrl.includes("luma.com") && URL.canParse(lumaUrl);
                    if (isValid) void fetchPreview(lumaUrl);
                  }}
                  placeholder="https://lu.ma/event-name"
                  className={inputClass}
                  disabled={lumaImported}
                />
                {lumaImported ? (
                  <div className="flex items-center gap-1 text-brand-green text-xs shrink-0">
                    <CheckCircle2 size={14} />
                    Imported
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleImportFromLuma}
                    disabled={!lumaPreviewData || lumaLoading}
                    className=" text-xs bg-brand-green/20 text-brand-green border border-brand-green/40 px-3 hover:bg-brand-green/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                  >
                    {lumaLoading ? "..." : "IMPORT"}
                  </button>
                )}
              </div>

              {lumaLoading && !lumaPreviewData && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 size={12} className="animate-spin" />
                  Fetching event data...
                </div>
              )}

              {lumaPreviewError && (
                <div className="flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle size={12} />
                  {lumaPreviewError}
                </div>
              )}

              {lumaPreviewData && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 border border-border/30 bg-secondary/10 p-3"
                >
                  {lumaPreviewData.image && (
                    <Image
                      src={lumaPreviewData.image}
                      alt={lumaPreviewData.title}
                      width={600}
                      height={340}
                      quality={75}
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="w-full h-full aspect-video object-cover"
                    />
                  )}
                  <p className="text-xs text-foreground">
                    {lumaPreviewData.title}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="text-foreground">Start:</span>{" "}
                      {lumaPreviewData.startDate
                        ? lumaPreviewData.startDate.toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Not available"}
                    </div>
                    <div>
                      <span className="text-foreground">End:</span>{" "}
                      {lumaPreviewData.endDate
                        ? lumaPreviewData.endDate.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not available"}
                    </div>
                    {lumaPreviewData.location && (
                      <div>
                        <span className="text-foreground">Location:</span>{" "}
                        {lumaPreviewData.location}
                      </div>
                    )}
                    {lumaPreviewData.participantCount !== undefined && (
                      <div>
                        <span className="text-foreground">Going:</span>{" "}
                        {lumaPreviewData.participantCount}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-brand-green/70">
                    Click IMPORT to auto-fill all fields
                  </p>
                </motion.div>
              )}
            </div>

            {/* Duplicate Warning Panel */}
            {duplicateCheck.isDuplicate && (
              <div className="border border-red-500/50 bg-red-500/5 p-4 space-y-2">
                <p className=" text-xs text-red-400 tracking-wider">
                  HACKATHON DUPLICADO
                </p>
                <p className="text-xs text-muted-foreground">
                  Ya existe un hackathon con un título o descripción similares:
                </p>
                <ul className="space-y-2">
                  {duplicateCheck.similarHackathons.map((h) => (
                    <li key={h.id} className="text-xs">
                      <Link
                        href={`/hackathon/${h.slug}`}
                        className="text-foreground hover:text-brand-green transition-colors"
                      >
                        {h.title}
                      </Link>
                      {h.titleMatch && (
                        <span className="ml-2 text-red-400  text-[10px]">
                          MISMO TÍTULO
                        </span>
                      )}
                      {!h.titleMatch && (
                        <span className="ml-2 text-yellow-400 text-[10px]">
                          {Math.round(h.descriptionScore * 100)}% similar
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="space-y-1">
                    <FieldLabel htmlFor={field.name}>TITLE *</FieldLabel>
                    <input
                      id={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="My Awesome Hackathon"
                      className={inputClass}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </div>
                );
              }}
            />

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground tracking-widest">
                COVER IMAGE
              </label>
              {importedImageUrl ? (
                <div className="relative border border-border/40 overflow-hidden">
                  <Image
                    src={importedImageUrl}
                    alt="Cover"
                    width={600}
                    height={160}
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="w-full h-40 object-cover"
                  />
                  <span className="absolute top-2 right-2 text-xs bg-brand-green/80 text-background px-2 py-0.5">
                    FROM LUMA
                  </span>
                </div>
              ) : (
                <div className="border border-dashed border-border/40 p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-border/70 transition-colors">
                  <Upload size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    DROP IMAGE OR CLICK TO UPLOAD
                  </span>
                </div>
              )}
            </div>

            {/* Date pickers */}
            <div className="grid sm:grid-cols-2 gap-4">
              <form.Field
                name="startDate"
                children={(field) => (
                  <div className="space-y-1">
                    <FieldLabel>START DATE *</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <button
                            type="button"
                            className={`w-full flex items-center gap-2 border border-border/40 bg-secondary/20 px-3 py-2 text-xs text-left transition-colors ${
                              field.state.value
                                ? "text-foreground"
                                : "text-muted-foreground/50"
                            } hover:border-brand-green/40 focus:border-brand-green/40 outline-none`}
                          />
                        }
                      >
                        <CalendarIcon
                          size={11}
                          className="text-muted-foreground shrink-0"
                        />
                        {field.state.value
                          ? format(field.state.value, "MMM d, yyyy")
                          : "Pick start date"}
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 rounded-none border-border/50"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={(date) => field.handleChange(date)}
                          disabled={(d) => d < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              />
              <form.Field
                name="endDate"
                children={(field) => (
                  <div className="space-y-1">
                    <FieldLabel>END DATE *</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <button
                            type="button"
                            className={`w-full flex items-center gap-2 border border-border/40 bg-secondary/20 px-3 py-2 text-xs text-left transition-colors ${
                              field.state.value
                                ? "text-foreground"
                                : "text-muted-foreground/50"
                            } hover:border-brand-green/40 focus:border-brand-green/40 outline-none`}
                          />
                        }
                      >
                        <CalendarIcon
                          size={11}
                          className="text-muted-foreground shrink-0"
                        />
                        {field.state.value
                          ? format(field.state.value, "MMM d, yyyy")
                          : "Pick end date"}
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 rounded-none border-border/50"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={(date) => field.handleChange(date)}
                          disabled={(d) =>
                            d < (field.state.value ?? new Date())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              />
            </div>

            {/* Date range display */}
            {startDate && endDate && (
              <div className="flex items-center gap-2 text-xs text-brand-green/70 border border-brand-green/20 bg-brand-green/5 px-3 py-2">
                <CalendarIcon size={10} />
                <span>
                  {format(startDate, "MMM d, yyyy")} →{" "}
                  {format(endDate, "MMM d, yyyy")} ·{" "}
                  {Math.ceil(
                    (endDate.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </span>
              </div>
            )}

            {/* Location mode — 3-way segmented control */}
            <div className="space-y-3">
              <label className="text-xs text-muted-foreground tracking-widest">
                PARTICIPATION MODE *
              </label>
              <div className="grid grid-cols-3 gap-0 border border-border/40 overflow-hidden">
                {LOCATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      form.setFieldValue("locationMode", opt.value)
                    }
                    className={`py-3 px-2 flex flex-col items-center gap-1 transition-all border-r border-border/30 last:border-r-0 ${
                      locationMode === opt.value
                        ? "bg-brand-green/10 text-brand-green"
                        : "bg-secondary/5 text-muted-foreground hover:text-foreground hover:bg-secondary/10"
                    }`}
                  >
                    <span className=" text-xs tracking-wider">{opt.label}</span>
                    <span className="text-xs opacity-70">{opt.desc}</span>
                  </button>
                ))}
              </div>

              {(locationMode === "in_person" || locationMode === "hybrid") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="space-y-1"
                >
                  <form.Field
                    name="location"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <>
                          <FieldLabel htmlFor={field.name}>
                            VENUE LOCATION{" "}
                            {locationMode === "hybrid" && "(physical venue)"}
                          </FieldLabel>
                          <LocationAutocomplete
                            value={field.state.value}
                            latitude={latitude}
                            longitude={longitude}
                            onChange={(text, lat, lng) => {
                              field.handleChange(text);
                              if (lat !== null)
                                form.setFieldValue("latitude", lat);
                              if (lng !== null)
                                form.setFieldValue("longitude", lng);
                            }}
                            placeholder="San Francisco, CA"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </>
                      );
                    }}
                  />
                </motion.div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <form.Field
                name="maxParticipants"
                children={(field) => (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <FieldLabel>MAX PARTICIPANTS</FieldLabel>
                      {lumaImported && (
                        <span className="text-xs text-brand-green/70">
                          Set by Luma
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      className={`${inputClass} ${lumaImported ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={lumaImported}
                    />
                  </div>
                )}
              />
              <form.Field
                name="maxTeamSize"
                children={(field) => (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <FieldLabel>MAX TEAM SIZE</FieldLabel>
                      {lumaImported && (
                        <span className="text-xs text-brand-green/70">
                          Set by Luma
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      className={`${inputClass} ${lumaImported ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={lumaImported}
                    />
                  </div>
                )}
              />
            </div>

            <form.Field
              name="requiresApproval"
              children={(field) => (
                <div className="flex items-center justify-between p-3 border border-border/40 bg-secondary/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-foreground">
                        REQUIRES APPROVAL
                      </p>
                      {lumaImported && (
                        <span className="text-xs text-brand-green/70">
                          Set by Luma
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Participants need manual approval to join
                    </p>
                  </div>
                  <Switch
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    disabled={lumaImported}
                    className={
                      lumaImported ? "opacity-50 cursor-not-allowed" : ""
                    }
                  />
                </div>
              )}
            />
          </motion.div>
        )}

        {/* ─── STEP 1 — DETAILS ────────────────────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <form.Field
              name="description"
              children={(field) => (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FieldLabel>DESCRIPTION (MARKDOWN)</FieldLabel>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewMode(
                          previewMode === "form" ? "preview" : "form"
                        )
                      }
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {previewMode === "form" ? (
                        <>
                          <Eye size={11} /> PREVIEW
                        </>
                      ) : (
                        <>
                          <Code size={11} /> EDIT
                        </>
                      )}
                    </button>
                  </div>
                  {previewMode === "form" ? (
                    <textarea
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={14}
                      className={`${inputClass} resize-none`}
                    />
                  ) : (
                    <div className="border border-border/40 p-4 min-h-[280px] bg-secondary/10">
                      <MarkdownRenderer content={field.state.value} />
                    </div>
                  )}
                </div>
              )}
            />

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground tracking-widest">
                TAGS
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allAvailableTags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`text-xs border px-2 py-0.5 transition-colors ${
                      tags?.includes(t)
                        ? "border-brand-purple/60 text-brand-purple bg-brand-purple/5"
                        : "border-border/40 text-muted-foreground hover:border-border/70"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground tracking-widest">
                TECHNOLOGIES
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allAvailableTechs.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTech(t)}
                    className={`text-xs border px-2 py-0.5 transition-colors ${
                      techs?.includes(t)
                        ? "border-foreground/60 text-foreground bg-foreground/5"
                        : "border-border/40 text-muted-foreground hover:border-border/70"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 2 — PRIZES ─────────────────────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {prizes.map((prize, i) => (
              <div
                key={i}
                className="border border-border/40 p-4 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className=" text-xs text-muted-foreground">
                    PRIZE {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePrize(i)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      PLACE
                    </label>
                    <input
                      value={prize.place}
                      onChange={(e) => {
                        const current = form.getFieldValue("prizes");
                        const updated = [...current];
                        updated[i] = { ...updated[i], place: e.target.value };
                        form.setFieldValue("prizes", updated);
                      }}
                      placeholder="1st"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      AMOUNT
                    </label>
                    <input
                      value={prize.amount}
                      onChange={(e) => {
                        const current = form.getFieldValue("prizes");
                        const updated = [...current];
                        updated[i] = { ...updated[i], amount: e.target.value };
                        form.setFieldValue("prizes", updated);
                      }}
                      placeholder="$10,000"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    DESCRIPTION
                  </label>
                  <input
                    value={prize.description}
                    onChange={(e) => {
                      const current = form.getFieldValue("prizes");
                      const updated = [...current];
                      updated[i] = {
                        ...updated[i],
                        description: e.target.value,
                      };
                      form.setFieldValue("prizes", updated);
                    }}
                    placeholder="Grand Prize"
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addPrize}
              className="w-full rounded-none  text-xs tracking-wider border-dashed border-border/50 hover:border-brand-green/50 hover:text-brand-green h-9 transition-all"
            >
              <Plus size={12} className="mr-2" /> ADD PRIZE
            </Button>
          </motion.div>
        )}

        {/* ─── STEP 3 — PREVIEW ────────────────────────────────────────────── */}
        {step === 3 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="glass border border-border/40 p-6 space-y-4">
              <div className="p-6 border border-white/10 relative overflow-hidden bg-zinc-950">
                <p className="relative  text-2xl text-white/90 mb-2">
                  {title || "UNTITLED"}
                </p>
                <p className="relative text-xs text-white/50">
                  {locationMode === "remote"
                    ? "Remote"
                    : locationMode === "hybrid"
                      ? `Hybrid · ${location || "TBD"}`
                      : location || "TBD"}
                  {" · "}
                  {startDate ? format(startDate, "MMM d, yyyy") : "TBD"}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">TAGS</p>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((t, i) => (
                      <TagBadge key={t} label={t} index={i} />
                    ))}
                    {tags.length === 0 && (
                      <span className="text-xs text-muted-foreground/50">
                        none
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">TECHS</p>
                  <div className="flex flex-wrap gap-1">
                    {techs.map((t, i) => (
                      <TagBadge key={t} label={t} variant="tech" index={i} />
                    ))}
                    {techs.length === 0 && (
                      <span className="text-xs text-muted-foreground/50">
                        none
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">DATES</p>
                  <span className="text-xs text-foreground">
                    {startDate && endDate
                      ? `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`
                      : "Not set"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    PARTICIPATION
                  </p>
                  <span className="text-xs text-foreground capitalize">
                    {locationMode.replace("_", " ")}
                    {(locationMode === "in_person" ||
                      locationMode === "hybrid") &&
                    location
                      ? ` · ${location}`
                      : ""}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    MAX PARTICIPANTS
                  </p>
                  <span className="text-xs text-foreground">
                    {maxParticipants}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    MAX TEAM SIZE
                  </p>
                  <span className="text-xs text-foreground">{maxTeamSize}</span>
                </div>
              </div>

              <div className="border-t border-border/30 pt-4">
                <MarkdownRenderer
                  content={
                    description.slice(0, 400) +
                    (description.length > 400 ? "..." : "")
                  }
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                duplicateCheck.isDuplicate ||
                duplicateCheck.isChecking
              }
              className="w-full rounded-none  text-xs tracking-widest bg-foreground text-background hover:bg-foreground/90 h-11 disabled:opacity-50"
            >
              {isSubmitting
                ? "DEPLOYING..."
                : duplicateCheck.isChecking
                  ? "CHECKING..."
                  : "DEPLOY HACKATHON →"}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 py-4 border-t border-border/20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className=" text-xs tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2"
          >
            ← BACK
          </button>
        </div>
        {step < STEPS.length - 1 && (
          <button
            type="button"
            onClick={handleNextStep}
            disabled={
              (step === 0 && (!canGoToDetails || duplicateCheck.isDuplicate)) ||
              (step === 1 && !canGoToPrizes)
            }
            className=" text-xs tracking-wider text-foreground border border-border/40 px-4 py-2 hover:border-brand-green/50 hover:text-brand-green transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            NEXT →
          </button>
        )}
      </div>
    </section>
  );
}

// Simple animated section wrapper
function AnimatedSection({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
