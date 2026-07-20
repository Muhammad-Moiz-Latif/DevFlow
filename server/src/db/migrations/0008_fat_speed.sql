ALTER TABLE "activity-logs" ALTER COLUMN "oldValue" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "activity-logs" ALTER COLUMN "newValue" DROP NOT NULL;