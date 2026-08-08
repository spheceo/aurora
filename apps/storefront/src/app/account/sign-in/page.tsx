import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isWholesaleAuthConfigured } from "@/lib/auth/config";

export default async function SignInPage() {
  if (isWholesaleAuthConfigured) {
    redirect(await getSignInUrl({ returnTo: "/account/profile" }));
  }

  return (
    <main className="flex min-h-dvh items-center bg-[#faf8f8] px-4 py-12">
      <section className="mx-auto w-full max-w-lg border border-[#e7dede] bg-[#fffdfd] p-8 md:p-12">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#811A21]">
          Aurora wholesale
        </p>
        <h1 className="mt-4 text-3xl font-medium">Sign in to your account</h1>
        <p className="mt-4 text-sm leading-6 text-[#8a7678]">
          Wholesale authentication is not configured in this development
          environment. Add the WorkOS and Neon variables from the storefront
          environment example to enable sign-in.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex bg-[#811A21] px-5 py-3 text-xs font-semibold tracking-widest uppercase text-white"
        >
          Return to storefront
        </Link>
      </section>
    </main>
  );
}
