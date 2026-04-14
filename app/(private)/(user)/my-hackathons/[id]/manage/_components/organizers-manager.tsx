"use client";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { Loader2, ShieldPlus, Trash2, UserCheck, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CodeText } from "@/shared/components/code-text";

import {
  addOrganizerAction,
  removeOrganizerAction,
  searchUsersAction,
} from "../_actions";
import type { UserSearchResult } from "../_actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoOrgUser {
  id: string;
  name: string | null;
  username: string;
  email: string;
  image: string | null;
}

export interface CoOrgData {
  id: string;
  createdAt: Date;
  user: CoOrgUser;
  addedBy: { username: string };
}

interface Props {
  hackathonId: string;
  organizerId: string;
  coOrganizers: CoOrgData[];
  canManage: boolean;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const addOrgSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username too long")
    .regex(
      /^[a-z0-9_-]+$/,
      "Only lowercase letters, numbers, underscores and dashes"
    ),
});

// ─── Autocomplete Input ───────────────────────────────────────────────────────

function UserAutocomplete({
  value,
  onChange,
  onSelect,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (user: UserSearchResult) => void;
}) {
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search via server action
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const users = await searchUsersAction(value);
      setResults(users);
      setIsOpen(users.length > 0);
      setIsSearching(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (user: UserSearchResult) => {
    onSelect(user);
    onChange(user.username);
    setIsOpen(false);
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="relative">
        <Input
          id="org-username-search"
          placeholder="Search by username..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="  text-xs h-9 rounded-none pr-8"
          autoComplete="off"
        />
        {isSearching && (
          <Loader2
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
          />
        )}
        {!isSearching && value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setIsOpen(false);
              setResults([]);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 top-full left-0 right-0 mt-0.5 border border-border/60 bg-background/95 backdrop-blur-sm shadow-lg overflow-hidden"
            role="listbox"
          >
            {results.map((user, i) => (
              <motion.li
                key={user.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.18,
                  ease: "easeOut",
                }}
              >
                <button
                  type="button"
                  role="option"
                  onClick={() => handleSelect(user)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-brand-green/8 hover:border-l-2 hover:border-l-brand-green transition-all text-left group"
                >
                  {/* Avatar */}
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? user.username}
                      width={28}
                      height={28}
                      className="rounded-full shrink-0"
                      sizes="28px"
                    />
                  ) : (
                    <div className="w-7 h-7 shrink-0 rounded-full bg-border flex items-center justify-center   text-xs text-muted-foreground">
                      {user.username[0]?.toUpperCase()}
                    </div>
                  )}

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="  text-xs text-foreground truncate">
                      @{user.username}
                      {user.name && (
                        <span className="ml-1.5 text-muted-foreground">
                          · {user.name}
                        </span>
                      )}
                    </p>
                    <p className="  text-[10px] text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Add Organizer Form ───────────────────────────────────────────────────────

function AddOrganizerForm({
  hackathonId,
  onSuccess,
}: {
  hackathonId: string;
  onSuccess: () => void;
}) {
  const form = useForm({
    defaultValues: { username: "" },
    onSubmit: async ({ value }) => {
      const result = await addOrganizerAction({
        hackathonId,
        username: value.username,
      });

      if (result.success) {
        toast.success("Co-organizer added successfully.");
        form.reset();
        onSuccess();
      } else {
        toast.error(result.error ?? "Failed to add organizer.");
      }
    },
    validators: { onSubmit: addOrgSchema },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="flex items-end gap-3">
        <form.Field name="username">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="flex-1">
                <FieldLabel
                  htmlFor="org-username-search"
                  className="  text-xs text-muted-foreground tracking-widest"
                >
                  ADD CO-ORGANIZER BY USERNAME
                </FieldLabel>
                <UserAutocomplete
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                  onSelect={(user) => field.handleChange(user.username)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              className="h-9 px-4 font-pixel text-xs tracking-wider border-brand-green/40 text-brand-green hover:bg-brand-green/10 shrink-0"
            >
              {isSubmitting ? (
                <Loader2 size={12} className="animate-spin mr-1.5" />
              ) : (
                <ShieldPlus size={12} className="mr-1.5" />
              )}
              ADD
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}

// ─── Remove Button ────────────────────────────────────────────────────────────

function RemoveOrganizerButton({
  hackathonId,
  coOrgId,
  username,
}: {
  hackathonId: string;
  coOrgId: string;
  username: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeOrganizerAction({ coOrgId, hackathonId });
      if (result.success) {
        toast.success(`@${username} removed as co-organizer.`);
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to remove organizer.");
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 px-2 text-xs font-pixel text-destructive border-destructive/30 hover:bg-destructive/10"
      disabled={isPending}
      onClick={handleRemove}
      aria-label={`Remove @${username} as co-organizer`}
    >
      {isPending ? (
        <Loader2 size={11} className="animate-spin" />
      ) : (
        <Trash2 size={11} className="mr-1" />
      )}
      REMOVE
    </Button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OrganizersManager({
  hackathonId,
  coOrganizers,
  canManage,
}: Props) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Add form */}
      {canManage && (
        <div className="glass border border-border/40 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck size={13} className="text-brand-green" />
            <CodeText as="p">assign co-organizer</CodeText>
          </div>
          <AddOrganizerForm
            hackathonId={hackathonId}
            onSuccess={() => router.refresh()}
          />
          <p className="  text-xs text-muted-foreground">
            Co-organizers can manage participants but cannot edit or delete the
            hackathon.
          </p>
        </div>
      )}

      {/* Table */}
      {coOrganizers.length === 0 ? (
        <div className="glass border border-border/40 p-12 text-center">
          <p className="  text-xs text-muted-foreground">
            No co-organizers assigned yet.
          </p>
        </div>
      ) : (
        <div className="glass border border-border/40 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead
                    scope="col"
                    className="  text-xs text-muted-foreground tracking-widest h-10"
                  >
                    USER
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="  text-xs text-muted-foreground tracking-widest h-10 hidden md:table-cell"
                  >
                    EMAIL
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="  text-xs text-muted-foreground tracking-widest h-10 hidden sm:table-cell"
                  >
                    ADDED BY
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="  text-xs text-muted-foreground tracking-widest h-10 hidden lg:table-cell"
                  >
                    DATE
                  </TableHead>
                  {canManage && (
                    <TableHead
                      scope="col"
                      className="  text-xs text-muted-foreground tracking-widest h-10"
                    >
                      ACTIONS
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {coOrganizers.map((coOrg, i) => (
                  <motion.tr
                    key={coOrg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.22,
                      ease: "easeOut",
                    }}
                    className="border-b border-border/40 last:border-0"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {coOrg.user.image ? (
                          <Image
                            src={coOrg.user.image}
                            alt={coOrg.user.name ?? coOrg.user.username}
                            width={24}
                            height={24}
                            className="rounded-full shrink-0"
                            sizes="24px"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-border shrink-0 flex items-center justify-center   text-[10px] text-muted-foreground">
                            {coOrg.user.username[0]?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="  text-xs text-foreground">
                            {coOrg.user.name ?? coOrg.user.username}
                          </p>
                          <p className="  text-xs text-muted-foreground">
                            @{coOrg.user.username}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="  text-xs text-muted-foreground hidden md:table-cell">
                      {coOrg.user.email}
                    </TableCell>
                    <TableCell className="  text-xs text-muted-foreground hidden sm:table-cell">
                      @{coOrg.addedBy.username}
                    </TableCell>
                    <TableCell className="  text-xs text-muted-foreground hidden lg:table-cell">
                      {format(new Date(coOrg.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    {canManage && (
                      <TableCell>
                        <RemoveOrganizerButton
                          hackathonId={hackathonId}
                          coOrgId={coOrg.id}
                          username={coOrg.user.username}
                        />
                      </TableCell>
                    )}
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
