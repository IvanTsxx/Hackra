/*
  Warnings:

  - You are about to drop the column `technologies` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `Hackathon` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "HackathonStatus" AS ENUM ('DRAFT', 'UPCOMING', 'LIVE', 'ENDED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "technologies",
ADD COLUMN     "techs" TEXT[];

-- DropTable
DROP TABLE "Hackathon";

-- CreateTable
CREATE TABLE "hackathon" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "locationMode" TEXT NOT NULL DEFAULT 'in_person',
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "techs" TEXT[],
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "maxParticipants" INTEGER,
    "maxTeamSize" INTEGER NOT NULL,
    "themeBg" TEXT,
    "themeGradient" TEXT,
    "themeStyle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizerId" TEXT NOT NULL,
    "status" "HackathonStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "hackathon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hackathon_prize" (
    "id" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "hackathon_prize_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hackathon_slug_key" ON "hackathon"("slug");

-- CreateIndex
CREATE INDEX "hackathon_organizerId_idx" ON "hackathon"("organizerId");

-- CreateIndex
CREATE INDEX "hackathon_startDate_idx" ON "hackathon"("startDate");

-- CreateIndex
CREATE INDEX "hackathon_location_idx" ON "hackathon"("location");

-- CreateIndex
CREATE INDEX "hackathon_prize_hackathonId_idx" ON "hackathon_prize"("hackathonId");
