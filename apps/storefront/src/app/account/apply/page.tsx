import { accountMembers, accounts, eq, getDb } from "@aurora/db";
import { withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ApplicationForm } from "./application-form";

export default async function WholesaleApplicationPage() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const [membership] = await getDb()
    .select({ status: accounts.status })
    .from(accountMembers)
    .innerJoin(accounts, eq(accountMembers.accountId, accounts.id))
    .where(eq(accountMembers.workosUserId, user.id))
    .limit(1);

  if (membership) {
    redirect(membership.status === "approved" ? "/shop" : "/account/pending");
  }

  return (
    <main className="min-h-dvh bg-[#faf8f8] px-4 py-12 md:py-20">
      <div className="mx-auto max-w-2xl border border-[#e7dede] bg-[#fffdfd] p-6 md:p-10">
        <p className="mb-3 text-[10px] font-semibold tracking-widest uppercase text-[#811A21]">
          Aurora wholesale
        </p>
        <h1 className="text-3xl font-medium md:text-4xl">
          Apply for trade access
        </h1>
        <p className="mt-4 mb-8 max-w-xl text-sm leading-6 text-[#8a7678]">
          Wholesale pricing is available to approved businesses. Approval
          applies to your company email domain, so colleagues can join the same
          account later.
        </p>
        <ApplicationForm />
        <Link
          href="/shop"
          className="mt-6 inline-block text-xs underline underline-offset-4"
        >
          Return to the public catalogue
        </Link>
      </div>
    </main>
  );
}
