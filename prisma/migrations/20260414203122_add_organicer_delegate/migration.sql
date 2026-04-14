-- CreateTable
CREATE TABLE "hackathon_organizer" (
    "id" TEXT NOT NULL,
    "hackathonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hackathon_organizer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hackathon_organizer_hackathonId_idx" ON "hackathon_organizer"("hackathonId");

-- CreateIndex
CREATE INDEX "hackathon_organizer_userId_idx" ON "hackathon_organizer"("userId");

-- CreateIndex
CREATE INDEX "hackathon_organizer_addedById_idx" ON "hackathon_organizer"("addedById");

-- CreateIndex
CREATE UNIQUE INDEX "hackathon_organizer_hackathonId_userId_key" ON "hackathon_organizer"("hackathonId", "userId");
