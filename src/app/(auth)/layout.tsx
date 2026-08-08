import Link from "next/link";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-neutral-50 p-6"><div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-8 shadow-sm"><Link href="/" className="text-sm text-neutral-600">← Store with AI</Link>{children}</div></main>;
}
