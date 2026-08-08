"use server";

import { signOut } from "@workos-inc/authkit-nextjs";
import { isWholesaleAuthConfigured } from "./config";

export async function signOutFromStorefront() {
  if (!isWholesaleAuthConfigured) return;
  await signOut({ returnTo: "/" });
}
