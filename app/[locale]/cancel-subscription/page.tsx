import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PublicCancellationForm } from "@/components/subscription/public-cancellation-form";

export default function CancelSubscriptionPage({ params }: { params: { locale: string } }) {
  const de = params.locale === "de";
  return <><Navigation /><main className="min-h-screen bg-[#071424] px-4 py-20"><section className="mx-auto max-w-2xl">
    <h1 className="mb-3 text-4xl font-serif font-bold text-white">{de ? "Verträge hier kündigen" : "Cancel your subscription"}</h1>
    <p className="mb-8 text-[#C9D2DE]">{de ? "Hier kannst du dein DeutschPilot-Abonnement ohne Anmeldung eindeutig identifizieren und zum nächstmöglichen Zeitpunkt kündigen." : "Identify and cancel your DeutschPilot subscription at the earliest possible date without signing in."}</p>
    <PublicCancellationForm locale={params.locale} />
  </section></main><Footer /></>;
}
