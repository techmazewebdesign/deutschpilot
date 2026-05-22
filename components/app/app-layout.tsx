import { AppSidebar } from "./app-sidebar";

interface Props {
  locale: string;
  userName: string;
  userLevel?: string;
  children: React.ReactNode;
}

export function AppLayout({ locale, userName, userLevel, children }: Props) {
  return (
    <div className="min-h-screen bg-[#05101E]">
      <AppSidebar locale={locale} userName={userName} userLevel={userLevel} />
      {/* Content: offset by sidebar width on desktop, padded for mobile bottom nav */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      </div>
    </div>
  );
}
