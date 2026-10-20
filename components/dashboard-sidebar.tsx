"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
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

  const { user, profile, signOut } = useAuth();
  useEffect(() => {
    setDisplayName(profile?.fullName || user?.displayName || user?.email?.split("@")[0] || "");
    setLevel(profile?.germanLevel || "");
  }, [profile, user]);
  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut();
      router.push(`/${locale}`);
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
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
    <aside className="border-[#E0B873]/8 hidden min-h-screen w-64 flex-shrink-0 flex-col border-r bg-[#071424] lg:flex">
      {/* Logo */}
      <div className="border-b border-white/5 px-6 py-5">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div style={{ mixBlendMode: "screen" }} className="flex-shrink-0">
            <Image
              src="/Images/Deurschpilot_logo.png"
              alt="DeutschPilot"
              width={36}
              height={36}
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#F8F5EF]">
              DeutschPilot
            </span>
            <span className="mt-[2px] text-[8px] uppercase tracking-[0.22em] text-[#E0B873]">
              {t("tagline")}
            </span>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className="border-b border-white/5 px-4 py-4">
        <div className="bg-white/4 flex items-center gap-3 rounded-lg p-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#E0B873]/30 bg-[#E0B873]/20">
            <span className="text-sm font-bold text-[#E0B873]">
              {displayName ? displayName.charAt(0).toUpperCase() : "S"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {displayName || t("studentFallback")}
            </p>
            {level && (
              <p className="text-xs text-[#E0B873]">
                {t("levelLabel")} {level}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[9px] font-medium uppercase tracking-widest text-white/30">
          {t("learningHeading")}
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-[#E0B873]/12 border border-[#E0B873]/20 text-[#E0B873]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-[#E0B873]" : "")} />
              {item.label}
            </Link>
          );
        })}
        <div className="pt-4">
          <p className="mb-2 px-3 text-[9px] font-medium uppercase tracking-widest text-white/30">
            {t("accountHeading")}
          </p>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                  active
                    ? "bg-[#E0B873]/12 border border-[#E0B873]/20 text-[#E0B873]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-[#E0B873]" : "")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-white/5 px-3 py-4">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/40 transition-all hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          {loggingOut ? (
            <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 flex-shrink-0" />
          )}
          {t("signOut")}
        </button>
      </div>
    </aside>
  );
}
