import { StorefrontHeader } from "@/components/storefront/header";
import { StorefrontFooter } from "@/components/storefront/footer";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-neutral-50 text-neutral-950"><StorefrontHeader/><main>{children}</main><StorefrontFooter/></div>;
}
