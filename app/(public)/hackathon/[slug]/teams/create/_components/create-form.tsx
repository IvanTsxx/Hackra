"use client";

import { Plus, X, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { createTeam } from "@/app/(private)/(user)/teams/_actions";
import type { Hackathon } from "@/app/generated/prisma/client";
import { TagBadge } from "@/components/tag-badge";
import { Button } from "@/components/ui/button";
import type { Tech } from "@/lib/mock-data";
import { CodeText } from "@/shared/components/code-text";

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

export const CreateForm = ({ hackathon }: { hackathon: Hackathon }) => {
  const { slug, id: hackathonId } = hackathon;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<Tech[]>([]);
  const [questions, setQuestions] = useState<string[]>([""]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleTech = (t: Tech) =>
    setSelectedTechs((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const addQuestion = () => setQuestions((prev) => [...prev, ""]);
  const removeQuestion = (i: number) =>
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  const updateQuestion = (i: number, val: string) =>
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? val : q)));

  const inputClass =
    "w-full border border-border/40 bg-secondary/20 px-3 py-2   text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-brand-green/40 transition-colors";

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 p-12 border border-brand-green/30 bg-brand-green/5 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center"
      >
        <p className="font-pixel text-3xl text-brand-green">TEAM CREATED.</p>
        <p className="  text-xs text-muted-foreground">
          {name} is ready to recruit.
        </p>
        <div className="flex gap-2 justify-center pt-2">
          <Link
            href={`/hackathon/${slug}/teams`}
            className="font-pixel text-xs bg-foreground text-background px-4 py-2 hover:opacity-90"
          >
            VIEW TEAMS
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2   text-sm text-muted-foreground mb-6 mt-4 flex-wrap">
        <Link
          href={`/hackathon/${slug}`}
          className="hover:text-foreground truncate max-w-[150px]"
        >
          {hackathon.title}
        </Link>
        <ChevronRight size={10} />
        <Link
          href={`/hackathon/${slug}/teams`}
          className="hover:text-foreground"
        >
          TEAMS
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground">CREATE</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-1"
      >
        <CodeText as="p">new team</CodeText>
        <h1 className="font-pixel text-2xl text-foreground">CREATE_TEAM</h1>
      </motion.div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);

          const nonEmptyQuestions = questions.filter((q) => q.trim() !== "");

          const result = await createTeam({
            description: description || undefined,
            hackathonId,
            name,
            questions: nonEmptyQuestions,
            techs: selectedTechs,
          });

          setIsLoading(false);

          if (result.success) {
            setSubmitted(true);
          } else {
            toast.error(result.error || "Failed to create team");
          }
        }}
        className="space-y-6"
      >
        {/* Name */}
        <div className="space-y-1">
          <label className="  text-xs text-muted-foreground tracking-widest">
            TEAM NAME *
          </label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Zero Config"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="  text-xs text-muted-foreground tracking-widest">
            DESCRIPTION (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What are you building? What kind of teammates are you looking for?"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Technologies */}
        <div className="space-y-2">
          <label className="  text-xs text-muted-foreground tracking-widest">
            REQUIRED TECHNOLOGIES
          </label>
          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_TECHS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTech(t)}
                className={`  text-xs border px-2 py-0.5 transition-colors ${
                  selectedTechs.includes(t)
                    ? "border-foreground/60 text-foreground bg-foreground/5"
                    : "border-border/40 text-muted-foreground hover:border-border/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {selectedTechs.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedTechs.map((t, i) => (
                <TagBadge index={i} key={t} label={t} variant="tech" />
              ))}
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="  text-xs text-muted-foreground tracking-widest">
              APPLICATION QUESTIONS
            </label>
            <span className="  text-xs text-muted-foreground/50">
              Applicants will answer these
            </span>
          </div>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="  text-xs text-muted-foreground/50 w-4 shrink-0">
                  {i + 1}.
                </span>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => updateQuestion(i, e.target.value)}
                  placeholder={`Question ${i + 1}...`}
                  className={`${inputClass} flex-1`}
                />
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(i)}
                    className="text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {questions.length < 5 && (
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-1.5   text-xs text-muted-foreground hover:text-brand-green transition-colors"
            >
              <Plus size={11} /> ADD QUESTION
            </button>
          )}
        </div>

        <div className="pt-2 border-t border-border/30">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-none font-pixel text-xs tracking-wider bg-foreground text-background hover:bg-foreground/90 h-10"
          >
            {isLoading ? "CREATING..." : "LAUNCH TEAM →"}
          </Button>
        </div>
      </form>
    </main>
  );
};
