"use client";

import { useActionState } from "react";
import { type ApplicationState, applyForWholesale } from "../actions";

const initialState: ApplicationState = {};

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-xs text-[#811A21]" role="alert">
      {errors[0]}
    </p>
  ) : null;
}

export function ApplicationForm() {
  const [state, formAction, pending] = useActionState(
    applyForWholesale,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <label className="block space-y-2">
        <span className="text-[10px] font-semibold tracking-widest uppercase">
          Company name
        </span>
        <input
          name="companyName"
          required
          autoComplete="organization"
          className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-[#811A21]"
        />
        <FieldError errors={state.fieldErrors?.companyName} />
      </label>

      <label className="block space-y-2">
        <span className="text-[10px] font-semibold tracking-widest uppercase">
          Company registration number
        </span>
        <input
          name="registrationNumber"
          required
          className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-[#811A21]"
        />
        <FieldError errors={state.fieldErrors?.registrationNumber} />
      </label>

      <label className="block space-y-2">
        <span className="text-[10px] font-semibold tracking-widest uppercase">
          VAT number{" "}
          <span className="normal-case tracking-normal text-[#9A9A9A]">
            (optional)
          </span>
        </span>
        <input
          name="vatNumber"
          className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-[#811A21]"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-[10px] font-semibold tracking-widest uppercase">
          Phone
        </span>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-[#811A21]"
        />
        <FieldError errors={state.fieldErrors?.phone} />
      </label>

      {state.error ? (
        <p
          className="border border-[#d8c8ca] bg-[#fff8f8] p-3 text-sm text-[#811A21]"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[#811A21] px-6 py-3 text-xs font-semibold tracking-widest uppercase text-white transition-colors hover:bg-[#6f161d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit for approval"}
      </button>
    </form>
  );
}
