"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import {
  BookOpen,
  BookMarked,
  MessageSquare,
  Languages,
  BarChart2,
  Award,
  Settings,
  LogOut,
  Loader2,
  TrendingUp,
  Home,
  X,
  Menu,
  GraduationCap,
  Shield,
  User,
  Car,
  Globe,
  ChevronDown,
  Film,
} from "lucide-react";

// Only locales actually wired up in i18n.ts's `locales` array belong here.
const DASHBOARD_LANGUAGES = [
  { code: "de", name: "Deutsch" },
  { code: "en", name: "English" },
];

interface Props {
  locale: string;
  userName: string;
  userLevel?: string;
}

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  soon?: boolean;
}

export function AppSidebar({ locale, userName, userLevel }: Props) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [salesTeam, setSalesTeam] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { role, signOut } = useAuth();
  const t = useTranslations("sidebar");
  const tNav = useTranslations("nav");
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/sales-training", { cache: "no-store" })
      .then((response) => response.json())
      .then((result) => {
        if (!cancelled) setSalesTeam(result.salesTeam === true);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  // Nav items differ by role
  const studentNav: NavItem[] = [
    { href: `/${locale}/rooms`, icon: BookMarked, label: t("nav.myRooms") },
    { href: `/${locale}/levels`, icon: TrendingUp, label: t("nav.levels") },
    { href: `/${locale}/courses`, icon: BookOpen, label: t("nav.courses") },
    { href: `/${locale}/ai-trainer`, icon: MessageSquare, label: t("nav.aiTrainer") },
  ];

  const teacherNav: NavItem[] = [
    { href: `/${locale}/teacher`, icon: GraduationCap, label: t("nav.teacherOverview") },
    { href: `/${locale}/rooms`, icon: BookMarked, label: t("nav.learningRooms") },
    { href: `/${locale}/courses`, icon: BookOpen, label: t("nav.courses") },
    { href: `/${locale}/ai-trainer`, icon: MessageSquare, label: t("nav.aiTrainer") },
  ];

  const adminNav: NavItem[] = [
    { href: `/${locale}/admin`, icon: Shield, label: t("nav.adminDashboard") },
    { href: `/${locale}/student/dashboard`, icon: GraduationCap, label: t("nav.userDashboard") },
    { href: `/${locale}`, icon: Home, label: t("nav.mainPage") },
    { href: `/${locale}/rooms`, icon: BookMarked, label: t("nav.learningRooms") },
    { href: `/${locale}/courses`, icon: BookOpen, label: t("nav.courses") },
    { href: `/${locale}/ai-trainer`, icon: MessageSquare, label: t("nav.aiTrainer") },
  ];

  const toolsNav: NavItem[] = [
    {
      href: `/${locale}/school`,
      icon: GraduationCap,
      label: locale === "de" ? "Mein Schulbereich" : "My school",
    },
    { href: `/${locale}/vocabulary`, icon: Languages, label: t("tools.vocabulary") },
    { href: `/${locale}/progress-overview`, icon: BarChart2, label: t("tools.progress") },
    { href: `/${locale}/certificates`, icon: Award, label: t("tools.certificates") },
    { href: `/${locale}/mock-exam`, icon: GraduationCap, label: t("tools.mockExam") },
    { href: `/${locale}/driving-theory`, icon: Car, label: t("tools.drivingTheory") },
  ];

  const mainNav = role === "admin" ? adminNav : role === "teacher" ? teacherNav : studentNav;

  const mobileBottomNav: NavItem[] =
    role === "admin"
      ? [
          { href: `/${locale}/admin`, icon: Shield, label: t("mobile.admin") },
          { href: `/${locale}/student/dashboard`, icon: GraduationCap, label: t("mobile.user") },
          { href: `/${locale}`, icon: Home, label: t("mobile.main") },
          { href: `/${locale}/ai-trainer`, icon: MessageSquare, label: t("mobile.trainer") },
        ]
      : role === "teacher"
        ? [
            { href: `/${locale}/teacher`, icon: GraduationCap, label: t("mobile.start") },
            { href: `/${locale}/rooms`, icon: BookMarked, label: t("mobile.rooms") },
            { href: `/${locale}/courses`, icon: BookOpen, label: t("nav.courses") },
            { href: `/${locale}/ai-trainer`, icon: MessageSquare, label: t("mobile.trainer") },
          ]
        : [
            { href: `/${locale}/rooms`, icon: Home, label: t("mobile.start") },
            { href: `/${locale}/rooms`, icon: BookMarked, label: t("mobile.rooms") },
            { href: `/${locale}/ai-trainer`, icon: MessageSquare, label: t("mobile.trainer") },
            { href: `/${locale}/levels`, icon: TrendingUp, label: t("nav.levels") },
          ];

  async function handleLogout() {
    setLoggingOut(true);
    await signOut();
  }

  const isActive = (href: string) => pathname.startsWith(href);

  function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
    const Icon = item.icon;
    const active = !item.soon && isActive(item.href);
    return (
      <Link
        href={item.soon ? `/${locale}/rooms` : item.href}
        onClick={item.soon ? (e: React.MouseEvent) => e.preventDefault() : onClick}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
          active
            ? "bg-[#E0B873]/10 text-[#E0B873]"
            : item.soon
              ? "cursor-default text-white/25"
              : "text-white/55 hover:bg-white/5 hover:text-white"
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#E0B873]" />
        )}
        <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-[#E0B873]" : "")} />
        <span className="flex-1 truncate">{item.label}</span>
        {item.soon && (
          <span className="rounded border border-white/10 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/20">
            {t("soonBadge")}
          </span>
        )}
      </Link>
    );
  }

  const roleLabel =
    role === "admin" ? t("roleAdmin") : role === "teacher" ? t("roleTeacher") : null;

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-white/5 px-5 py-5">
        <Link href={`/${locale}`} className="flex items-center gap-2.5" onClick={onLinkClick}>
          <div className="flex-shrink-0 rounded-lg border border-[#E0B873]/20 bg-[#E0B873]/10 p-1.5">
            <Image
              src="/Images/Deurschpilot_logo.png"
              alt="DeutschPilot"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              DeutschPilot
            </span>
            <span className="mt-[2px] text-[8px] uppercase tracking-[0.22em] text-[#E0B873]/60">
              {t("tagline")}
            </span>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className="border-b border-white/5 px-4 py-3.5">
        <div className="bg-white/3 flex items-center gap-3 rounded-xl border border-white/5 p-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#E0B873]/30 bg-gradient-to-br from-[#E0B873]/40 to-[#E0B873]/10">
            <span className="text-sm font-bold text-[#E0B873]">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              {roleLabel && (
                <span className="rounded border border-[#E0B873]/20 bg-[#E0B873]/10 px-1.5 text-[9px] font-bold uppercase tracking-wide text-[#E0B873]">
                  {roleLabel}
                </span>
              )}
              {userLevel && (
                <span className="rounded border border-[#E0B873]/20 bg-[#E0B873]/10 px-1.5 text-[10px] font-bold text-[#E0B873]">
                  {userLevel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-widest text-white/25">
          {t("navigationHeading")}
        </p>
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} onClick={onLinkClick} />
        ))}
        {salesTeam && (
          <NavLink
            item={{
              href: `/${locale}/sales/presentations`,
              icon: Film,
              label: locale === "de" ? "Präsentationsvideos" : "Presentation videos",
            }}
            onClick={onLinkClick}
          />
        )}

        <div className="pb-1 pt-4">
          <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-widest text-white/25">
            {t("toolsHeading")}
          </p>
        </div>
        {toolsNav.map((item) => (
          <NavLink key={item.href} item={item} onClick={onLinkClick} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="space-y-0.5 border-t border-white/5 px-3 py-3">
        {/* Language switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/40 transition-all hover:bg-white/5 hover:text-white"
          >
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-left">{tNav("language")}</span>
            <span className="text-xs uppercase">{locale}</span>
            <ChevronDown
              className={cn("h-3 w-3 transition-transform duration-200", langOpen && "rotate-180")}
            />
          </button>
          {langOpen && (
            <div className="absolute bottom-full left-3 right-3 z-50 mb-1 overflow-hidden rounded-md border border-white/10 bg-[#0B1B33] shadow-xl">
              {DASHBOARD_LANGUAGES.map((lang) => (
                <Link
                  key={lang.code}
                  href={`/${lang.code}${pathWithoutLocale}`}
                  onClick={() => setLangOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm transition-colors hover:bg-white/5",
                    lang.code === locale
                      ? "bg-[#E0B873]/5 text-[#E0B873]"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {lang.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link
          href={`/${locale}/profile`}
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/40 transition-all hover:bg-white/5 hover:text-white"
        >
          <User className="h-4 w-4 flex-shrink-0" />
          {t("profile")}
        </Link>
        <Link
          href={`/${locale}/settings`}
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/40 transition-all hover:bg-white/5 hover:text-white"
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {t("settings")}
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/40 transition-all hover:bg-red-400/5 hover:text-red-400 disabled:opacity-50"
        >
          {loggingOut ? (
            <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 flex-shrink-0" />
          )}
          {t("signOut")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen min-h-screen w-64 flex-shrink-0 flex-col overflow-hidden border-r border-white/5 bg-[#071424] lg:flex">
        <SidebarContent />
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-[#071424]/95 px-5 py-3.5 backdrop-blur-md lg:hidden">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="rounded-md border border-[#E0B873]/20 bg-[#E0B873]/10 p-1">
            <Image
              src="/Images/Deurschpilot_logo.png"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            DeutschPilot
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale === "de" ? "en" : "de"}${pathWithoutLocale}`}
            className="flex items-center gap-1 rounded px-1.5 py-1 text-[11px] font-semibold uppercase text-white/60 transition-colors hover:text-white"
          >
            <Globe className="h-3.5 w-3.5" />
            {locale}
          </Link>
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E0B873]/30 bg-[#E0B873]/20">
            <span className="text-xs font-bold text-[#E0B873]">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-white/60 transition-colors hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ── Mobile slide-over ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full w-72 flex-col overflow-hidden border-r border-white/5 bg-[#071424]">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 z-10 p-1 text-white/40 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onLinkClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Mobile bottom navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t border-white/5 bg-[#071424]/95 backdrop-blur-md lg:hidden">
        {mobileBottomNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-[#E0B873]" : "text-white/40 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5", active ? "text-[#E0B873]" : "")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
