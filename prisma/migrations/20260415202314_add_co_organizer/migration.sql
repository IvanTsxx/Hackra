-- CreateEnum
CREATE TYPE "CoOrganizerRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "co_organizer_request" (
    "id" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT,
    "status" "CoOrganizerRequestStatus" NOT NULL DEFAULT 'PENDING',
    "responseMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "co_organizer_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "co_organizer_request_hackathonId_idx" ON "co_organizer_request"("hackathonId");

-- CreateIndex
CREATE INDEX "co_organizer_request_userId_idx" ON "co_organizer_request"("userId");

-- CreateIndex
CREATE INDEX "co_organizer_request_status_idx" ON "co_organizer_request"("status");

-- CreateIndex
CREATE UNIQUE INDEX "co_organizer_request_hackathonId_userId_key" ON "co_organizer_request"("hackathonId", "userId");
