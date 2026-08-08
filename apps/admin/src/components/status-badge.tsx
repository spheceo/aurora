import type { AccountStatus } from "@aurora/db";
import { cn } from "@/lib/utils";

const statusStyles: Record<AccountStatus, string> = {
  pending: "border-[#d8c8ca] bg-[#fff8ee] text-[#8a5a18]",
  approved: "border-[#bcd6c5] bg-[#f0f8f2] text-[#275f3a]",
  rejected: "border-[#d8c8ca] bg-[#fff8f8] text-[#811A21]",
  suspended: "border-[#cfc8d8] bg-[#f6f3fa] text-[#5c466f]",
};

export function StatusBadge({ status }: { status: AccountStatus }) {
  return (
    <span
      className={cn(
        "inline-flex border px-2 py-1 text-[10px] font-semibold tracking-widest uppercase",
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
}
