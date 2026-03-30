"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createHackathon } from "@/lib/actions/hackathons";

const createHackathonSchema = z.object({
  bgColor: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  endDate: z.string(),
  imageUrl: z.string().optional(),
  location: z.string().min(3, "Location must be at least 3 characters"),
  maxParticipants: z.number().min(1, "Must have at least 1 participant"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  startDate: z.string(),
  textColor: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
});

type CreateHackathonData = z.infer<typeof createHackathonSchema>;

export function CreateHackathonForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateHackathonData>({
    resolver: zodResolver(createHackathonSchema),
  });

  const onSubmit = async (data: CreateHackathonData) => {
    setIsLoading(true);
    try {
      const result = await createHackathon({
        bgColor: data.bgColor,
        description: data.description,
        endDate: new Date(data.endDate),
        imageUrl: data.imageUrl,
        location: data.location,
        maxParticipants: data.maxParticipants,
        slug: data.slug,
        startDate: new Date(data.startDate),
        textColor: data.textColor,
        title: data.title,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to create hackathon");
        return;
      }

      toast.success("Hackathon created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.log("[v0] Create hackathon error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Event Title</FieldLabel>
          <Input
            placeholder="Your Awesome Hackathon 2024"
            {...register("title")}
            disabled={isLoading}
          />
          {errors.title && (
            <FieldDescription className="text-destructive">
              {errors.title.message}
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea
            placeholder="Describe your hackathon event..."
            rows={4}
            {...register("description")}
            disabled={isLoading}
          />
          {errors.description && (
            <FieldDescription className="text-destructive">
              {errors.description.message}
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel>Slug</FieldLabel>
          <Input
            placeholder="awesome-hackathon-2024"
            {...register("slug")}
            disabled={isLoading}
          />
          {errors.slug && (
            <FieldDescription className="text-destructive">
              {errors.slug.message}
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel>Location</FieldLabel>
          <Input
            placeholder="San Francisco, CA"
            {...register("location")}
            disabled={isLoading}
          />
          {errors.location && (
            <FieldDescription className="text-destructive">
              {errors.location.message}
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Start Date</FieldLabel>
            <Input
              type="datetime-local"
              {...register("startDate")}
              disabled={isLoading}
            />
            {errors.startDate && (
              <FieldDescription className="text-destructive">
                {errors.startDate.message}
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>End Date</FieldLabel>
            <Input
              type="datetime-local"
              {...register("endDate")}
              disabled={isLoading}
            />
            {errors.endDate && (
              <FieldDescription className="text-destructive">
                {errors.endDate.message}
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>Max Participants</FieldLabel>
          <Input
            type="number"
            placeholder="100"
            {...register("maxParticipants", { valueAsNumber: true })}
            disabled={isLoading}
          />
          {errors.maxParticipants && (
            <FieldDescription className="text-destructive">
              {errors.maxParticipants.message}
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel>Image URL (optional)</FieldLabel>
          <Input
            placeholder="https://example.com/image.jpg"
            {...register("imageUrl")}
            disabled={isLoading}
          />
        </Field>
      </FieldGroup>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Background Color (optional)</FieldLabel>
            <Input
              type="color"
              {...register("bgColor")}
              disabled={isLoading}
              className="h-10"
            />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Text Color (optional)</FieldLabel>
            <Input
              type="color"
              {...register("textColor")}
              disabled={isLoading}
              className="h-10"
            />
          </Field>
        </FieldGroup>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Creating...
          </>
        ) : (
          "Create Hackathon"
        )}
      </Button>
    </form>
  );
}
