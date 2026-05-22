import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** /[locale]/dashboard — role router only, no UI */
export default async function DashboardPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const session = await auth();

  if (!session?.user) redirect(`/${locale}/signin`);

  const role = session.user.role;
  if (role === "admin") redirect(`/${locale}/admin`);
  if (role === "teacher") redirect(`/${locale}/teacher/dashboard`);
  redirect(`/${locale}/student/dashboard`);
}
