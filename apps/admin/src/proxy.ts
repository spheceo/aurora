import { authkitProxy } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";
import {
  adminRedirectUri,
  isAdminConfigured,
  isAdminDevelopmentPreview,
} from "./lib/config";

const adminProxy = isAdminConfigured
  ? authkitProxy({
      redirectUri: adminRedirectUri,
      middlewareAuth: {
        enabled: true,
        unauthenticatedPaths: ["/callback"],
      },
    })
  : isAdminDevelopmentPreview
    ? () => NextResponse.next()
    : () =>
        new NextResponse(
          "Aurora admin is not configured. Add the Neon and WorkOS variables from apps/admin/.env.example.",
          {
            status: 503,
            headers: { "content-type": "text/plain; charset=utf-8" },
          },
        );

export default adminProxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
