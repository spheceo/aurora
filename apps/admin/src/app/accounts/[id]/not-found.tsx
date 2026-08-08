import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccountNotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-[#811A21]">
        Not found
      </p>
      <h1 className="mt-3 text-3xl font-medium">Wholesale account not found</h1>
      <Button asChild className="mt-6">
        <Link href="/accounts">Return to accounts</Link>
      </Button>
    </main>
  );
}
