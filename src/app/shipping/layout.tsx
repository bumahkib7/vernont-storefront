import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns | Vernont",
  description:
    "Information about Vernont shipping options, delivery times, and return policy.",
};

export default function ShippingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
