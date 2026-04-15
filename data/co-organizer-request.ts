import "server-only";
import { CoOrganizerRequestStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/shared/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CoOrganizerRequestDTO {
  id: string;
  hackathonId: string;
  userId: string;
  message: string | null;
  status: CoOrganizerRequestStatus;
  responseMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  respondedAt: Date | null;
  user: {
    id: string;
    name: string | null;
    username: string;
    email: string;
    image: string | null;
  };
  hackathon: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface MyRequestDTO {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  hackathonSlug: string;
  message: string | null;
  status: CoOrganizerRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Get all pending requests for a hackathon (for the organizer)
 */
export async function getPendingRequestsForHackathon(
  hackathonId: string,
  requesterId: string,
  requesterRole: string
): Promise<CoOrganizerRequestDTO[]> {
  // Only organizer can view requests
  if (requesterRole !== "ADMIN") {
    const hackathon = await prisma.hackathon.findUnique({
      select: { organizerId: true },
      where: { id: hackathonId },
    });
    if (!hackathon || hackathon.organizerId !== requesterId) {
      throw new Error("Unauthorized");
    }
  }

  return prisma.coOrganizerRequest.findMany({
    include: {
      hackathon: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
      user: {
        select: {
          email: true,
          id: true,
          image: true,
          name: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
    where: {
      hackathonId,
      status: CoOrganizerRequestStatus.PENDING,
    },
  });
}

/**
 * Get request count for a hackathon (for badge display)
 */
export function getPendingRequestCount(hackathonId: string): Promise<number> {
  return prisma.coOrganizerRequest.count({
    where: {
      hackathonId,
      status: CoOrganizerRequestStatus.PENDING,
    },
  });
}

/**
 * Get all requests made by the current user
 */
export async function getMyRequests(userId: string): Promise<MyRequestDTO[]> {
  const requests = await prisma.coOrganizerRequest.findMany({
    include: {
      hackathon: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    where: { userId },
  });

  return requests.map((r) => ({
    createdAt: r.createdAt,
    hackathonId: r.hackathonId,
    hackathonSlug: r.hackathon.slug,
    hackathonTitle: r.hackathon.title,
    id: r.id,
    message: r.message,
    status: r.status,
    updatedAt: r.updatedAt,
  }));
}

/**
 * Get a single request by ID
 */
export function getRequestById(
  requestId: string
): Promise<CoOrganizerRequestDTO | null> {
  return prisma.coOrganizerRequest.findUnique({
    include: {
      hackathon: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
      user: {
        select: {
          email: true,
          id: true,
          image: true,
          name: true,
          username: true,
        },
      },
    },
    where: { id: requestId },
  });
}

/**
 * Get request by user and hackathon
 */
export async function getUserRequestForHackathon(
  userId: string,
  hackathonId: string
): Promise<CoOrganizerRequestDTO | null> {
  return await prisma.coOrganizerRequest.findUnique({
    include: {
      hackathon: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
      user: {
        select: {
          email: true,
          id: true,
          image: true,
          name: true,
          username: true,
        },
      },
    },
    where: {
      hackathonId_userId: {
        hackathonId,
        userId,
      },
    },
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Create a new co-organizer request
 */
export async function createRequest(
  userId: string,
  hackathonId: string,
  message?: string
): Promise<CoOrganizerRequestDTO> {
  // Check if user is already a co-organizer
  const existingCoOrg = await prisma.hackathonOrganizer.findUnique({
    where: {
      hackathonId_userId: {
        hackathonId,
        userId,
      },
    },
  });

  if (existingCoOrg) {
    throw new Error("You are already a co-organizer of this hackathon");
  }

  // Check if request already exists
  const existingRequest = await prisma.coOrganizerRequest.findUnique({
    where: {
      hackathonId_userId: {
        hackathonId,
        userId,
      },
    },
  });

  if (existingRequest) {
    if (existingRequest.status === CoOrganizerRequestStatus.PENDING) {
      throw new Error("You already have a pending request");
    }
    // If previous request was rejected, update it instead of creating new
    if (existingRequest.status === CoOrganizerRequestStatus.REJECTED) {
      const updated = await prisma.coOrganizerRequest.update({
        data: {
          message: message ?? null,
          respondedAt: null,
          responseMessage: null,
          status: CoOrganizerRequestStatus.PENDING,
        },
        include: {
          hackathon: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
          user: {
            select: {
              email: true,
              id: true,
              image: true,
              name: true,
              username: true,
            },
          },
        },
        where: { id: existingRequest.id },
      });
      return updated;
    }
    // If accepted, cannot create another
    throw new Error("You are already a co-organizer of this hackathon");
  }

  return prisma.coOrganizerRequest.create({
    data: {
      hackathonId,
      message: message ?? null,
      userId,
    },
    include: {
      hackathon: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
      user: {
        select: {
          email: true,
          id: true,
          image: true,
          name: true,
          username: true,
        },
      },
    },
  });
}

/**
 * Update a pending request (only the requester can update their own request)
 */
export async function updateRequest(
  requestId: string,
  userId: string,
  message: string
): Promise<CoOrganizerRequestDTO> {
  const existing = await prisma.coOrganizerRequest.findUnique({
    where: { id: requestId },
  });

  if (!existing) {
    throw new Error("Request not found");
  }

  if (existing.userId !== userId) {
    throw new Error("Unauthorized");
  }

  if (existing.status !== CoOrganizerRequestStatus.PENDING) {
    throw new Error("Cannot update a non-pending request");
  }

  return prisma.coOrganizerRequest.update({
    data: { message },
    include: {
      hackathon: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
      user: {
        select: {
          email: true,
          id: true,
          image: true,
          name: true,
          username: true,
        },
      },
    },
    where: { id: requestId },
  });
}

/**
 * Accept or reject a request (only the organizer can respond)
 */
export async function respondToRequest(
  requestId: string,
  organizerId: string,
  accept: boolean,
  responseMessage?: string
): Promise<CoOrganizerRequestDTO> {
  const existing = await prisma.coOrganizerRequest.findUnique({
    include: {
      hackathon: {
        select: { organizerId: true },
      },
    },
    where: { id: requestId },
  });

  if (!existing) {
    throw new Error("Request not found");
  }

  if (existing.hackathon.organizerId !== organizerId) {
    throw new Error(
      "Unauthorized: only the hackathon organizer can respond to requests"
    );
  }

  if (existing.status !== CoOrganizerRequestStatus.PENDING) {
    throw new Error("Request has already been processed");
  }

  if (accept) {
    // Add user as co-organizer
    await prisma.hackathonOrganizer.create({
      data: {
        addedById: organizerId,
        hackathonId: existing.hackathonId,
        userId: existing.userId,
      },
    });
  }

  return prisma.coOrganizerRequest.update({
    data: {
      respondedAt: new Date(),
      responseMessage: responseMessage ?? null,
      status: accept
        ? CoOrganizerRequestStatus.ACCEPTED
        : CoOrganizerRequestStatus.REJECTED,
    },
    include: {
      hackathon: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
      user: {
        select: {
          email: true,
          id: true,
          image: true,
          name: true,
          username: true,
        },
      },
    },
    where: { id: requestId },
  });
}
