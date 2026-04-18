import { notFound } from "next/navigation";
import { getVertical } from "@/config/vertical";

export default async function VerticalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  if (!getVertical(vertical)) notFound();
  return <>{children}</>;
}
