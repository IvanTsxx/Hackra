"use client";

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
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Footer } from "@/components/footer";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Navbar } from "@/components/navbar";
import { TagBadge } from "@/components/tag-badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import type { Tech } from "@/lib/mock-data";
import { CodeText } from "@/shared/components/code-text";
import { ThemeCustomizer } from "@/shared/components/theme-customizer";
import type { ThemeValue } from "@/shared/components/theme-customizer";

import {
  createHackathonAction,
  importLumaFormDataAction,
  previewLumaAction,
} from "./_actions";

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

const STEPS = ["BASICS", "DETAILS", "PRIZES", "THEME", "PREVIEW"];

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

const DEFAULT_THEME: ThemeValue = {
  bg: "#0a0a0a",
  gradient: "from-zinc-950 to-zinc-900",
  gradientCss: "linear-gradient(135deg, #0a0a0a 0%, #18181b 100%)",
  style: "default",
};

export default function CreateHackathonPage() {
  const [step, setStep] = useState(0);
  const [previewMode, setPreviewMode] = useState<"form" | "preview">("form");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(
    "## Overview\n\nDescribe your hackathon here...\n\n## What to Build\n\n- Build something amazing\n- Use the provided tech stack\n\n## Judging Criteria\n\n- Innovation\n- Technical Execution\n- Design & UX"
  );
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [locationMode, setLocationMode] = useState<LocationMode>("in_person");
  const [location, setLocation] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<Tech[]>([]);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState(500);
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [prizes, setPrizes] = useState<PrizeEntry[]>([
    { amount: "$10,000", description: "Grand Prize", place: "1st" },
    { amount: "$5,000", description: "Runner Up", place: "2nd" },
  ]);
  const [theme, setTheme] = useState<ThemeValue>(DEFAULT_THEME);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Luma import state
  const [lumaUrl, setLumaUrl] = useState("");
  const [lumaPreviewData, setLumaPreviewData] = useState<NonNullable<
    Awaited<ReturnType<typeof previewLumaAction>>["data"]
  > | null>(null);
  const [lumaPreviewError, setLumaPreviewError] = useState<string | null>(null);
  const [lumaLoading, setLumaLoading] = useState(false);
  const [lumaImported, setLumaImported] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleTag = (t: string) =>
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  const toggleTech = (t: Tech) =>
    setSelectedTechs((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const addPrize = () =>
    setPrizes((prev) => [
      ...prev,
      { amount: "", description: "", place: `${prev.length + 1}th` },
    ]);
  const removePrize = (i: number) =>
    setPrizes((prev) => prev.filter((_, idx) => idx !== i));
  const updatePrize = (i: number, field: keyof PrizeEntry, val: string) =>
    setPrizes((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: val } : p))
    );

  const fetchPreview = useCallback(async (url: string) => {
    setLumaLoading(true);
    setLumaPreviewError(null);
    setLumaPreviewData(null);

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
      setLumaPreviewData(null);
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
    setLumaLoading(true);

    const result = await importLumaFormDataAction(lumaUrl);
    setLumaLoading(false);

    if (result.success && result.data) {
      const d = result.data;
      setTitle(d.title);
      setDescription(d.description);
      setStartDate(d.startDate);
      setEndDate(d.endDate);
      if (d.location) setLocation(d.location);
      setLocationMode(d.locationMode);
      if (d.maxParticipants) setMaxParticipants(d.maxParticipants);
      setLumaImported(true);
      toast.success("Imported from Luma!", {
        description: "All fields have been auto-filled.",
      });
    } else {
      toast.error("Import failed", {
        description: result.error ?? "Could not import event data.",
      });
    }
  }, [lumaUrl]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const handleSubmit = async () => {
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
      const result = await createHackathonAction({
        description,
        endDate,
        image: undefined,
        location,
        locationMode,
        maxParticipants,
        maxTeamSize,
        requiresApproval,
        startDate,
        tags: selectedTags,
        techs: selectedTechs,
        themeBg: theme.bg,
        themeGradient: theme.gradient,
        themeStyle: theme.style,
        title: title.trim(),
      });

      if (result.success) {
        toast.success("Hackathon deployed!");
        setSubmitted(true);
      } else {
        toast.error("Deploy failed", { description: result.error });
      }
    } catch {
      toast.error("Deploy failed", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-border/40 bg-secondary/20 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-brand-green/40 transition-colors";

  /* const isOnline = locationMode === "remote" || locationMode === "hybrid"; */

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 p-12 border border-brand-green/30 bg-brand-green/5"
        >
          <p className="font-pixel text-3xl text-brand-green">DEPLOYED.</p>
          <p className="font-mono text-xs text-muted-foreground">
            Your hackathon has been created successfully.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Link
              href="/explore"
              className="font-pixel text-xs border border-border/50 px-4 py-2 hover:border-brand-green/50 hover:text-brand-green transition-all"
            >
              VIEW ALL
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="font-pixel text-xs bg-foreground text-background px-4 py-2 hover:opacity-90"
            >
              CREATE ANOTHER
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 space-y-2"
        >
          <CodeText as="p">create</CodeText>
          <h1 className="text-2xl md:text-3xl text-foreground">
            NEW_HACKATHON
          </h1>
        </motion.div>

        {/* Step tabs */}
        <div className="flex border-b border-border/40 mb-8 overflow-x-auto">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`font-pixel text-[10px] tracking-wider px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
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
                  <label className="font-mono text-[10px] text-brand-green tracking-widest">
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
                    <div className="flex items-center gap-1 text-brand-green font-mono text-xs shrink-0">
                      <CheckCircle2 size={14} />
                      Imported
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleImportFromLuma}
                      disabled={lumaLoading || !lumaUrl}
                      className="font-pixel text-[10px] bg-brand-green/20 text-brand-green border border-brand-green/40 px-3 hover:bg-brand-green/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                    >
                      {lumaLoading ? "..." : "IMPORT"}
                    </button>
                  )}
                </div>

                {lumaLoading && !lumaPreviewData && (
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <Loader2 size={12} className="animate-spin" />
                    Fetching event data...
                  </div>
                )}

                {lumaPreviewError && (
                  <div className="flex items-center gap-2 font-mono text-xs text-red-400">
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
                      <img
                        src={lumaPreviewData.image}
                        alt={lumaPreviewData.title}
                        className="w-full h-24 object-cover"
                      />
                    )}
                    <p className="font-mono text-xs text-foreground">
                      {lumaPreviewData.title}
                    </p>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-muted-foreground">
                      <div>
                        <span className="text-foreground">Start:</span>{" "}
                        {lumaPreviewData.startDate.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div>
                        <span className="text-foreground">End:</span>{" "}
                        {lumaPreviewData.endDate.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
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
                    <p className="font-mono text-[10px] text-brand-green/70">
                      Click IMPORT to auto-fill all fields
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  TITLE *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Hackathon"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  COVER IMAGE
                </label>
                <div className="border border-dashed border-border/40 p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-border/70 transition-colors">
                  <Upload size={16} className="text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">
                    DROP IMAGE OR CLICK TO UPLOAD
                  </span>
                </div>
              </div>

              {/* Date pickers */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    START DATE *
                  </label>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          type="button"
                          className={`w-full flex items-center gap-2 border border-border/40 bg-secondary/20 px-3 py-2 font-mono text-xs text-left transition-colors ${
                            startDate
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
                      {startDate
                        ? format(startDate, "MMM d, yyyy")
                        : "Pick start date"}
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-none border-border/50"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(d) => d < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    END DATE *
                  </label>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          type="button"
                          className={`w-full flex items-center gap-2 border border-border/40 bg-secondary/20 px-3 py-2 font-mono text-xs text-left transition-colors ${
                            endDate
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
                      {endDate
                        ? format(endDate, "MMM d, yyyy")
                        : "Pick end date"}
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-none border-border/50"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(d) => d < (startDate ?? new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Date range display */}
              {startDate && endDate && (
                <div className="flex items-center gap-2 font-mono text-xs text-brand-green/70 border border-brand-green/20 bg-brand-green/5 px-3 py-2">
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
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  PARTICIPATION MODE *
                </label>
                <div className="grid grid-cols-3 gap-0 border border-border/40 overflow-hidden">
                  {LOCATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setLocationMode(opt.value)}
                      className={`py-3 px-2 flex flex-col items-center gap-1 transition-all border-r border-border/30 last:border-r-0 ${
                        locationMode === opt.value
                          ? "bg-brand-green/10 text-brand-green"
                          : "bg-secondary/5 text-muted-foreground hover:text-foreground hover:bg-secondary/10"
                      }`}
                    >
                      <span className="font-pixel text-[10px] tracking-wider">
                        {opt.label}
                      </span>
                      <span className="font-mono text-[9px] opacity-70">
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>

                {(locationMode === "in_person" ||
                  locationMode === "hybrid") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="space-y-1"
                  >
                    <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                      VENUE LOCATION{" "}
                      {locationMode === "hybrid" && "(physical venue)"}
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                      className={inputClass}
                    />
                  </motion.div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    MAX PARTICIPANTS
                  </label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(+e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    MAX TEAM SIZE
                  </label>
                  <input
                    type="number"
                    value={maxTeamSize}
                    onChange={(e) => setMaxTeamSize(+e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-border/40 bg-secondary/10">
                <div>
                  <p className="font-mono text-xs text-foreground">
                    REQUIRES APPROVAL
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Participants need manual approval to join
                  </p>
                </div>
                <Switch
                  checked={requiresApproval}
                  onCheckedChange={setRequiresApproval}
                />
              </div>
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    DESCRIPTION (MARKDOWN)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewMode(
                        previewMode === "form" ? "preview" : "form"
                      )
                    }
                    className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={14}
                    className={`${inputClass} resize-none`}
                  />
                ) : (
                  <div className="border border-border/40 p-4 min-h-[280px] bg-secondary/10">
                    <MarkdownRenderer content={description} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  TAGS
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                        selectedTags.includes(t)
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
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  TECHNOLOGIES
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_TECHS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTech(t)}
                      className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                        selectedTechs.includes(t)
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
                    <span className="font-pixel text-xs text-muted-foreground">
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
                      <label className="font-mono text-[10px] text-muted-foreground">
                        PLACE
                      </label>
                      <input
                        value={prize.place}
                        onChange={(e) =>
                          updatePrize(i, "place", e.target.value)
                        }
                        placeholder="1st"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] text-muted-foreground">
                        AMOUNT
                      </label>
                      <input
                        value={prize.amount}
                        onChange={(e) =>
                          updatePrize(i, "amount", e.target.value)
                        }
                        placeholder="$10,000"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-muted-foreground">
                      DESCRIPTION
                    </label>
                    <input
                      value={prize.description}
                      onChange={(e) =>
                        updatePrize(i, "description", e.target.value)
                      }
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
                className="w-full rounded-none font-pixel text-xs tracking-wider border-dashed border-border/50 hover:border-brand-green/50 hover:text-brand-green h-9 transition-all"
              >
                <Plus size={12} className="mr-2" /> ADD PRIZE
              </Button>
            </motion.div>
          )}

          {/* ─── STEP 3 — THEME ──────────────────────────────────────────────── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <ThemeCustomizer value={theme} onChange={setTheme} />

              {/* Live preview */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  LIVE PREVIEW
                </label>
                <div
                  className="border border-border/40 p-6 space-y-3 transition-all relative overflow-hidden"
                  style={{ background: theme.gradientCss }}
                >
                  {/* Scanline overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
                    }}
                  />
                  <CodeText className="text-brand-green" as="span">
                    preview
                  </CodeText>
                  <p className="relative font-pixel text-xl text-white/90">
                    {title || "HACKATHON TITLE"}
                  </p>
                  <div className="relative flex flex-wrap gap-1.5">
                    {selectedTags.slice(0, 3).map((t, i) => (
                      <TagBadge key={t} label={t} variant="default" index={i} />
                    ))}
                  </div>
                  <p className="relative font-mono text-xs text-white/40">
                    {startDate
                      ? format(startDate, "MMM d, yyyy")
                      : "Start Date"}
                    {" — "}
                    {endDate ? format(endDate, "MMM d, yyyy") : "End Date"}
                    {" · "}
                    {locationMode === "remote"
                      ? "Remote"
                      : locationMode === "hybrid"
                        ? "Hybrid"
                        : location || "TBD"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 4 — PREVIEW ────────────────────────────────────────────── */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="glass border border-border/40 p-6 space-y-4">
                <div
                  className="p-6 border border-white/10 relative overflow-hidden"
                  style={{ background: theme.gradientCss }}
                >
                  <p className="relative font-pixel text-2xl text-white/90 mb-2">
                    {title || "UNTITLED"}
                  </p>
                  <p className="relative font-mono text-xs text-white/50">
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
                    <p className="font-mono text-[10px] text-muted-foreground mb-1">
                      TAGS
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map((t, i) => (
                        <TagBadge key={t} label={t} index={i} />
                      ))}
                      {selectedTags.length === 0 && (
                        <span className="font-mono text-xs text-muted-foreground/50">
                          none
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground mb-1">
                      TECHS
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTechs.map((t, i) => (
                        <TagBadge key={t} label={t} variant="tech" index={i} />
                      ))}
                      {selectedTechs.length === 0 && (
                        <span className="font-mono text-xs text-muted-foreground/50">
                          none
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground mb-1">
                      DATES
                    </p>
                    <span className="font-mono text-xs text-foreground">
                      {startDate && endDate
                        ? `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`
                        : "Not set"}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground mb-1">
                      PARTICIPATION
                    </p>
                    <span className="font-mono text-xs text-foreground capitalize">
                      {locationMode.replace("_", " ")}
                      {(locationMode === "in_person" ||
                        locationMode === "hybrid") &&
                      location
                        ? ` · ${location}`
                        : ""}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground mb-1">
                      MAX PARTICIPANTS
                    </p>
                    <span className="font-mono text-xs text-foreground">
                      {maxParticipants}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground mb-1">
                      MAX TEAM SIZE
                    </p>
                    <span className="font-mono text-xs text-foreground">
                      {maxTeamSize}
                    </span>
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full rounded-none font-pixel text-xs tracking-widest bg-foreground text-background hover:bg-foreground/90 h-11 disabled:opacity-50"
              >
                {isSubmitting ? "DEPLOYING..." : "DEPLOY HACKATHON →"}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/20">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="font-pixel text-[10px] tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2"
          >
            ← BACK
          </button>
          {step < STEPS.length - 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="font-pixel text-[10px] tracking-wider text-foreground border border-border/40 px-4 py-2 hover:border-brand-green/50 hover:text-brand-green transition-all"
            >
              NEXT →
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
