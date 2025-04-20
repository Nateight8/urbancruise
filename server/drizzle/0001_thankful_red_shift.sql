ALTER TABLE "conversation" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "conversation" CASCADE;--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_conversationId_unique";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "conversationId";