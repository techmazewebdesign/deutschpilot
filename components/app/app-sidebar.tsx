"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
} from "lucide-react";

interface Props {
  locale: string;
  userName: string;
  userLevel?: string;
}

interface NavItem {
  href: string;
  icon: React.ElementType;
  labelDe: string;
  labelEn: string;
  soon?: boolean;
}

export function AppSidebar({ locale, userName, userLevel }: Props) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDE = locale === "de";
  const { role, signOut } = useAuth();

  const label = (de: string, en: string) => (isDE ? de : en);

  // Nav items differ by role
  const studentNav: NavItem[] = [
    { href: `/${locale}/rooms`, icon: BookMarked, labelDe: "Meine Räume", labelEn: "My Rooms" },
    { href: `/${locale}/levels`, icon: TrendingUp, labelDe: "Niveaus", labelEn: "Levels" },
    { href: `/${locale}/courses`, icon: BookOpen, labelDe: "Kurse", labelEn: "Courses" },
    { href: `/${locale}/ai-trainer`, icon: MessageSquare, labelDe: "KI-Trainer", labelEn: "AI Trainer" },
  ];

  const teacherNav: NavItem[] = [
    { href: `/${locale}/teacher`, icon: GraduationCap, labelDe: "Übersicht", labelEn: "Overview" },
    { href: `/${locale}/rooms`, icon: BookMarked, labelDe: "Lernräume", labelEn: "Learning Rooms" },
    { href: `/${locale}/courses`, icon: BookOpen, labelDe: "Kurse", labelEn: "Courses" },
    { href: `/${locale}/ai-trainer`, icon: MessageSquare, labelDe: "KI-Trainer", labelEn: "AI Trainer" },
  ];

  const adminNav: NavItem[] = [
    { href: `/${locale}/admin`, icon: Shield, labelDe: "Admin", labelEn: "Admin" },
    { href: `/${locale}/rooms`, icon: BookMarked, labelDe: "Lernräume", labelEn: "Learning Rooms" },
    { href: `/${locale}/courses`, icon: BookOpen, labelDe: "Kurse", labelEn: "Courses" },
  ];

  const toolsNav: NavItem[] = [
    { href: `/${locale}/vocabulary`, icon: Languages, labelDe: "Vokabular", labelEn: "Vocabulary", soon: true },
    { href: `/${locale}/progress-overview`, icon: BarChart2, labelDe: "Fortschritt", labelEn: "Progress", soon: true },
    { href: `/${locale}/certificates`, icon: Award, labelDe: "Zertifikate", labelEn: "Certificates", soon: true },
  ];

  const mainNav =
    role === "admin" ? adminNav :
    role === "teacher" ? teacherNav :
    studentNav;

  const mobileBottomNav: NavItem[] =
    role === "admin"
      ? [
          { href: `/${locale}/admin`, icon: Shield, labelDe: "Admin", labelEn: "Admin" },
          { href: `/${locale}/rooms`, icon: BookMarked, labelDe: "Räume", labelEn: "Rooms" },
          { href: `/${locale}/courses`, icon: BookOpen, labelDe: "Kurse", labelEn: "Courses" },
          { href: `/${locale}/ai-trainer`, icon: MessageSquare, labelDe: "Trainer", labelEn: "Trainer" },
        ]
      : role === "teacher"
      ? [
          { href: `/${locale}/teacher`, icon: GraduationCap, labelDe: "Start", labelEn: "Home" },
          { href: `/${locale}/rooms`, icon: BookMarked, labelDe: "Räume", labelEn: "Rooms" },
          { href: `/${locale}/courses`, icon: BookOpen, labelDe: "Kurse", labelEn: "Courses" },
          { href: `/${locale}/ai-trainer`, icon: MessageSquare, labelDe: "Trainer", labelEn: "Trainer" },
        ]
      : [
          { href: `/${locale}/rooms`, icon: Home, labelDe: "Start", labelEn: "Home" },
          { href: `/${locale}/rooms`, icon: BookMarked, labelDe: "Räume", labelEn: "Rooms" },
          { href: `/${locale}/ai-trainer`, icon: MessageSquare, labelDe: "Trainer", labelEn: "Trainer" },
          { href: `/${locale}/levels`, icon: TrendingUp, labelDe: "Niveaus", labelEn: "Levels" },
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
        <span className="flex-1 truncate">{label(item.labelDe, item.labelEn)}</span>
        {item.soon && (
          <span className="text-[9px] font-semibold text-white/20 border border-white/10 rounded px-1 py-0.5 uppercase tracking-wide">
            {isDE ? "Bald" : "Soon"}
          </span>
        )}
      </Link>
    );
  }

  const roleLabel =
    role === "admin" ? (isDE ? "Administrator" : "Admin") :
    role === "teacher" ? (isDE ? "Lehrer" : "Teacher") :
    null;

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href={`/${locale}`} className="flex items-center gap-2.5" onClick={onLinkClick}>
          <div className="flex-shrink-0 rounded-lg bg-[#E0B873]/10 p-1.5 border border-[#E0B873]/20">
            <Image src="/Images/Logo.PNG" alt="DeutschPilot" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-bold tracking-[0.18em] text-white uppercase">DeutschPilot</span>
            <span className="text-[8px] tracking-[0.22em] text-[#E0B873]/60 uppercase mt-[2px]">
              {label("Sprache. Zukunft. Du.", "Language. Future. You.")}
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
          {label("Navigation", "Navigation")}
        </p>
        {mainNav.map((item) => <NavLink key={item.href} item={item} onClick={onLinkClick} />)}

        {role === "student" && (
          <>
            <div className="pt-4 pb-1">
              <p className="text-[9px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-2">
                {label("Werkzeuge", "Tools")}
              </p>
            </div>
            {toolsNav.map((item) => <NavLink key={item.href} item={item} onClick={onLinkClick} />)}
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-white/5 space-y-0.5">
        <Link
          href={`/${locale}/profile`}
          onClick={onLinkClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <User className="h-4 w-4 flex-shrink-0" />
          {label("Profil", "Profile")}
        </Link>
        <Link
          href={`/${locale}/settings`}
          onClick={onLinkClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {label("Einstellungen", "Settings")}
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all disabled:opacity-50"
        >
          {loggingOut ? <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" /> : <LogOut className="h-4 w-4 flex-shrink-0" />}
          {label("Abmelden", "Sign out")}
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
            <Image src="/Images/Logo.PNG" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
          </div>
          <span className="text-[11px] font-bold tracking-[0.18em] text-white uppercase">DeutschPilot</span>
        </Link>
        <div className="flex items-center gap-3">
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
              <span>{label(item.labelDe, item.labelEn)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
