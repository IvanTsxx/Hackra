"use client";

import { ChevronRight, Save } from "lucide-react";
import { motion } from "motion/react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";

import { TagBadge } from "@/components/tag-badge";
import { Button } from "@/components/ui/button";
import { USERS } from "@/lib/mock-data";
import type { Tech } from "@/lib/mock-data";

const [ME] = USERS;

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
  "Vue",
  "Svelte",
  "Bun",
];

const NAV_ITEMS: { active: boolean; href: Route; label: string }[] = [
  { active: true, href: "/settings/profile", label: "PROFILE" },
  { active: false, href: "/settings/profile", label: "ACCOUNT" },
  { active: false, href: "/settings/profile", label: "NOTIFICATIONS" },
];

export default function SettingsProfilePage() {
  const [name, setName] = useState(ME.name);
  const [bio, setBio] = useState(ME.bio);
  const [location, setLocation] = useState(ME.location);
  const [role, setRole] = useState(ME.role);
  const [github, setGithub] = useState(ME.githubUsername ?? "");
  const [techs, setTechs] = useState<Tech[]>(ME.techs);
  const [saved, setSaved] = useState(false);

  const toggleTech = (t: Tech) =>
    setTechs((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    "w-full border border-border/40 bg-secondary/20 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-brand-green/40 transition-colors";

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground mb-6 mt-4">
        <Link href={`/user/${ME.username}`} className="hover:text-foreground">
          PROFILE
        </Link>
        <ChevronRight size={10} />
        <span className="text-foreground">SETTINGS</span>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar nav */}
        <nav className="md:col-span-1">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-3 py-2 font-pixel text-[10px] tracking-wider transition-colors border-l-2 ${
                  item.active
                    ? "border-brand-green text-brand-green bg-brand-green/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Form */}
        <div className="md:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1 mb-7"
          >
            <p className="font-mono text-xs text-brand-green tracking-widest">
              // settings
            </p>
            <h1 className="font-pixel text-2xl text-foreground">PROFILE</h1>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display name + role */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  DISPLAY NAME
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  ROLE / TITLE
                </label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Full-stack Developer"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                BIO
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Location + GitHub */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  LOCATION
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  GITHUB USERNAME
                </label>
                <div className="flex items-center border border-border/40 bg-secondary/20 focus-within:border-brand-green/40 transition-colors">
                  <span className="px-2 font-mono text-xs text-muted-foreground/60 select-none border-r border-border/30">
                    github.com/
                  </span>
                  <input
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="username"
                    className="flex-1 px-2 py-2 font-mono text-xs text-foreground bg-transparent outline-none placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>
            </div>

            {/* Tech stack */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  TECH STACK
                </label>
                <span className="font-mono text-[10px] text-muted-foreground/50">
                  {techs.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TECHS.map((t, i) => (
                  <Button
                    key={t}
                    onClick={() => toggleTech(t)}
                    variant="ghost"
                    className="p-0"
                  >
                    <TagBadge
                      index={i}
                      className={`font-mono text-xs border px-2 py-0.5 transition-colors ${
                        techs.includes(t)
                          ? "border-foreground/60 text-foreground bg-foreground/5"
                          : "border-border/40 text-muted-foreground hover:border-border/70"
                      }`}
                      label={t}
                    />
                  </Button>
                ))}
              </div>
              {techs.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {techs.map((t, i) => (
                    <TagBadge key={t} label={t} variant="tech" index={i} />
                  ))}
                </div>
              )}
            </div>

            {/* Divider + Save */}
            <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-4">
              <span
                className={`font-mono text-xs transition-all duration-300 ${saved ? "text-brand-green opacity-100" : "opacity-0"}`}
              >
                // SAVED.
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
        </div>
      </div>
    </main>
  );
}
