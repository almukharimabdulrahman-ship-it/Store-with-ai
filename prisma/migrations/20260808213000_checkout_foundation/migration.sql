ALTER TABLE "Order" ADD COLUMN "checkoutToken" UUID;
ALTER TABLE "Order" ADD COLUMN "guestAccessTokenHash" TEXT;
UPDATE "Order" SET "checkoutToken" = gen_random_uuid() WHERE "checkoutToken" IS NULL;
ALTER TABLE "Order" ALTER COLUMN "checkoutToken" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "checkoutToken" SET DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX "Order_checkoutToken_key" ON "Order"("checkoutToken");
CREATE UNIQUE INDEX "Order_guestAccessTokenHash_key" ON "Order"("guestAccessTokenHash");
