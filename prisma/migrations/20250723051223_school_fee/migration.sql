-- CreateEnum
CREATE TYPE "Major" AS ENUM ('RPL', 'TKJ');

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "NoInduk" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "generation" INTEGER NOT NULL,
    "class" INTEGER NOT NULL,
    "Major" "Major" NOT NULL DEFAULT 'RPL',
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentPayment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "feeItemId" TEXT NOT NULL,
    "amountPaid" DECIMAL(65,30) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "transactionNo" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_NoInduk_key" ON "student"("NoInduk");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPayment" ADD CONSTRAINT "StudentPayment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPayment" ADD CONSTRAINT "StudentPayment_feeItemId_fkey" FOREIGN KEY ("feeItemId") REFERENCES "SchoolFeeItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
