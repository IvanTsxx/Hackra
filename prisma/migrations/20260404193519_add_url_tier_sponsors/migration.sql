/*
  Warnings:

  - Added the required column `tier` to the `Sponsor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Sponsor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('PLATINUM', 'GOLD', 'SILVER', 'BRONZE');

-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN     "tier" "Tier" NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
