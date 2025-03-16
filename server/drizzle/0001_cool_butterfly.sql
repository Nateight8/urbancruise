ALTER TABLE "user" RENAME COLUMN "adress" TO "address";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "shopname";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "shoptextfont";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "shoptextcolor";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "banner";