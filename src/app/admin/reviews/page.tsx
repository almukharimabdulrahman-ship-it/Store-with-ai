import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { moderateReview } from "../actions";

export default async function ReviewsPage() {
  await requireAdmin();
  const reviews = await prisma.review.findMany({ include:{user:true,product:true}, orderBy:{createdAt:"desc"}, take:100 }).catch(()=>[]);
  return <div><h1 className="text-3xl font-bold">Reviews</h1><div className="mt-6 space-y-3">{reviews.map(r=><div key={r.id} className="rounded-xl border p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><b>{r.product.name}</b> · {r.rating}/5<div className="text-sm text-neutral-500">{r.user.email} · {r.status}</div></div><div className="flex gap-2"><form action={moderateReview.bind(null,r.id,"APPROVED")}><button className="rounded border px-3 py-1.5">Approve</button></form><form action={moderateReview.bind(null,r.id,"REJECTED")}><button className="rounded border px-3 py-1.5">Reject</button></form></div></div>{r.title&&<h3 className="mt-3 font-medium">{r.title}</h3>}{r.body&&<p className="mt-1 text-neutral-700">{r.body}</p>}</div>)}{reviews.length===0&&<p className="text-neutral-500">No reviews yet.</p>}</div></div>;
}
