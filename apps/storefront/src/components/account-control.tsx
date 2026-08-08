"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFileText, FiLogOut, FiUser } from "react-icons/fi";
import { signOutFromStorefront } from "@/lib/auth/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/custom-dropdown";

type AccountSession = {
  authenticated: boolean;
  authConfigured: boolean;
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    profilePictureUrl?: string | null;
  };
  account?: {
    status: "pending" | "approved" | "rejected" | "suspended";
  } | null;
};

const statusLabels = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Not approved",
  suspended: "Suspended",
} as const;

export default function AccountControl({
  tone = "dark",
}: {
  tone?: "light" | "dark";
}) {
  const router = useRouter();
  const [session, setSession] = useState<AccountSession | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/account/session", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => response.json() as Promise<AccountSession>)
      .then(setSession)
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  const controlClass =
    tone === "light"
      ? "text-white border-white/45 hover:bg-white/10"
      : "text-foreground border-foreground/30 hover:bg-secondary";

  if (!session?.authenticated || !session.user) {
    return (
      <Link
        href="/account/sign-in"
        className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors ${controlClass}`}
        aria-label={session ? "Sign in" : "Loading account"}
        title="Sign in"
      >
        <FiUser className="size-4" aria-hidden="true" />
      </Link>
    );
  }

  const { user } = session;
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  const accountHref = session.account
    ? session.account.status === "approved"
      ? "/account/profile"
      : "/account/pending"
    : "/account/apply";
  const accountLabel = session.account
    ? statusLabels[session.account.status]
    : "Apply for wholesale";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`relative inline-flex size-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#811A21] focus-visible:ring-offset-2 ${controlClass}`}
          aria-label={`Open account menu for ${displayName}`}
        >
          {user.profilePictureUrl ? (
            <Image
              src={user.profilePictureUrl}
              alt=""
              fill
              sizes="32px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <FiUser className="size-4" aria-hidden="true" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[min(18rem,calc(100vw-1rem))] rounded-none border-[#e7dede] bg-[#fffdfd] p-1 text-foreground shadow-xl"
      >
        <DropdownMenuLabel className="px-3 py-3">
          <span className="block truncate text-sm font-semibold">
            {displayName}
          </span>
          <span className="mt-0.5 block truncate text-xs font-normal text-[#8a7678]">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#e7dede]" />
        <DropdownMenuItem onClick={() => router.push("/account/profile")}>
          <FiUser /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(accountHref)}>
          <FiFileText />
          <span className="flex flex-1 items-center justify-between gap-3">
            Wholesale account
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#811A21]">
              {accountLabel}
            </span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#e7dede]" />
        <form action={signOutFromStorefront}>
          <DropdownMenuItem type="submit" className="text-[#811A21]">
            <FiLogOut /> Sign out
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
