import { getWorkOS, withAuth } from "@workos-inc/authkit-nextjs";
import { cache } from "react";

export class StaffAuthorizationError extends Error {
  constructor() {
    super("Staff access is required");
    this.name = "StaffAuthorizationError";
  }
}

export const requireStaff = cache(async () => {
  const staffOrganizationId = process.env.WORKOS_STAFF_ORG_ID;
  if (!staffOrganizationId) {
    throw new Error("WORKOS_STAFF_ORG_ID is not configured");
  }

  const { user } = await withAuth({ ensureSignedIn: true });
  const memberships =
    await getWorkOS().userManagement.listOrganizationMemberships({
      userId: user.id,
      organizationId: staffOrganizationId,
      statuses: ["active"],
    });

  if (memberships.data.length === 0) {
    throw new StaffAuthorizationError();
  }

  return user;
});
