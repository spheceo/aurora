import { withAuth } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";
import { isWholesaleAuthConfigured } from "@/lib/auth/config";
import { getPricingAccess } from "@/lib/auth/pricing";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isWholesaleAuthConfigured) {
    return NextResponse.json(
      { authenticated: false, authConfigured: false },
      { headers: { "cache-control": "no-store" } },
    );
  }

  try {
    const { user } = await withAuth();
    if (!user) {
      return NextResponse.json(
        { authenticated: false, authConfigured: true },
        { headers: { "cache-control": "no-store" } },
      );
    }

    const access = await getPricingAccess();
    return NextResponse.json(
      {
        authenticated: true,
        authConfigured: true,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePictureUrl: user.profilePictureUrl,
        },
        account: access.status ? { status: access.status } : null,
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { authenticated: false, authConfigured: true },
      { headers: { "cache-control": "no-store" } },
    );
  }
}
