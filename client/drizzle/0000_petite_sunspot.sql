CREATE TYPE "public"."integration_types" AS ENUM('INSTAGRAM', 'TWITTER', 'FACEBOOK');--> statement-breakpoint
CREATE TYPE "public"."listeners" AS ENUM('SMARTAI', 'MESSAGE');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('IMAGE', 'CAROUSEL_ALBUM', 'TEXT');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('open', 'accepted', 'declined', 'deal', 'sold');--> statement-breakpoint
CREATE TYPE "public"."user_subscription_plan" AS ENUM('FREE', 'PREMIUM', 'ENTERPRISE');--> statement-breakpoint
CREATE TYPE "public"."trigger_types" AS ENUM('EVENT', 'ACTION', 'CONDITION');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authenticator" (
	"id" uuid PRIMARY KEY NOT NULL,
	"credential_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_account_id" text NOT NULL,
	"credential_public_key" text NOT NULL,
	"counter" integer NOT NULL,
	"credential_device_type" text NOT NULL,
	"credential_backed_up" boolean NOT NULL,
	"transports" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "automation" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text DEFAULT 'Untitled',
	"created_at" timestamp DEFAULT now(),
	"active" boolean DEFAULT false,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dms" (
	"id" uuid PRIMARY KEY NOT NULL,
	"automation_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"sender_id" uuid NOT NULL,
	"receiver" uuid NOT NULL,
	"message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integrations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" "integration_types" DEFAULT 'INSTAGRAM',
	"created_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp,
	"instagram_id" text,
	CONSTRAINT "integrations_token_unique" UNIQUE("token"),
	CONSTRAINT "integrations_instagram_id_unique" UNIQUE("instagram_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "keyword" (
	"id" uuid PRIMARY KEY NOT NULL,
	"word" text NOT NULL,
	"automation_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "listener" (
	"id" uuid PRIMARY KEY NOT NULL,
	"automation_id" uuid NOT NULL,
	"listener" "listeners" DEFAULT 'MESSAGE',
	"prompt" text NOT NULL,
	"comment_reply" text,
	"dm_count" integer DEFAULT 0,
	"comment_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" uuid PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"caption" text,
	"media" text NOT NULL,
	"media_type" "media_type" DEFAULT 'IMAGE',
	"automation_id" uuid NOT NULL,
	CONSTRAINT "post_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"plan" "user_subscription_plan" DEFAULT 'FREE',
	"customer_id" text,
	CONSTRAINT "subscription_customer_id_unique" UNIQUE("customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trigger" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" "trigger_types" NOT NULL,
	"automation_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text DEFAULT 'Anonymous' NOT NULL,
	"age" integer NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"location" text,
	"address" text,
	"phone_verified" boolean DEFAULT false,
	"onboarding_completed" boolean DEFAULT false,
	"shop_name" text,
	"shop_text_font" text,
	"shop_text_color" text,
	"banner" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_number_sessions" (
	"verification_number" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verification_number_sessions_user_id_created_at_pk" PRIMARY KEY("user_id","created_at")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "automation" ADD CONSTRAINT "automation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dms" ADD CONSTRAINT "dms_automation_id_automation_id_fk" FOREIGN KEY ("automation_id") REFERENCES "public"."automation"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dms" ADD CONSTRAINT "dms_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dms" ADD CONSTRAINT "dms_receiver_user_id_fk" FOREIGN KEY ("receiver") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integrations" ADD CONSTRAINT "integrations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "keyword" ADD CONSTRAINT "keyword_automation_id_automation_id_fk" FOREIGN KEY ("automation_id") REFERENCES "public"."automation"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listener" ADD CONSTRAINT "listener_automation_id_automation_id_fk" FOREIGN KEY ("automation_id") REFERENCES "public"."automation"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_automation_id_automation_id_fk" FOREIGN KEY ("automation_id") REFERENCES "public"."automation"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trigger" ADD CONSTRAINT "trigger_automation_id_automation_id_fk" FOREIGN KEY ("automation_id") REFERENCES "public"."automation"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verification_number_sessions" ADD CONSTRAINT "verification_number_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "authenticator_credential_id_key" ON "authenticator" USING btree ("credential_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "automation_keyword_unique" ON "keyword" USING btree ("automation_id","word");