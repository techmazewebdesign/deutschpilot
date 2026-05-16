import Link from "next/link";

const comingSoonContent: Record<string, { title: string; message: string; back: string }> = {
  ar: { title: "قريباً", message: "هذه النسخة اللغوية ستكون متاحة قريباً.", back: "العودة إلى الصفحة الرئيسية" },
  fa: { title: "به زودی", message: "نسخه این زبان به زودی در دسترس خواهد بود.", back: "بازگشت به صفحه اصلی" },
  hi: { title: "जल्द आ रहा है", message: "इस भाषा का संस्करण जल्द ही उपलब्ध होगा।", back: "होम पेज पर वापस जाएं" },
  ta: { title: "விரைவில் வருகிறது", message: "இந்த மொழி பதிப்பு விரைவில் கிடைக்கும்.", back: "முகப்புக்கு திரும்பு" },
};

interface PlaceholderPageProps {
  locale: string;
}

export function PlaceholderPage({ locale }: PlaceholderPageProps) {
  const content = comingSoonContent[locale] ?? comingSoonContent.ar;

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-[#071424] px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#CEA66F]/30 bg-[#CEA66F]/10 mb-6">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-[#CEA66F]" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
          {content.title}
        </h1>
        <p className="text-[#C9D2DE] mb-8 leading-relaxed">
          {content.message}
        </p>
        <Link
          href={`/${locale}` as any}
          className="inline-block bg-[#D9B173] text-[#071424] font-semibold px-8 py-3 rounded-md hover:bg-[#B98A4E] transition-colors"
        >
          {content.back}
        </Link>
      </div>
    </main>
  );
}
