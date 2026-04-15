"use client";

import { useState } from "react";
import { toast } from "sonner";

import { updateTeam } from "@/app/(private)/(user)/teams/_actions";
import { TagBadge } from "@/components/tag-badge";
import { Button } from "@/components/ui/button";
import type { Tech } from "@/lib/mock-data";

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

interface EditTeamFormProps {
  team: {
    id: string;
    name: string;
    description: string | null;
    techs: string[];
  };
}

export function EditTeamForm({ team }: EditTeamFormProps) {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description || "");
  const [selectedTechs, setSelectedTechs] = useState<Tech[]>(
    (team.techs as Tech[]) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleTech = (t: Tech) =>
    setSelectedTechs((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const inputClass =
    "w-full border border-border/40 bg-secondary/20 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-brand-green/40 transition-colors";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateTeam({
      description: description || undefined,
      name,
      teamId: team.id,
      techs: selectedTechs,
    });

    setIsLoading(false);

    if (result.success) {
      toast.success("Team updated successfully");
      setIsEditing(false);
    } else {
      toast.error(result.error || "Failed to update team");
    }
  };

  if (!isEditing) {
    return (
      <div className="glass border border-border/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className=" text-xs tracking-wider text-muted-foreground">
            TEAM INFO
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7 px-2 text-xs rounded-none"
          >
            EDIT
          </Button>
        </div>
        <div className="space-y-2">
          <div>
            <span className="text-xs text-muted-foreground">NAME: </span>
            <span className="text-xs text-foreground">{team.name}</span>
          </div>
          {team.description && (
            <div>
              <span className="text-xs text-muted-foreground">
                DESCRIPTION:{" "}
              </span>
              <span className="text-xs text-foreground">
                {team.description}
              </span>
            </div>
          )}
          {team.techs && team.techs.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {(team.techs as string[]).map((t, i) => (
                <TagBadge key={t} index={i} label={t} variant="tech" />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass border border-border/40 p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className=" text-xs tracking-wider text-muted-foreground">
          EDIT TEAM
        </h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
            className="h-7 px-2 text-xs rounded-none"
          >
            CANCEL
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-7 px-3 text-xs rounded-none bg-foreground text-background"
          >
            {isLoading ? "SAVING..." : "SAVE"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground tracking-widest">
            TEAM NAME
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground tracking-widest">
            DESCRIPTION
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground tracking-widest">
            TECHNOLOGIES
          </label>
          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_TECHS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTech(t)}
                className={`text-xs border px-2 py-0.5 transition-colors ${
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
      </div>
    </form>
  );
}
