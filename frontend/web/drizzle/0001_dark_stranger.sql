ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_id_unique" UNIQUE("id");