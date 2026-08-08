import {
  type AccountStatus,
  accountMembers,
  accounts,
  eq,
  getDb,
} from "@aurora/db";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { cache } from "react";
import { isWholesaleInfrastructureConfigured } from "./config";

export type PricingAccess = {
  approved: boolean;
  accountId?: string;
  status?: AccountStatus;
};

export const getPricingAccess = cache(async (): Promise<PricingAccess> => {
  if (!isWholesaleInfrastructureConfigured) {
    return { approved: false };
  }

  try {
    const { user } = await withAuth();
    if (!user) {
      return { approved: false };
    }

    const [membership] = await getDb()
      .select({
        accountId: accounts.id,
        status: accounts.status,
      })
      .from(accountMembers)
      .innerJoin(accounts, eq(accountMembers.accountId, accounts.id))
      .where(eq(accountMembers.workosUserId, user.id))
      .limit(1);

    if (!membership) {
      return { approved: false };
    }

    return {
      approved: membership.status === "approved",
      accountId: membership.accountId,
      status: membership.status,
    };
  } catch (error) {
    console.error("Unable to determine pricing access", error);
    return { approved: false };
  }
});
