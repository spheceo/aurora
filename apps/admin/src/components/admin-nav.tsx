import { signOut } from "@workos-inc/authkit-nextjs";
import { LayoutDashboard, LogOut, Users } from "lucide-react";
import Link from "next/link";

export function AdminNav({
  staffEmail,
  preview = false,
}: {
  staffEmail: string;
  preview?: boolean;
}) {
  return (
    <header className="border-b border-[#e7dede] bg-[#fffdfd]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-[#811A21]"
          >
            Aurora <span className="text-[#8a7678]">Wholesale</span>
          </Link>
          <nav
            className="hidden items-center gap-5 sm:flex"
            aria-label="Admin navigation"
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium hover:text-[#811A21]"
            >
              <LayoutDashboard className="size-4" /> Overview
            </Link>
            <Link
              href="/accounts"
              className="flex items-center gap-2 text-xs font-medium hover:text-[#811A21]"
            >
              <Users className="size-4" /> Accounts
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[#8a7678] md:inline">
            {staffEmail}
          </span>
          {preview ? null : (
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                aria-label="Sign out"
                className="p-2 text-[#8a7678] hover:text-[#811A21]"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
