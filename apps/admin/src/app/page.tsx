import { ArrowRight, Building2, Clock3, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDashboardData } from "@/lib/data";

const dateFormatter = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminPage() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#811A21]">
            Wholesale operations
          </p>
          <h1 className="mt-2 text-3xl font-medium md:text-4xl">
            Approval overview
          </h1>
        </div>
        <Link
          href="/accounts"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#811A21]"
        >
          View all accounts <ArrowRight className="size-4" />
        </Link>
      </div>

      <section
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Account metrics"
      >
        <MetricCard
          label="Pending review"
          value={data.pendingCount}
          icon={<Clock3 className="size-5" />}
        />
        <MetricCard
          label="Approved companies"
          value={data.approvedCount}
          icon={<ShieldCheck className="size-5" />}
        />
        <MetricCard
          label="Total active queue"
          value={data.pendingAccounts.length}
          icon={<Building2 className="size-5" />}
        />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#8a7678]">
                Queue
              </p>
              <h2 className="mt-1 text-xl font-medium">Pending accounts</h2>
            </div>
            <StatusBadge status="pending" />
          </CardHeader>
          <div className="divide-y divide-[#e7dede]">
            {data.pendingAccounts.length ? (
              data.pendingAccounts.map((account) => (
                <Link
                  key={account.id}
                  href={`/accounts/${account.id}`}
                  className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-[#faf8f8]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {account.companyName}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#8a7678]">
                      {account.emailDomain}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-[#8a7678]">
                      Submitted
                    </p>
                    <p className="mt-1 text-xs">
                      {dateFormatter.format(account.createdAt)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="p-8 text-center text-sm text-[#8a7678]">
                The review queue is clear.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#8a7678]">
              Audit trail
            </p>
            <h2 className="mt-1 text-xl font-medium">Recent activity</h2>
          </CardHeader>
          <div className="divide-y divide-[#e7dede]">
            {data.recentActivity.length ? (
              data.recentActivity.map((event) => (
                <Link
                  key={event.id}
                  href={`/accounts/${event.accountId}`}
                  className="block p-5 transition-colors hover:bg-[#faf8f8]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold">
                      {event.companyName}
                    </p>
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#811A21]">
                      {event.action}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#8a7678]">
                    {event.actorEmail} · {dateFormatter.format(event.createdAt)}
                  </p>
                </Link>
              ))
            ) : (
              <p className="p-8 text-center text-sm text-[#8a7678]">
                No approval activity yet.
              </p>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#8a7678]">
            {label}
          </p>
          <p className="mt-2 text-4xl font-medium">{value}</p>
        </div>
        <div className="border border-[#d8c8ca] p-3 text-[#811A21]">{icon}</div>
      </CardContent>
    </Card>
  );
}
