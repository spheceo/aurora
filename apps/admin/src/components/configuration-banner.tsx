import { TriangleAlert } from "lucide-react";

export function ConfigurationBanner({
  missingVariables,
}: {
  missingVariables: readonly string[];
}) {
  return (
    <aside
      className="sticky top-0 z-50 border-b border-[#d7a545] bg-[#fff4cf] px-4 py-3 text-[#5f4210]"
      aria-label="Development configuration warning"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3 md:px-4">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div className="text-xs leading-5">
          <p className="font-semibold">Development preview mode</p>
          <p>
            Live data, authentication, and approval actions are unavailable.
            Missing: {missingVariables.join(", ")}.
          </p>
        </div>
      </div>
    </aside>
  );
}
