/*
  Warnings:

  - You are about to drop the column `npsn` on the `School` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nip]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `HeadSecretariat` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TA` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nip` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yayasan` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('REGISTRATION', 'REREGISTRATION', 'EVENT', 'EXAM', 'GRADUATION', 'OTHER');

-- DropIndex
DROP INDEX "School_npsn_key";

-- AlterTable
ALTER TABLE "School" DROP COLUMN "npsn",
ADD COLUMN     "HeadSecretariat" TEXT NOT NULL,
ADD COLUMN     "TA" TEXT NOT NULL,
ADD COLUMN     "nip" TEXT NOT NULL,
ADD COLUMN     "yayasan" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SchoolFeeItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(65,30),
    "type" "FeeType" NOT NULL DEFAULT 'EVENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "feeGroupId" TEXT,

    CONSTRAINT "SchoolFeeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_nip_key" ON "School"("nip");

-- AddForeignKey
ALTER TABLE "SchoolFeeItem" ADD CONSTRAINT "SchoolFeeItem_feeGroupId_fkey" FOREIGN KEY ("feeGroupId") REFERENCES "FeeGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
