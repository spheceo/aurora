import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const accountStatusEnum = pgEnum("account_status", [
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

export const accountMemberRoleEnum = pgEnum("account_member_role", [
  "owner",
  "buyer",
]);

export const approvalActionEnum = pgEnum("approval_action", [
  "submitted",
  "approved",
  "rejected",
  "suspended",
  "reinstated",
]);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workosOrganizationId: text("workos_organization_id").notNull().unique(),
    companyName: text("company_name").notNull(),
    emailDomain: text("email_domain").notNull(),
    registrationNumber: text("registration_number"),
    vatNumber: text("vat_number"),
    phone: text("phone"),
    status: accountStatusEnum("status").notNull().default("pending"),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    approvedBy: text("approved_by"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("accounts_email_domain_unique").on(table.emailDomain),
    index("accounts_status_idx").on(table.status),
  ],
);

export const accountMembers = pgTable(
  "account_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    workosUserId: text("workos_user_id").notNull(),
    email: text("email").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    role: accountMemberRoleEnum("role").notNull().default("buyer"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("account_members_workos_user_id_unique").on(table.workosUserId),
    index("account_members_account_id_idx").on(table.accountId),
  ],
);

export const approvalEvents = pgTable(
  "approval_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    actorEmail: text("actor_email").notNull(),
    action: approvalActionEnum("action").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("approval_events_account_id_idx").on(table.accountId)],
);

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type AccountMember = typeof accountMembers.$inferSelect;
export type ApprovalEvent = typeof approvalEvents.$inferSelect;
export type AccountStatus = (typeof accountStatusEnum.enumValues)[number];
export type ApprovalAction = (typeof approvalActionEnum.enumValues)[number];
