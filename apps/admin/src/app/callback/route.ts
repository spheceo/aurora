import { handleAuth } from "@workos-inc/authkit-nextjs";
import { type NextRequest, NextResponse } from "next/server";
import { isAdminConfigured, isAdminDevelopmentPreview } from "@/lib/config";

export const GET = isAdminConfigured
  ? handleAuth({ returnPathname: "/" })
  : (request: NextRequest) =>
      isAdminDevelopmentPreview
        ? NextResponse.redirect(new URL("/", request.url))
        : new NextResponse("Aurora admin is not configured.", { status: 503 });
