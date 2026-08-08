-- Auth.js adapter tables and one-time, hashed authentication tokens.
ALTER TABLE "User" ADD COLUMN "image" TEXT;
CREATE TABLE "Account" (
  "id" UUID NOT NULL, "userId" UUID NOT NULL, "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL, "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT, "access_token" TEXT, "expires_at" INTEGER,
  "token_type" TEXT, "scope" TEXT, "id_token" TEXT, "session_state" TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Session" (
  "id" UUID NOT NULL, "sessionToken" TEXT NOT NULL, "userId" UUID NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL, CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL, "token" TEXT NOT NULL, "expires" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "PasswordResetToken" (
  "id" UUID NOT NULL, "userId" UUID NOT NULL, "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "EmailVerificationToken" (
  "id" UUID NOT NULL, "userId" UUID NOT NULL, "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");
CREATE INDEX "EmailVerificationToken_expiresAt_idx" ON "EmailVerificationToken"("expiresAt");
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
