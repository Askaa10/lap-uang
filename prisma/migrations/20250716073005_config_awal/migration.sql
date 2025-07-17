-- CreateTable
CREATE TABLE "Uang" (
    "name" TEXT NOT NULL,
    "class" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Uang_name_key" ON "Uang"("name");
