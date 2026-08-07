import { redirect } from "next/navigation";
import { AppLayout } from "@/components/app/app-layout";
import { SalesTrainingHub } from "@/components/sales/sales-training-hub";
import { getServerSession } from "@/lib/session";
import { isSalesTeamMember } from "@/lib/sales-training";

export const dynamic = "force-dynamic";

export default async function SalesPresentationsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const session = await getServerSession();
  if (!session?.user) redirect(`/${locale}/signin`);
  if (!(await isSalesTeamMember(session.user))) redirect(`/${locale}/dashboard`);

  const userName = session.user.name || session.user.email.split("@")[0] || "Sales";
  return (
    <AppLayout locale={locale} userName={userName} userLevel="Sales">
      <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl w-full mx-auto">
        <SalesTrainingHub locale={locale} mode="library" />
      </main>
    </AppLayout>
  );
}
