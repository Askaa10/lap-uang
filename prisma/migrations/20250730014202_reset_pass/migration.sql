-- CreateTable
CREATE TABLE "reset_password" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reset_password_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reset_password" ADD CONSTRAINT "reset_password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
