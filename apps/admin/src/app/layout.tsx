import type { Metadata } from "next";
import { Google_Sans_Flex } from "next/font/google";
import { AdminNav } from "@/components/admin-nav";
import { ConfigurationBanner } from "@/components/configuration-banner";
import { requireStaff, StaffAuthorizationError } from "@/lib/auth";
import {
  isAdminDevelopmentPreview,
  missingAdminEnvironmentVariables,
} from "@/lib/config";
import "./globals.css";

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Aurora Wholesale Admin",
  description: "Review and manage Aurora wholesale accounts.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (isAdminDevelopmentPreview) {
    return (
      <html lang="en" className={googleSansFlex.className}>
        <body>
          <ConfigurationBanner
            missingVariables={missingAdminEnvironmentVariables}
          />
          <AdminNav staffEmail="Development preview" preview />
          {children}
        </body>
      </html>
    );
  }

  try {
    const staff = await requireStaff();
    return (
      <html lang="en" className={googleSansFlex.className}>
        <body>
          <AdminNav staffEmail={staff.email} />
          {children}
        </body>
      </html>
    );
  } catch (error) {
    if (!(error instanceof StaffAuthorizationError)) throw error;

    return (
      <html lang="en" className={googleSansFlex.className}>
        <body className="flex min-h-dvh items-center justify-center px-4">
          <main className="max-w-lg border border-[#e7dede] bg-[#fffdfd] p-10 text-center">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#811A21]">
              Restricted
            </p>
            <h1 className="mt-3 text-3xl font-medium">Staff access required</h1>
            <p className="mt-4 text-sm leading-6 text-[#8a7678]">
              Your WorkOS user is signed in but is not a member of the
              configured Aurora staff organization.
            </p>
          </main>
        </body>
      </html>
    );
  }
}
