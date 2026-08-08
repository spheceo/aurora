"use server";

import {
  type AccountStatus,
  type ApprovalAction,
  accountMembers,
  accounts,
  approvalEvents,
  eq,
  getDb,
} from "@aurora/db";
import { sendAccountDecisionEmail } from "@aurora/email";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";

const decisions = {
  approve: { status: "approved", event: "approved" },
  reject: { status: "rejected", event: "rejected" },
  suspend: { status: "suspended", event: "suspended" },
  reinstate: { status: "approved", event: "reinstated" },
} as const satisfies Record<
  string,
  { status: AccountStatus; event: ApprovalAction }
>;

export async function updateAccountStatus(formData: FormData) {
  const staff = await requireStaff();
  const accountId = String(formData.get("accountId") || "");
  const decisionName = String(formData.get("decision") || "");
  const reason = String(formData.get("reason") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const decision = decisions[decisionName as keyof typeof decisions];

  if (!accountId || !decision) {
    throw new Error("Invalid account decision");
  }
  if ((decisionName === "reject" || decisionName === "suspend") && !reason) {
    throw new Error("A reason is required for this decision");
  }

  const db = getDb();
  await db.transaction(async (tx) => {
    const now = new Date();
    await tx
      .update(accounts)
      .set({
        status: decision.status,
        approvedAt: decision.status === "approved" ? now : null,
        approvedBy: decision.status === "approved" ? staff.email : null,
        notes: notes || null,
        updatedAt: now,
      })
      .where(eq(accounts.id, accountId));

    await tx.insert(approvalEvents).values({
      accountId,
      actorEmail: staff.email,
      action: decision.event,
      reason: reason || null,
    });
  });

  if (decisionName === "approve" || decisionName === "reject") {
    const [recipient] = await db
      .select({
        email: accountMembers.email,
        companyName: accounts.companyName,
      })
      .from(accountMembers)
      .innerJoin(accounts, eq(accountMembers.accountId, accounts.id))
      .where(eq(accountMembers.accountId, accountId))
      .orderBy(accountMembers.createdAt)
      .limit(1);

    if (recipient) {
      await sendAccountDecisionEmail({
        to: recipient.email,
        companyName: recipient.companyName,
        status: decisionName === "approve" ? "approved" : "rejected",
        reason,
      }).catch((error) => {
        console.error("Account updated, but the decision email failed", error);
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/accounts");
  revalidatePath(`/accounts/${accountId}`);
}
