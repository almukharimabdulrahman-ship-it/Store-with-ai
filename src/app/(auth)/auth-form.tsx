"use client";
import { useActionState } from "react";
import type { ActionState } from "./actions";

type Field = { name: string; label: string; type?: string; autoComplete?: string; value?: string };
export function AuthForm({ action, fields, submit }: { action: (state: ActionState, data: FormData) => Promise<ActionState>; fields: Field[]; submit: string }) {
  const [state, formAction, pending] = useActionState(action, {});
  return <form action={formAction} className="space-y-4">
    {fields.map((field) => <label className="block" key={field.name}><span className="mb-1 block text-sm font-medium">{field.label}</span><input className="w-full rounded border border-neutral-300 px-3 py-2" required {...field} /></label>)}
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="text-sm text-green-700">{state.success}</p>}
    <button disabled={pending} className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50">{pending ? "Please wait…" : submit}</button>
  </form>;
}
