import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SubscriptionPlans } from "@/components/subscription/subscription-plans";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage({ params, searchParams }: { params: { locale: string }; searchParams: { plan?: string } }) {
  const session = await auth();
  if (!session?.user) redirect(`/${params.locale}/signin?next=/${params.locale}/subscription`);
  return <SubscriptionPlans locale={params.locale} initialPlan={searchParams.plan} />;
}
