export const statusConfig: Record<
  string,
  { color: string; label: string; variant: string }
> = {
  ACCEPTED: {
    color: "text-brand-green",
    label: "ACCEPTED",
    variant: "status-live",
  },
  APPROVED: {
    color: "text-brand-green",
    label: "APPROVED",
    variant: "status-live",
  },
  PENDING: {
    color: "text-muted-foreground",
    label: "PENDING",
    variant: "status-upcoming",
  },
  REJECTED: {
    color: "text-destructive",
    label: "REJECTED",
    variant: "status-ended",
  },
};
