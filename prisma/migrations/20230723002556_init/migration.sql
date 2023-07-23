-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phoneNumer" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "homeAddress" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumer_key" ON "User"("phoneNumer");
