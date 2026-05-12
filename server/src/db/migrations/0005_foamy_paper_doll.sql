-- Drop the default first
ALTER TABLE "users"
ALTER COLUMN "lastWorkspaceId" DROP DEFAULT;
--> statement-breakpoint
-- Update empty strings to NULL
UPDATE "users"
SET "lastWorkspaceId" = NULL
WHERE "lastWorkspaceId" = ''
    OR "lastWorkspaceId" IS NULL;
--> statement-breakpoint
-- Convert the column to UUID
ALTER TABLE "users"
ALTER COLUMN "lastWorkspaceId" TYPE uuid USING "lastWorkspaceId"::uuid;
--> statement-breakpoint
-- Set proper default
ALTER TABLE "users"
ALTER COLUMN "lastWorkspaceId"
SET DEFAULT NULL;