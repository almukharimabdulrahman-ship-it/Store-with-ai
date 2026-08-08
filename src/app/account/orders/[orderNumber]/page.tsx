import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/authorization";
import { getUserOrder } from "@/lib/orders";
import { OrderDetail } from "@/components/storefront/order-detail";

export default async function AccountOrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const user = await requireUser();
  const { orderNumber } = await params;
  const order = await getUserOrder(user.id, orderNumber);
  if (!order) notFound();
  return <main className="mx-auto max-w-5xl p-8"><OrderDetail order={order}/></main>;
}
