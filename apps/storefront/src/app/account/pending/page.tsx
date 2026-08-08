import { accountMembers, accounts, eq, getDb } from "@aurora/db";
import { signOut, withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

const statusCopy = {
  pending: {
    title: "Your application is under review",
    body: "Aurora staff will review your company details. Pricing and checkout remain locked until approval.",
  },
  rejected: {
    title: "Your application was not approved",
    body: "Contact Aurora if your company details have changed or you would like to provide more information.",
  },
  suspended: {
    title: "Your wholesale access is suspended",
    body: "Pricing and checkout are currently unavailable for this company account. Contact Aurora for assistance.",
  },
} as const;

export default async function WholesalePendingPage() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const [membership] = await getDb()
    .select({ companyName: accounts.companyName, status: accounts.status })
    .from(accountMembers)
    .innerJoin(accounts, eq(accountMembers.accountId, accounts.id))
    .where(eq(accountMembers.workosUserId, user.id))
    .limit(1);

  if (!membership) redirect("/account/apply");
  if (membership.status === "approved") redirect("/shop");

  const copy = statusCopy[membership.status];

  return (
    <main className="flex min-h-dvh items-center bg-[#faf8f8] px-4 py-12">
      <div className="mx-auto w-full max-w-xl border border-[#e7dede] bg-[#fffdfd] p-8 md:p-12">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#811A21]">
          {membership.companyName}
        </p>
        <h1 className="mt-4 text-3xl font-medium">{copy.title}</h1>
        <p className="mt-4 text-sm leading-6 text-[#8a7678]">{copy.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="border border-[#d8c8ca] px-5 py-3 text-xs font-semibold tracking-widest uppercase"
          >
            Browse catalogue
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="px-5 py-3 text-xs font-semibold tracking-widest uppercase text-[#811A21]"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
