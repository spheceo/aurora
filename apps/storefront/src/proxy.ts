import { authkitProxy } from "@workos-inc/authkit-nextjs";
import { type NextRequest, NextResponse } from "next/server";
import {
  isWholesaleAuthConfigured,
  wholesaleRedirectUri,
} from "./lib/auth/config";

const storefrontProxy = isWholesaleAuthConfigured
  ? authkitProxy({ redirectUri: wholesaleRedirectUri })
  : (request: NextRequest) => {
      if (
        process.env.NODE_ENV === "development" &&
        request.nextUrl.pathname === "/account/sign-in"
      ) {
        return NextResponse.next();
      }

      if (
        request.nextUrl.pathname.startsWith("/account") ||
        request.nextUrl.pathname === "/callback"
      ) {
        return new NextResponse(
          "Wholesale sign-in is not configured. Add the Neon and WorkOS variables from apps/storefront/.env.example.",
          {
            status: 503,
            headers: { "content-type": "text/plain; charset=utf-8" },
          },
        );
      }

      return NextResponse.next();
    };

export default storefrontProxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
