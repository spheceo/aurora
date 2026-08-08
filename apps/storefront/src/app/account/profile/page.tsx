import { withAuth } from "@workos-inc/authkit-nextjs";
import Image from "next/image";
import Link from "next/link";
import { FiFileText, FiShoppingBag } from "react-icons/fi";
import { signOutFromStorefront } from "@/lib/auth/actions";
import { getPricingAccess } from "@/lib/auth/pricing";

const statusLabels = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Not approved",
  suspended: "Suspended",
} as const;

export default async function ProfilePage() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const access = await getPricingAccess();
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  const accountHref = access.status
    ? access.status === "approved"
      ? "/shop"
      : "/account/pending"
    : "/account/apply";

  return (
    <main className="min-h-dvh bg-[#faf8f8] px-4 py-12 md:py-20">
      <div className="mx-auto max-w-2xl border border-[#e7dede] bg-[#fffdfd]">
        <header className="flex items-center gap-4 border-b border-[#e7dede] p-6 md:p-8">
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d8c8ca] bg-[#faf8f8] text-xl font-medium text-[#811A21]">
            {user.profilePictureUrl ? (
              <Image
                src={user.profilePictureUrl}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            ) : (
              displayName.slice(0, 1).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#811A21]">
              Your profile
            </p>
            <h1 className="mt-1 truncate text-2xl font-medium">
              {displayName}
            </h1>
            <p className="mt-1 truncate text-sm text-[#8a7678]">{user.email}</p>
          </div>
        </header>

        <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
          <Link
            href={accountHref}
            className="border border-[#e7dede] p-5 transition-colors hover:bg-[#faf8f8]"
          >
            <FiFileText className="size-5 text-[#811A21]" />
            <p className="mt-4 text-xs font-semibold tracking-widest uppercase">
              Wholesale account
            </p>
            <p className="mt-2 text-sm text-[#8a7678]">
              {access.status
                ? statusLabels[access.status]
                : "Start your wholesale application"}
            </p>
          </Link>
          <Link
            href="/shop"
            className="border border-[#e7dede] p-5 transition-colors hover:bg-[#faf8f8]"
          >
            <FiShoppingBag className="size-5 text-[#811A21]" />
            <p className="mt-4 text-xs font-semibold tracking-widest uppercase">
              Browse catalogue
            </p>
            <p className="mt-2 text-sm text-[#8a7678]">
              View the latest Aurora collection
            </p>
          </Link>
        </div>

        <footer className="flex items-center justify-between border-t border-[#e7dede] p-6 md:px-8">
          <Link href="/" className="text-xs underline underline-offset-4">
            Return home
          </Link>
          <form action={signOutFromStorefront}>
            <button
              type="submit"
              className="text-xs font-semibold tracking-widest uppercase text-[#811A21]"
            >
              Sign out
            </button>
          </form>
        </footer>
      </div>
    </main>
  );
}
