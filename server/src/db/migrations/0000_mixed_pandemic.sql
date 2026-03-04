CREATE TYPE "public"."logType" AS ENUM(
	'STATUS_CHANGED',
	'PRIORITY_CHANGED',
	'ASSIGNEE_CHANGED',
	'COMMENT_ADDED',
	'COMMENT_DELETED',
	'ISSUE_CREATED'
);
--> statement-breakpoint
CREATE TYPE "public"."issueStatus" AS ENUM('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE');
--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('URGENT', 'HIGH', 'MEDIUM', 'LOW');
--> statement-breakpoint
CREATE TYPE "public"."notificationType" AS ENUM(
	'ISSUE_ASSIGNED',
	'COMMENT_ON_ISSUE',
	'MENTIONED',
	'INVITE_ACCEPTED'
);
--> statement-breakpoint
CREATE TYPE "public"."projectStatus" AS ENUM('Archived', 'Active');
--> statement-breakpoint
CREATE TYPE "public"."accountStatus" AS ENUM('DENIED', 'PENDING', 'SUCCESS');
--> statement-breakpoint
CREATE TYPE "public"."AuthType" AS ENUM('CREDENTIALS', 'GOOGLE', 'BOTH');
--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('ADMIN', 'MEMBER', 'VIEWER');
--> statement-breakpoint
CREATE TYPE "public"."tokenType" AS ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET');
--> statement-breakpoint
CREATE TABLE "activity-logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"issueId" uuid NOT NULL,
	"workspaceId" uuid NOT NULL,
	"actorId" uuid NOT NULL,
	"logType" "logType" DEFAULT 'ISSUE_CREATED' NOT NULL,
	"oldValue" text NOT NULL,
	"newValue" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"issueId" uuid NOT NULL,
	"authorId" uuid NOT NULL,
	"parentId" uuid,
	"text" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "issue-labels" (
	"issueId" uuid,
	"labelId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ID" PRIMARY KEY("issueId", "labelId")
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projectId" uuid,
	"workspaceId" uuid,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" "issueStatus" DEFAULT 'TODO',
	"priority" "priority" DEFAULT 'LOW',
	"assigneeId" uuid,
	"createdBy" uuid,
	"order" integer DEFAULT 0,
	"dueData" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspaceId" uuid,
	"name" varchar(255) NOT NULL,
	"color" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification-type" "notificationType" DEFAULT 'INVITE_ACCEPTED' NOT NULL,
	"message" text NOT NULL,
	"link" text NOT NULL,
	"isRead" boolean DEFAULT false,
	"userId" uuid,
	"workspaceId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspaceId" uuid,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"slug" varchar,
	"status" "projectStatus" DEFAULT 'Active' NOT NULL,
	"createdBy" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "verify_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"token-type" "tokenType" DEFAULT 'EMAIL_VERIFICATION' NOT NULL,
	"expiresAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "verify_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"authType" "AuthType" DEFAULT 'CREDENTIALS' NOT NULL,
	"status" "accountStatus" DEFAULT 'PENDING' NOT NULL,
	"email" varchar(255),
	"password" varchar(255),
	"img" varchar DEFAULT '',
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"workspaceId" uuid,
	"role" "Role" DEFAULT 'VIEWER' NOT NULL,
	"status" "accountStatus" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"img" varchar DEFAULT '',
	"ownerId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity-logs"
ADD CONSTRAINT "activity-logs_issueId_issues_id_fk" FOREIGN KEY ("issueId") REFERENCES "public"."issues"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "activity-logs"
ADD CONSTRAINT "activity-logs_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "activity-logs"
ADD CONSTRAINT "activity-logs_actorId_users_id_fk" FOREIGN KEY ("actorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "comments"
ADD CONSTRAINT "comments_issueId_issues_id_fk" FOREIGN KEY ("issueId") REFERENCES "public"."issues"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "comments"
ADD CONSTRAINT "comments_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "comments"
ADD CONSTRAINT "comments_parentId_comments_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "issue-labels"
ADD CONSTRAINT "issue-labels_issueId_issues_id_fk" FOREIGN KEY ("issueId") REFERENCES "public"."issues"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "issue-labels"
ADD CONSTRAINT "issue-labels_labelId_labels_id_fk" FOREIGN KEY ("labelId") REFERENCES "public"."labels"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "issues"
ADD CONSTRAINT "issues_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "issues"
ADD CONSTRAINT "issues_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "issues"
ADD CONSTRAINT "issues_assigneeId_users_id_fk" FOREIGN KEY ("assigneeId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "issues"
ADD CONSTRAINT "issues_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "labels"
ADD CONSTRAINT "labels_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "notifications"
ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "notifications"
ADD CONSTRAINT "notifications_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "projects"
ADD CONSTRAINT "projects_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "projects"
ADD CONSTRAINT "projects_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "verify_token"
ADD CONSTRAINT "verify_token_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "workspace_members"
ADD CONSTRAINT "workspace_members_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "workspace_members"
ADD CONSTRAINT "workspace_members_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "workspace"
ADD CONSTRAINT "workspace_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "comment_idx" ON "comments" USING btree ("id");
--> statement-breakpoint
CREATE INDEX "emailIdx" ON "users" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "nameIdx" ON "users" USING btree ("name");
--> statement-breakpoint
CREATE INDEX "WorkspaceIdx" ON "workspace" USING btree ("name");