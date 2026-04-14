/*
  Warnings:

  - You are about to drop the column `themeBg` on the `hackathon` table. All the data in the column will be lost.
  - You are about to drop the column `themeGradient` on the `hackathon` table. All the data in the column will be lost.
  - You are about to drop the column `themeStyle` on the `hackathon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "hackathon" DROP COLUMN "themeBg",
DROP COLUMN "themeGradient",
DROP COLUMN "themeStyle",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "hackathon_latitude_longitude_idx" ON "hackathon"("latitude", "longitude");
