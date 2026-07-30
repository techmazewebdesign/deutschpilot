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
    { href: `/${locale}/vocabulary`, icon: Languages, label: t("tools.vocabulary") },
    { href: `/${locale}/progress-overview`, icon: BarChart2, label: t("tools.progress") },
    { href: `/${locale}/certificates`, icon: Award, label: t("tools.certificates") },
    { href: `/${locale}/mock-exam`, icon: GraduationCap, label: t("tools.mockExam") },
    { href: `/${locale}/driving-theory`, icon: Car, label: t("tools.drivingTheory") },
  ];

  const mainNav =
    role === "admin" ? adminNav :
    role === "teacher" ? teacherNav :
    studentNav;

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
          "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
          active
            ? "bg-[#E0B873]/10 text-[#E0B873]"
            : item.soon
            ? "text-white/25 cursor-default"
            : "text-white/55 hover:text-white hover:bg-white/5"
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#E0B873] rounded-full" />
        )}
        <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-[#E0B873]" : "")} />
        <span className="flex-1 truncate">{item.label}</span>
        {item.soon && (
          <span className="text-[9px] font-semibold text-white/20 border border-white/10 rounded px-1 py-0.5 uppercase tracking-wide">
            {t("soonBadge")}
          </span>
        )}
      </Link>
    );
  }

  const roleLabel =
    role === "admin" ? t("roleAdmin") :
    role === "teacher" ? t("roleTeacher") :
    null;

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href={`/${locale}`} className="flex items-center gap-2.5" onClick={onLinkClick}>
          <div className="flex-shrink-0 rounded-lg bg-[#E0B873]/10 p-1.5 border border-[#E0B873]/20">
            <Image src="/Images/Deurschpilot_logo.png" alt="DeutschPilot" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-bold tracking-[0.18em] text-white uppercase">DeutschPilot</span>
            <span className="text-[8px] tracking-[0.22em] text-[#E0B873]/60 uppercase mt-[2px]">
              {t("tagline")}
            </span>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className="px-4 py-3.5 border-b border-white/5">
        <div className="flex items-center gap-3 bg-white/3 rounded-xl p-3 border border-white/5">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#E0B873]/40 to-[#E0B873]/10 border border-[#E0B873]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-[#E0B873]">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {roleLabel && (
                <span className="text-[9px] font-bold text-[#E0B873] bg-[#E0B873]/10 border border-[#E0B873]/20 px-1.5 rounded uppercase tracking-wide">
                  {roleLabel}
                </span>
              )}
              {userLevel && (
                <span className="text-[10px] font-bold text-[#E0B873] bg-[#E0B873]/10 border border-[#E0B873]/20 px-1.5 rounded">
                  {userLevel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-2">
          {t("navigationHeading")}
        </p>
        {mainNav.map((item) => <NavLink key={item.href} item={item} onClick={onLinkClick} />)}

        <div className="pt-4 pb-1">
          <p className="text-[9px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-2">
            {t("toolsHeading")}
          </p>
        </div>
        {toolsNav.map((item) => <NavLink key={item.href} item={item} onClick={onLinkClick} />)}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-white/5 space-y-0.5">
        {/* Language switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-left">{tNav("language")}</span>
            <span className="uppercase text-xs">{locale}</span>
            <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", langOpen && "rotate-180")} />
          </button>
          {langOpen && (
            <div className="absolute left-3 right-3 bottom-full mb-1 rounded-md bg-[#0B1B33] border border-white/10 shadow-xl overflow-hidden z-50">
              {DASHBOARD_LANGUAGES.map((lang) => (
                <Link
                  key={lang.code}
                  href={`/${lang.code}${pathWithoutLocale}`}
                  onClick={() => setLangOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm transition-colors hover:bg-white/5",
                    lang.code === locale ? "text-[#E0B873] bg-[#E0B873]/5" : "text-white/70 hover:text-white"
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <User className="h-4 w-4 flex-shrink-0" />
          {t("profile")}
        </Link>
        <Link
          href={`/${locale}/settings`}
          onClick={onLinkClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {t("settings")}
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all disabled:opacity-50"
        >
          {loggingOut ? <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" /> : <LogOut className="h-4 w-4 flex-shrink-0" />}
          {t("signOut")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#071424] border-r border-white/5 flex-shrink-0 fixed top-0 left-0 h-screen z-30 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-5 py-3.5 bg-[#071424]/95 backdrop-blur-md border-b border-white/5">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="rounded-md bg-[#E0B873]/10 p-1 border border-[#E0B873]/20">
            <Image src="/Images/Deurschpilot_logo.png" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
          </div>
          <span className="text-[11px] font-bold tracking-[0.18em] text-white uppercase">DeutschPilot</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale === "de" ? "en" : "de"}${pathWithoutLocale}`}
            className="flex items-center gap-1 px-1.5 py-1 rounded text-[11px] font-semibold text-white/60 hover:text-white uppercase transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            {locale}
          </Link>
          <div className="h-7 w-7 rounded-full bg-[#E0B873]/20 border border-[#E0B873]/30 flex items-center justify-center">
            <span className="text-xs font-bold text-[#E0B873]">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <button onClick={() => setMobileOpen(true)} className="p-1 text-white/60 hover:text-white transition-colors">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ── Mobile slide-over ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full bg-[#071424] border-r border-white/5 flex flex-col overflow-hidden">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1 text-white/40 hover:text-white transition-colors z-10">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onLinkClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Mobile bottom navigation ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#071424]/95 backdrop-blur-md border-t border-white/5 flex items-stretch">
        {mobileBottomNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
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
