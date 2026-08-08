type OrderDetailProps = {
  order: {
    orderNumber: string;
    status: string;
    paymentStatus: string;
    currency: string;
    customerName: string;
    customerEmail: string | null;
    customerPhone: string;
    shippingCountry: string;
    shippingCity: string;
    shippingArea: string | null;
    shippingLine1: string;
    shippingLine2: string | null;
    shippingPostalCode: string | null;
    subtotal: unknown;
    discount: unknown;
    shippingCost: unknown;
    total: unknown;
    items: Array<{ id: string; productName: string; variantName: string | null; sku: string; unitPrice: unknown; quantity: number; lineTotal: unknown }>;
  };
};

const money = (value: unknown, currency: string) => `${Number(value).toFixed(2)} ${currency}`;

export function OrderDetail({ order }: OrderDetailProps) {
  return <div className="space-y-6">
    <section className="rounded-2xl border bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-neutral-500">Order</p><h1 className="text-2xl font-black">{order.orderNumber}</h1></div><div className="text-right text-sm"><p>Status: <strong>{order.status}</strong></p><p>Payment: <strong>{order.paymentStatus}</strong></p></div></div></section>
    <section className="rounded-2xl border bg-white p-5"><h2 className="font-bold">Items</h2><div className="mt-4 divide-y">{order.items.map((item) => <div key={item.id} className="flex justify-between gap-4 py-3 text-sm"><div><p className="font-medium">{item.productName}</p><p className="text-neutral-500">{item.variantName ?? item.sku} · Qty {item.quantity}</p></div><strong>{money(item.lineTotal, order.currency)}</strong></div>)}</div></section>
    <section className="grid gap-6 md:grid-cols-2"><div className="rounded-2xl border bg-white p-5"><h2 className="font-bold">Shipping</h2><p className="mt-3 text-sm text-neutral-700">{order.customerName}<br/>{order.customerPhone}{order.customerEmail ? <><br/>{order.customerEmail}</> : null}<br/>{order.shippingLine1}{order.shippingLine2 ? `, ${order.shippingLine2}` : ""}<br/>{order.shippingArea ? `${order.shippingArea}, ` : ""}{order.shippingCity}, {order.shippingCountry}{order.shippingPostalCode ? ` ${order.shippingPostalCode}` : ""}</p></div><div className="rounded-2xl border bg-white p-5"><h2 className="font-bold">Totals</h2><div className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{money(order.subtotal, order.currency)}</span></div><div className="flex justify-between"><span>Discount</span><span>-{money(order.discount, order.currency)}</span></div><div className="flex justify-between"><span>Shipping</span><span>{money(order.shippingCost, order.currency)}</span></div><div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span>{money(order.total, order.currency)}</span></div></div></div></section>
  </div>;
}
