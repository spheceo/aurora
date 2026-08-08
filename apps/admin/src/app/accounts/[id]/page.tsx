import { ArrowLeft, Building2, Mail, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAccountDetails } from "@/lib/data";
import { updateAccountStatus } from "../actions";

const dateFormatter = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium",
  timeStyle: "short",
});

type AccountDetailsPageProps = { params: Promise<{ id: string }> };

export default async function AccountDetailsPage({
  params,
}: AccountDetailsPageProps) {
  const { id } = await params;
  const { account, members, events } = await getAccountDetails(id);
  if (!account) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <Link
        href="/accounts"
        className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#811A21]"
      >
        <ArrowLeft className="size-4" /> Back to accounts
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#8a7678]">
            Company account
          </p>
          <h1 className="mt-2 text-3xl font-medium md:text-4xl">
            {account.companyName}
          </h1>
          <p className="mt-2 text-sm text-[#8a7678]">{account.emailDomain}</p>
        </div>
        <StatusBadge status={account.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#8a7678]">
                Application
              </p>
              <h2 className="mt-1 text-xl font-medium">Company details</h2>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <Detail
                label="Registration number"
                value={account.registrationNumber}
              />
              <Detail label="VAT number" value={account.vatNumber} />
              <Detail
                label="Phone"
                value={account.phone}
                icon={<Phone className="size-4" />}
              />
              <Detail
                label="WorkOS organization"
                value={account.workosOrganizationId}
              />
              <Detail
                label="Submitted"
                value={dateFormatter.format(account.createdAt)}
              />
              <Detail
                label="Last updated"
                value={dateFormatter.format(account.updatedAt)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#8a7678]">
                People
              </p>
              <h2 className="mt-1 text-xl font-medium">Account members</h2>
            </CardHeader>
            <div className="divide-y divide-[#e7dede]">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="border border-[#d8c8ca] p-2 text-[#811A21]">
                      <UserRound className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {[member.firstName, member.lastName]
                          .filter(Boolean)
                          .join(" ") || member.email}
                      </p>
                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#8a7678]">
                        <Mail className="size-3" /> {member.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#811A21]">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#8a7678]">
                History
              </p>
              <h2 className="mt-1 text-xl font-medium">Approval timeline</h2>
            </CardHeader>
            <div className="divide-y divide-[#e7dede]">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="grid gap-2 p-5 sm:grid-cols-[9rem_1fr]"
                >
                  <p className="text-xs text-[#8a7678]">
                    {dateFormatter.format(event.createdAt)}
                  </p>
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-[#811A21]">
                      {event.action}
                    </p>
                    <p className="mt-1 text-sm">{event.actorEmail}</p>
                    {event.reason ? (
                      <p className="mt-2 text-sm leading-6 text-[#8a7678]">
                        {event.reason}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside>
          <Card className="sticky top-6">
            <CardHeader>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#8a7678]">
                Staff action
              </p>
              <h2 className="mt-1 text-xl font-medium">Review account</h2>
            </CardHeader>
            <CardContent>
              <form action={updateAccountStatus} className="space-y-5">
                <input type="hidden" name="accountId" value={account.id} />
                <label className="block space-y-2">
                  <span className="text-[10px] font-semibold tracking-widest uppercase">
                    Staff notes
                  </span>
                  <textarea
                    name="notes"
                    defaultValue={account.notes || ""}
                    rows={5}
                    placeholder="Internal notes about the application"
                    className="w-full resize-y border border-[#d8c8ca] bg-transparent p-3 text-sm leading-6 outline-none focus:border-[#811A21]"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-semibold tracking-widest uppercase">
                    Decision reason
                  </span>
                  <textarea
                    name="reason"
                    rows={3}
                    placeholder="Required for rejection or suspension"
                    className="w-full resize-y border border-[#d8c8ca] bg-transparent p-3 text-sm leading-6 outline-none focus:border-[#811A21]"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {account.status === "pending" ||
                  account.status === "rejected" ? (
                    <Button name="decision" value="approve" type="submit">
                      Approve
                    </Button>
                  ) : null}
                  {account.status === "pending" ? (
                    <Button
                      name="decision"
                      value="reject"
                      type="submit"
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  ) : null}
                  {account.status === "approved" ? (
                    <Button
                      name="decision"
                      value="suspend"
                      type="submit"
                      variant="destructive"
                    >
                      Suspend
                    </Button>
                  ) : null}
                  {account.status === "suspended" ? (
                    <Button name="decision" value="reinstate" type="submit">
                      Reinstate
                    </Button>
                  ) : null}
                </div>
              </form>
              {account.approvedAt ? (
                <div className="mt-6 border-t border-[#e7dede] pt-5 text-xs leading-5 text-[#8a7678]">
                  Approved {dateFormatter.format(account.approvedAt)}
                  {account.approvedBy ? ` by ${account.approvedBy}` : ""}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-widest uppercase text-[#8a7678]">
        {label}
      </p>
      <p className="mt-2 flex items-center gap-2 break-all text-sm">
        {icon || <Building2 className="size-4 text-[#811A21]" />} {value || "—"}
      </p>
    </div>
  );
}
