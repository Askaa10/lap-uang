-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('ELECTRICITY', 'WATER', 'SALARY', 'MAINTENANCE', 'EVENT', 'OTHER');

-- CreateTable
CREATE TABLE "SchoolExpense" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "type" "ExpenseType" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "expenseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolExpense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SchoolExpense" ADD CONSTRAINT "SchoolExpense_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
