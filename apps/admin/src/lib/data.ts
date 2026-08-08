import {
  type AccountStatus,
  accountMembers,
  accounts,
  and,
  approvalEvents,
  count,
  desc,
  eq,
  getDb,
  ilike,
  or,
} from "@aurora/db";
import { isAdminDevelopmentPreview } from "@/lib/config";

export async function getDashboardData() {
  if (isAdminDevelopmentPreview) {
    return {
      pendingCount: 0,
      approvedCount: 0,
      pendingAccounts: [],
      recentActivity: [],
    };
  }

  const db = getDb();
  const [pendingResult, approvedResult, pendingAccounts, recentActivity] =
    await Promise.all([
      db
        .select({ value: count() })
        .from(accounts)
        .where(eq(accounts.status, "pending")),
      db
        .select({ value: count() })
        .from(accounts)
        .where(eq(accounts.status, "approved")),
      db
        .select()
        .from(accounts)
        .where(eq(accounts.status, "pending"))
        .orderBy(accounts.createdAt)
        .limit(6),
      db
        .select({
          id: approvalEvents.id,
          accountId: approvalEvents.accountId,
          companyName: accounts.companyName,
          actorEmail: approvalEvents.actorEmail,
          action: approvalEvents.action,
          reason: approvalEvents.reason,
          createdAt: approvalEvents.createdAt,
        })
        .from(approvalEvents)
        .innerJoin(accounts, eq(approvalEvents.accountId, accounts.id))
        .orderBy(desc(approvalEvents.createdAt))
        .limit(8),
    ]);

  return {
    pendingCount: pendingResult[0]?.value ?? 0,
    approvedCount: approvedResult[0]?.value ?? 0,
    pendingAccounts,
    recentActivity,
  };
}

export async function listAccounts(filters: {
  search?: string;
  status?: AccountStatus;
}) {
  if (isAdminDevelopmentPreview) {
    return [];
  }

  const search = filters.search?.trim();
  const searchCondition = search
    ? or(
        ilike(accounts.companyName, `%${search}%`),
        ilike(accounts.emailDomain, `%${search}%`),
      )
    : undefined;
  const statusCondition = filters.status
    ? eq(accounts.status, filters.status)
    : undefined;
  const whereCondition =
    searchCondition && statusCondition
      ? and(searchCondition, statusCondition)
      : searchCondition || statusCondition;

  return getDb()
    .select({
      id: accounts.id,
      companyName: accounts.companyName,
      emailDomain: accounts.emailDomain,
      status: accounts.status,
      registrationNumber: accounts.registrationNumber,
      createdAt: accounts.createdAt,
      updatedAt: accounts.updatedAt,
    })
    .from(accounts)
    .where(whereCondition)
    .orderBy(desc(accounts.createdAt));
}

export async function getAccountDetails(id: string) {
  if (isAdminDevelopmentPreview) {
    return { account: null, members: [], events: [] };
  }

  const db = getDb();
  const [accountRows, members, events] = await Promise.all([
    db.select().from(accounts).where(eq(accounts.id, id)).limit(1),
    db
      .select()
      .from(accountMembers)
      .where(eq(accountMembers.accountId, id))
      .orderBy(accountMembers.createdAt),
    db
      .select()
      .from(approvalEvents)
      .where(eq(approvalEvents.accountId, id))
      .orderBy(desc(approvalEvents.createdAt)),
  ]);

  return { account: accountRows[0] ?? null, members, events };
}
