"use client";

import { Mail, Link2, Check, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CodeText } from "./code-text";
import { Icons } from "./icons";

interface ShareModalProps {
  url: string;
  title: string;
}

export function ShareModal({ url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      color: "hover:text-foreground",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Icons.Twitter,
      label: "X (Twitter)",
    },
    {
      color: "hover:text-foreground",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Icons.Linkedin,
      label: "LinkedIn",
    },
    {
      color: "hover:text-foreground",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Icons.Facebook,
      label: "Facebook",
    },
    {
      color: "hover:text-foreground",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: Mail,
      label: "Email",
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="font-pixel text-xs tracking-wider rounded-none h-9 px-4 border-border/50 hover:border-brand-green/50 hover:text-brand-green transition-all"
          />
        }
      >
        <Share2 size={12} className="mr-1.5" />
        INVITE
      </DialogTrigger>
      <DialogContent className="rounded-none border-border/50 bg-background max-w-sm">
        <DialogHeader>
          <DialogTitle>
            <CodeText as="p">share</CodeText>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Social links */}
          <div className="grid grid-cols-2 gap-2">
            {shareLinks.map(({ label, icon: Icon, href, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 px-3 py-2.5 border border-border/40 text-muted-foreground ${color} transition-colors hover:border-border/70`}
              >
                <Icon size={14} />
                <span className="font-mono text-xs">{label}</span>
              </a>
            ))}
          </div>

          {/* Copy link */}
          <div className="border border-border/40">
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30">
              <Link2 size={12} className="text-muted-foreground shrink-0" />
              <span className="font-mono text-sm text-muted-foreground truncate flex-1">
                {url}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2 font-mono text-xs shrink-0 rounded-none"
              >
                {copied ? (
                  <span className="flex items-center gap-1 text-brand-green">
                    <Check size={10} /> COPIED
                  </span>
                ) : (
                  "COPY"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
