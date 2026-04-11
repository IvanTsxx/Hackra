"use client";
import { Lock, Send, Unlock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

import { applyToTeam } from "@/app/(private)/(user)/teams/_actions";
import type { TeamGetPayload } from "@/app/generated/prisma/models";
import { Button } from "@/components/ui/button";
import { CodeText } from "@/shared/components/code-text";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useSession } from "@/shared/lib/auth-client";

const inputClass =
  "w-full border border-border/40 bg-secondary/20 px-3 py-2   text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-brand-green/40 transition-colors";

export const TeamHeader = ({
  team,
  openSpots,
  isFull,
}: {
  team: TeamGetPayload<{
    include: {
      questions: true;
      hackathon: true;
    };
  }>;
  openSpots: number;
  isFull: boolean;
}) => {
  const { data } = useSession();
  const isOwner = team.hackathon.organizerId === data?.user.id;
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await applyToTeam({
      answers:
        team.questions.length > 0
          ? team.questions.map((q, i) => ({
              answer: answers[i] || "",
              questionId: q.id,
            }))
          : undefined,
      message: message || undefined,
      teamId: team.id,
    });

    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 space-y-3"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <CodeText as="p" className="text-brand-green tracking-widest">
            team
          </CodeText>
          <h1 className="font-pixel text-2xl md:text-3xl text-foreground">
            {team.name.toUpperCase()}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`flex items-center gap-1.5 border px-3 py-1.5   text-xs ${
              isFull
                ? "border-destructive/40 text-destructive/70"
                : "border-brand-green/40 text-brand-green"
            }`}
          >
            {isFull ? <Lock size={11} /> : <Unlock size={11} />}
            <span>
              {isFull
                ? "FULL"
                : `${openSpots} SPOT${openSpots !== 1 ? "S" : ""} OPEN`}
            </span>
          </div>
          {!isFull && !isOwner && (
            <Dialog>
              <DialogTrigger
                render={
                  <Button className="font-pixel text-xs tracking-wider rounded-none bg-foreground text-background hover:bg-foreground/90 h-9 px-4" />
                }
              >
                APPLY →
              </DialogTrigger>
              <DialogContent className="rounded-none border-border/50 max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    <CodeText className="tracking-wider">
                      APPLY — {team.name.toUpperCase()}
                    </CodeText>
                  </DialogTitle>
                </DialogHeader>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-8 text-center space-y-2"
                  >
                    <Send size={20} className="mx-auto text-brand-green mb-3" />
                    <p className="font-pixel text-lg text-brand-green">SENT.</p>
                    <p className="  text-xs text-muted-foreground">
                      Your application was submitted.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {team.questions.map((q, i) => (
                      <div key={i} className="space-y-1.5">
                        <label className="  text-xs text-foreground">
                          {q.question}
                        </label>
                        <input
                          type="text"
                          required
                          value={answers[i] || ""}
                          onChange={(e) => {
                            const next = [...answers];
                            next[i] = e.target.value;
                            setAnswers(next);
                          }}
                          placeholder="Your answer..."
                          className={inputClass}
                        />
                      </div>
                    ))}
                    <div className="space-y-1.5">
                      <label className="  text-xs text-muted-foreground">
                        COVER MESSAGE (optional)
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        placeholder="Tell the team why you want to join..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-none font-pixel text-xs tracking-wider bg-foreground text-background hover:bg-foreground/90 h-9"
                    >
                      {isSubmitting ? "SENDING..." : "SEND APPLICATION →"}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {team.description && (
        <p className="  text-sm text-muted-foreground leading-relaxed max-w-xl">
          {team.description}
        </p>
      )}
    </motion.div>
  );
};
