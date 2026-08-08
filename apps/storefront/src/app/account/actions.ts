"use server";

import {
  accountMembers,
  accounts,
  approvalEvents,
  eq,
  getDb,
} from "@aurora/db";
import { getWorkOS, withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const applicationSchema = z.object({
  companyName: z.string().trim().min(2, "Enter your company name"),
  registrationNumber: z.string().trim().min(2, "Enter a registration number"),
  vatNumber: z.string().trim().optional(),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
});

export type ApplicationState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function getEmailDomain(email: string) {
  const [, domain] = email.trim().toLowerCase().split("@");
  if (!domain) {
    throw new Error("The signed-in user does not have a valid email address");
  }
  return domain;
}

export async function applyForWholesale(
  _state: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const { user } = await withAuth({ ensureSignedIn: true });
  const parsed = applicationSchema.safeParse({
    companyName: formData.get("companyName"),
    registrationNumber: formData.get("registrationNumber"),
    vatNumber: formData.get("vatNumber"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      error: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const db = getDb();
  const emailDomain = getEmailDomain(user.email);
  const [existingMembership] = await db
    .select({ status: accounts.status })
    .from(accountMembers)
    .innerJoin(accounts, eq(accountMembers.accountId, accounts.id))
    .where(eq(accountMembers.workosUserId, user.id))
    .limit(1);

  if (existingMembership) {
    redirect(
      existingMembership.status === "approved" ? "/shop" : "/account/pending",
    );
  }

  const [domainAccount] = await db
    .select({
      id: accounts.id,
      status: accounts.status,
      workosOrganizationId: accounts.workosOrganizationId,
    })
    .from(accounts)
    .where(eq(accounts.emailDomain, emailDomain))
    .limit(1);

  const workos = getWorkOS();

  if (domainAccount) {
    let organizationMembershipId: string | undefined;
    try {
      const existingWorkosMemberships =
        await workos.userManagement.listOrganizationMemberships({
          userId: user.id,
          organizationId: domainAccount.workosOrganizationId,
        });

      if (existingWorkosMemberships.data.length === 0) {
        const organizationMembership =
          await workos.userManagement.createOrganizationMembership({
            organizationId: domainAccount.workosOrganizationId,
            userId: user.id,
          });
        organizationMembershipId = organizationMembership.id;
      }

      await db.insert(accountMembers).values({
        accountId: domainAccount.id,
        workosUserId: user.id,
        email: user.email.toLowerCase(),
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        role: "buyer",
      });
    } catch (error) {
      if (organizationMembershipId) {
        await workos.userManagement
          .deleteOrganizationMembership(organizationMembershipId)
          .catch(() => undefined);
      }
      console.error(
        "Unable to add the user to an existing wholesale account",
        error,
      );
      return {
        error: "We could not submit your application. Please try again.",
      };
    }

    redirect(
      domainAccount.status === "approved" ? "/shop" : "/account/pending",
    );
  }

  let organizationId: string | undefined;
  try {
    const organization = await workos.organizations.createOrganization(
      {
        name: parsed.data.companyName,
        externalId: `aurora-${user.id}`,
      },
      { idempotencyKey: `aurora-${user.id}` },
    );
    organizationId = organization.id;
    const createdOrganizationId = organization.id;

    await workos.userManagement.createOrganizationMembership({
      organizationId: createdOrganizationId,
      userId: user.id,
      roleSlug: "admin",
    });

    await db.transaction(async (tx) => {
      const [account] = await tx
        .insert(accounts)
        .values({
          workosOrganizationId: createdOrganizationId,
          companyName: parsed.data.companyName,
          emailDomain,
          registrationNumber: parsed.data.registrationNumber,
          vatNumber: parsed.data.vatNumber || null,
          phone: parsed.data.phone,
          status: "pending",
        })
        .returning({ id: accounts.id });

      await tx.insert(accountMembers).values({
        accountId: account.id,
        workosUserId: user.id,
        email: user.email.toLowerCase(),
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        role: "owner",
      });

      await tx.insert(approvalEvents).values({
        accountId: account.id,
        actorEmail: user.email.toLowerCase(),
        action: "submitted",
      });
    });
  } catch (error) {
    if (organizationId) {
      await workos.organizations
        .deleteOrganization(organizationId)
        .catch(() => undefined);
    }
    console.error("Unable to create a wholesale application", error);
    return { error: "We could not submit your application. Please try again." };
  }

  redirect("/account/pending");
}
