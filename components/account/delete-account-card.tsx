"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "firebase/auth";
import { Trash2 } from "lucide-react";
import { firebaseAuth } from "@/lib/firebase";

const CONFIRMATION = "DELETE MY DEUTSCHPILOT ACCOUNT";

export function DeleteAccountCard({ locale }: { locale: string }) {
  const t = useTranslations("profile");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteAccount() {
    if (confirmation !== CONFIRMATION || deleting) return;
    setDeleting(true);
    setError(null);
    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation }),
      });
      const payload = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(payload.error || t("deleteError"));
      await signOut(firebaseAuth).catch(() => undefined);
      router.replace(`/${locale}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("deleteError"));
      setDeleting(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
      <div className="flex items-start gap-3">
        <Trash2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-300" />
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-red-200">{t("deleteTitle")}</h2>
          <p className="mt-2 text-xs leading-relaxed text-white/50">{t("deleteDescription")}</p>
          {!open ? (
            <button type="button" onClick={() => setOpen(true)} className="mt-4 rounded-lg border border-red-300/30 px-4 py-2 text-xs font-semibold text-red-200 hover:bg-red-300/10">
              {t("deleteTitle")}
            </button>
          ) : (
            <div className="mt-4 space-y-3">
              <label className="block text-xs text-white/60">
                {t("deletePhraseLabel")}
                <input
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  autoCapitalize="off"
                  autoComplete="off"
                  className="mt-2 w-full rounded-lg border border-white/15 bg-[#071424] px-3 py-2 text-sm text-white outline-none focus:border-red-300/50"
                />
              </label>
              {error && <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-200">{error}</p>}
              <button
                type="button"
                disabled={deleting || confirmation !== CONFIRMATION}
                onClick={deleteAccount}
                className="rounded-lg bg-red-500 px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? t("deleting") : t("deleteButton")}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
