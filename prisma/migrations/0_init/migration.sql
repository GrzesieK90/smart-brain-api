-- CreateTable
CREATE TABLE "login" (
    "id" SERIAL NOT NULL,
    "hash" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "email" TEXT NOT NULL,
    "entries" BIGINT DEFAULT 0,
    "joined" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "login_email_key" ON "login"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

