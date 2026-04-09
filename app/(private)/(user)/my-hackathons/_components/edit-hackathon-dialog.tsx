// oxlint-disable react/no-children-prop
"use client";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { editHackathonAction } from "../_actions";

// ─── Types ───────────────────────────────────────────────────────────────────

interface HackathonDTO {
  id: string;
  title: string;
  description: string;
  image: string | null;
  startDate: Date;
  endDate: Date;
  location: string;
  locationMode: string;
  isOnline: boolean;
  tags: string[];
  techs: string[];
  maxParticipants: number | null;
  maxTeamSize: number;
  status: string;
}

interface EditHackathonDialogProps {
  hackathon: HackathonDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// ─── Form Schema ─────────────────────────────────────────────────────────────

// Form-specific schema using z.date() (not coerce) since the form works with Date objects.
// The server schema uses z.coerce.date() for serialized data; we transform in onSubmit.
const formSchema = z
  .object({
    description: z
      .string()
      .min(10, "Description must be at least 10 characters."),
    endDate: z.date(),
    id: z.string(),
    image: z.string().url("Must be a valid URL.").nullable().optional(),
    isOnline: z.boolean(),
    location: z.string().min(1, "Location is required."),
    locationMode: z.enum(["online", "in_person", "hybrid"]),
    maxParticipants: z.number().positive().nullable().optional(),
    maxTeamSize: z
      .number()
      .int()
      .positive("Max team size must be a positive integer."),
    startDate: z.date(),
    status: z.enum(["DRAFT", "UPCOMING", "ENDED", "CANCELLED"]),
    tags: z.array(z.string()),
    techs: z.array(z.string()),
    title: z.string().min(5, "Title must be at least 5 characters."),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date.",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof formSchema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDefaultValues(hackathon: HackathonDTO): FormValues {
  return {
    description: hackathon.description,
    endDate: hackathon.endDate,
    id: hackathon.id,
    image: hackathon.image ?? null,
    isOnline: hackathon.isOnline,
    location: hackathon.location,
    locationMode: hackathon.locationMode as "online" | "in_person" | "hybrid",
    maxParticipants: hackathon.maxParticipants,
    maxTeamSize: hackathon.maxTeamSize,
    startDate: hackathon.startDate,
    status: hackathon.status as "DRAFT" | "UPCOMING" | "ENDED" | "CANCELLED",
    tags: hackathon.tags,
    techs: hackathon.techs,
    title: hackathon.title,
  };
}

const LOCATION_OPTIONS = [
  { label: "Online", value: "online" },
  { label: "In Person", value: "in_person" },
  { label: "Hybrid", value: "hybrid" },
] as const;

const STATUS_OPTIONS = [
  { label: "Draft", value: "DRAFT" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Ended", value: "ENDED" },
  { label: "Cancelled", value: "CANCELLED" },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export function EditHackathonDialog({
  hackathon,
  open,
  onOpenChange,
  onSuccess,
}: EditHackathonDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: getDefaultValues(hackathon),
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const { startDate, endDate, ...rest } = value;
        const serverPayload = {
          ...rest,
          endDate: endDate.toISOString(),
          startDate: startDate.toISOString(),
        };

        await toast.promise(editHackathonAction(serverPayload), {
          error: (err: { error?: string }) =>
            err?.error ?? "Failed to update hackathon.",
          loading: "Updating hackathon...",
          success: (result) => {
            if (result.success) {
              onOpenChange(false);
              onSuccess?.();
              return "Hackathon updated successfully!";
            }
            throw new Error(result.error);
          },
        });
      } catch {
        // toast.promise already handles the error toast
      } finally {
        setIsSubmitting(false);
      }
    },
    validators: { onSubmit: formSchema },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Hackathon</DialogTitle>
          <DialogDescription>
            Update the details of your hackathon.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            {/* Title */}
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Description */}
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={4}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Image URL */}
            <form.Field
              name="image"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Cover Image URL
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value || null)
                      }
                      placeholder="https://example.com/image.png"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Start Date */}
            <form.Field
              name="startDate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start"
                          />
                        }
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.state.value
                          ? format(field.state.value, "MMM d, yyyy")
                          : "Pick a date"}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={(date) => {
                            if (date) field.handleChange(date);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* End Date */}
            <form.Field
              name="endDate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>End Date</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start"
                          />
                        }
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.state.value
                          ? format(field.state.value, "MMM d, yyyy")
                          : "Pick a date"}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={(date) => {
                            if (date) field.handleChange(date);
                          }}
                          disabled={(date) =>
                            date <
                            (form.getFieldValue("startDate") ?? new Date())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Location */}
            <form.Field
              name="location"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="San Francisco, CA"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Location Mode */}
            <form.Field
              name="locationMode"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Location Mode</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => {
                        if (val) field.handleChange(val);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATION_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Is Online */}
            <form.Field
              name="isOnline"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field
                    data-invalid={isInvalid}
                    className="flex-row items-center justify-between"
                  >
                    <FieldLabel htmlFor={field.name}>Online Event</FieldLabel>
                    <Switch
                      id={field.name}
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Tags */}
            <form.Field
              name="tags"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Tags (comma-separated)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value.join(", ")}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder="Frontend, AI, Web3"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Techs */}
            <form.Field
              name="techs"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Technologies (comma-separated)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value.join(", ")}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder="Next.js, React, TypeScript"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Max Participants */}
            <form.Field
              name="maxParticipants"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Max Participants (optional)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      placeholder="500"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Max Team Size */}
            <form.Field
              name="maxTeamSize"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Max Team Size</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      placeholder="4"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Status */}
            <form.Field
              name="status"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => {
                        if (val) field.handleChange(val);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => state.canSubmit}
              children={(canSubmit) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
