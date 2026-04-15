-- CreateEnum
CREATE TYPE "CertificateRole" AS ENUM ('PARTICIPANT', 'ORGANIZER', 'CO_ORGANIZER', 'MENTOR', 'JUDGE', 'WINNER', 'FIRST_PLACE', 'SECOND_PLACE', 'THIRD_PLACE');

-- CreateTable
CREATE TABLE "certificate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "place" TEXT,
    "token" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificate_token_key" ON "certificate"("token");

-- CreateIndex
CREATE INDEX "certificate_userId_idx" ON "certificate"("userId");

-- CreateIndex
CREATE INDEX "certificate_hackathonId_idx" ON "certificate"("hackathonId");

-- CreateIndex
CREATE INDEX "certificate_token_idx" ON "certificate"("token");

-- CreateIndex
CREATE UNIQUE INDEX "certificate_userId_hackathonId_key" ON "certificate"("userId", "hackathonId");
