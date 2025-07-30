/*
  Warnings:

  - Added the required column `foundation` to the `SchoolProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generation` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `major` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regisNumber` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Major" AS ENUM ('RPL', 'TKJ');

-- AlterTable
ALTER TABLE "SchoolProfile" ADD COLUMN     "foundation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "generation" INTEGER NOT NULL,
ADD COLUMN     "major" "Major" NOT NULL,
ADD COLUMN     "regisNumber" TEXT NOT NULL;
