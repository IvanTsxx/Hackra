"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

import { applyToTeam } from "@/app/(private)/(user)/teams/_actions";
import type { TeamGetPayload } from "@/app/generated/prisma/models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CodeText } from "@/shared/components/code-text";
import { Button } from "@/shared/components/ui/button";

export function ApplyModal({
  team,
}: {
  team: TeamGetPayload<{
    include: {
      questions: true;
    };
  }>;
}) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
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
    setTimeout(() => {
      setSubmitted(false);
    }, 2000);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            size="sm"
            variant="outline"
            className=" text-xs tracking-wider h-7 px-2 rounded-none border-foreground/30 hover:border-brand-green/60 hover:text-brand-green transition-all"
          />
        }
      >
        APPLY
      </DialogTrigger>
      <DialogContent className="rounded-none border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle>
            <CodeText className="tracking-wider">APPLY — {team.name}</CodeText>
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 text-center space-y-2"
          >
            <p className=" text-lg text-brand-green">SENT.</p>
            <p className="  text-xs text-muted-foreground">
              Application submitted successfully
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4 pt-2">
            {team.questions.map((q, i) => (
              <div key={i} className="space-y-1.5">
                <label className="  text-xs text-foreground">
                  {q.question}
                </label>
                <input
                  type="text"
                  value={answers[i] || ""}
                  onChange={(e) => {
                    const next = [...answers];
                    next[i] = e.target.value;
                    setAnswers(next);
                  }}
                  placeholder="Your answer..."
                  className="w-full border border-border/40 bg-secondary/20 px-3 py-2   text-xs outline-none focus:border-brand-green/40"
                />
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="  text-xs text-muted-foreground">
                MESSAGE (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Tell the team why you want to join..."
                className="w-full border border-border/40 bg-secondary/20 px-3 py-2   text-xs outline-none focus:border-brand-green/40 resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full rounded-none  text-xs tracking-wider bg-foreground text-background hover:bg-foreground/90 h-9"
            >
              {isSubmitting ? "SENDING..." : "SEND APPLICATION →"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
