import type { AccountStatus } from "@aurora/db";
import { Search } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { listAccounts } from "@/lib/data";

const statuses: AccountStatus[] = [
  "pending",
  "approved",
  "rejected",
  "suspended",
];
const dateFormatter = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" });

type AccountsPageProps = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function AccountsPage({
  searchParams,
}: AccountsPageProps) {
  const params = await searchParams;
  const status = statuses.includes(params.status as AccountStatus)
    ? (params.status as AccountStatus)
    : undefined;
  const rows = await listAccounts({ search: params.q, status });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#811A21]">
          Companies
        </p>
        <h1 className="mt-2 text-3xl font-medium md:text-4xl">
          Wholesale accounts
        </h1>
      </div>

      <form className="mt-8 flex flex-col gap-3 border border-[#e7dede] bg-[#fffdfd] p-4 sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8a7678]" />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search company or domain"
            className="h-10 w-full border border-[#d8c8ca] bg-transparent pr-3 pl-10 text-sm outline-none focus:border-[#811A21]"
          />
        </label>
        <select
          name="status"
          defaultValue={status || ""}
          className="h-10 border border-[#d8c8ca] bg-[#fffdfd] px-3 text-sm outline-none focus:border-[#811A21]"
        >
          <option value="">All statuses</option>
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value[0].toUpperCase() + value.slice(1)}
            </option>
          ))}
        </select>
        <Button type="submit">Filter</Button>
        {params.q || status ? (
          <Button asChild variant="ghost">
            <Link href="/accounts">Clear</Link>
          </Button>
        ) : null}
      </form>

      <div className="mt-6 overflow-x-auto border border-[#e7dede] bg-[#fffdfd]">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="border-b border-[#e7dede] bg-[#faf8f8] text-[10px] font-semibold tracking-widest uppercase text-[#8a7678]">
            <tr>
              <th className="px-5 py-3">Company</th>
              <th className="px-5 py-3">Domain</th>
              <th className="px-5 py-3">Registration</th>
              <th className="px-5 py-3">Submitted</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7dede]">
            {rows.map((account) => (
              <tr
                key={account.id}
                className="transition-colors hover:bg-[#faf8f8]"
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/accounts/${account.id}`}
                    className="font-semibold hover:text-[#811A21]"
                  >
                    {account.companyName}
                  </Link>
                </td>
                <td className="px-5 py-4 text-sm text-[#8a7678]">
                  {account.emailDomain}
                </td>
                <td className="px-5 py-4 text-sm">
                  {account.registrationNumber || "—"}
                </td>
                <td className="px-5 py-4 text-sm">
                  {dateFormatter.format(account.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={account.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? (
          <p className="p-10 text-center text-sm text-[#8a7678]">
            No accounts match these filters.
          </p>
        ) : null}
      </div>
    </main>
  );
}
