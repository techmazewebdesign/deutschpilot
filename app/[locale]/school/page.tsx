import type { Metadata } from "next";
import { SchoolPortal } from "@/components/school/school-portal";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "School portal | DeutschPilot",
  robots: { index: false, follow: false },
};

export default function SchoolPage({ params }: { params: { locale: string } }) {
  return <SchoolPortal locale={params.locale} />;
}
