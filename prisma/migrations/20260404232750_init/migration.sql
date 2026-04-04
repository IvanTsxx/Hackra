-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "hackathon" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "isReadOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "hackathon_source_idx" ON "hackathon"("source");

-- CreateIndex
CREATE INDEX "hackathon_externalId_idx" ON "hackathon"("externalId");

-- CreateIndex
CREATE INDEX "hackathon_externalUrl_idx" ON "hackathon"("externalUrl");
