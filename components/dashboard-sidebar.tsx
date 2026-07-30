"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabaseClient";
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  MessageSquare,
  CalendarDays,
  User,
  Settings,
  LogOut,
  FlaskConical,
  Loader2,
} from "lucide-react";

interface SidebarProps {
  locale: string;
}

export function DashboardSidebar({ locale }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("sidebar");
  const [displayName, setDisplayName] = useState("");
  const [level, setLevel] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      supabase
        .from("profiles")
        .select("full_name, german_level")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          setDisplayName(data?.full_name || session.user.email?.split("@")[0] || t("studentFallback"));
          setLevel(data?.german_level || "");
        });
    });
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  const navItems = [
    { href: `/${locale}/dashboard`, icon: LayoutDashboard, label: t("nav.dashboardOverview") },
    { href: `/${locale}/courses`, icon: BookOpen, label: t("nav.myCourses") },
    { href: `/${locale}/placement-test`, icon: FlaskConical, label: t("nav.placementTest") },
    { href: `/${locale}/dashboard/progress`, icon: BarChart2, label: t("tools.progress") },
    { href: `/${locale}/dashboard/messages`, icon: MessageSquare, label: t("nav.messages") },
    { href: `/${locale}/dashboard/sessions`, icon: CalendarDays, label: t("nav.sessions") },
  ];

  const bottomItems = [
    { href: `/${locale}/profile`, icon: User, label: t("profile") },
    { href: `/${locale}/settings`, icon: Settings, label: t("settings") },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#071424] border-r border-[#E0B873]/8 flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div style={{ mixBlendMode: "screen" }} className="flex-shrink-0">
            <Image src="/Images/Deurschpilot_logo.png" alt="DeutschPilot" width={36} height={36} className="h-8 w-8 object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[12px] font-bold tracking-[0.18em] text-[#F8F5EF] uppercase">DeutschPilot</span>
            <span className="text-[8px] tracking-[0.22em] text-[#E0B873] uppercase mt-[2px]">
              {t("tagline")}
            </span>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/4">
          <div className="h-9 w-9 rounded-full bg-[#E0B873]/20 border border-[#E0B873]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-[#E0B873]">
              {displayName ? displayName.charAt(0).toUpperCase() : "S"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName || t("studentFallback")}</p>
            {level && (
              <p className="text-xs text-[#E0B873]">{t("levelLabel")} {level}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-medium text-white/30 uppercase tracking-widest px-3 mb-2">
          {t("learningHeading")}
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                active ? "bg-[#E0B873]/12 text-[#E0B873] border border-[#E0B873]/20" : "text-white/60 hover:text-white hover:bg-white/5"
              )}>
              <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-[#E0B873]" : "")} />
              {item.label}
            </Link>
          );
        })}
        <div className="pt-4">
          <p className="text-[9px] font-medium text-white/30 uppercase tracking-widest px-3 mb-2">
            {t("accountHeading")}
          </p>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  active ? "bg-[#E0B873]/12 text-[#E0B873] border border-[#E0B873]/20" : "text-white/60 hover:text-white hover:bg-white/5"
                )}>
                <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-[#E0B873]" : "")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button onClick={handleLogout} disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50">
          {loggingOut ? <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" /> : <LogOut className="h-4 w-4 flex-shrink-0" />}
          {t("signOut")}
        </button>
      </div>
    </aside>
  );
}
