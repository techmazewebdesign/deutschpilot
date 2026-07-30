"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, Globe, ChevronDown, LayoutDashboard, LogOut, BookOpen, Brain, Video, Users, GraduationCap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth, dashboardPath } from "@/contexts/auth-context";

const publicNavLinks = [
  { href: "/", key: "home" },
  { href: "/ai-trainer", key: "aiTrainer" },
  { href: "/classes", key: "classes" },
  { href: "/driving-theory", key: "drivingTheory" },
  { href: "/mock-exam", key: "mockExam" },
  { href: "/teachers", key: "teachers" },
  { href: "/magazine", key: "magazine" },
];

const studentNavLinks = [
  { href: "/student/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/rooms", key: "learn", icon: BookOpen },
  { href: "/ai-trainer", key: "aiTrainer", icon: Brain },
  { href: "/student/classes", key: "myClasses", icon: Video },
  { href: "/classes", key: "browseClasses", icon: Video },
  { href: "/teachers", key: "teachers", icon: Users },
];

const teacherNavLinks = [
  { href: "/teacher/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/teacher/classes", key: "myClasses", icon: Video },
  { href: "/teacher/classes/new", key: "createClass", icon: Plus },
  { href: "/teachers", key: "teachers", icon: GraduationCap },
];

// Keep for translation fallback
const navLinks = [
  { href: "/", key: "home" },
  { href: "/levels", key: "levels" },
  { href: "/rooms", key: "rooms" },
  { href: "/ai-trainer", key: "aiTrainer" },
  { href: "/courses", key: "pricing" },
  { href: "/about", key: "about" },
];

const SHOW_LANGUAGE_SWITCHER = true;

// Only locales actually wired up in i18n.ts's `locales` array belong here.
// ar/fa/hi/ta are planned future languages — add them here once they're
// added to i18n.ts (as real locales or via PLACEHOLDER_LOCALES for a
// "coming soon" page) so they don't 404 if a user picks them.
const languages = [
  { code: "de", name: "Deutsch" },
  { code: "en", name: "English" },
];

export function Navigation() {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) ?? "de";
  const [isScrolled, setIsScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { user, role, loading, signOut } = useAuth();
  const myDashboard = dashboardPath(locale, role);

  const activeNavLinks = !loading && user
    ? role === "teacher" ? teacherNavLinks : studentNavLinks
    : publicNavLinks;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#071424]/95 backdrop-blur-md border-b border-white/5"
          : "bg-[#071424]/80 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div style={{ mixBlendMode: "screen" }} className="flex-shrink-0">
              <Image
                src="/Images/Deurschpilot_logo.png"
                alt=""
                width={44}
                height={44}
                className="h-8 w-8 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-bold tracking-[0.18em] text-white uppercase">
                DeutschPilot
              </span>
              <span className="text-[8px] tracking-[0.22em] text-[#CEA66F] uppercase mt-[2px]">
                {tFooter("tagline")}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {activeNavLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language dropdown */}
            {SHOW_LANGUAGE_SWITCHER && (
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="uppercase">{locale}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", langOpen && "rotate-180")} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 rounded-md bg-[#0B1B33] border border-white/10 shadow-xl overflow-hidden z-50">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={`/${lang.code}${pathWithoutLocale}`}
                      onClick={() => setLangOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm transition-colors hover:bg-white/5",
                        lang.code === locale ? "text-[#CEA66F] bg-[#CEA66F]/5" : "text-white/70 hover:text-white"
                      )}
                    >
                      {lang.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            )}

            {!loading && user ? (
              <>
                <Link href={`/${locale}/profile`} className="text-sm text-white/60 hover:text-white transition-colors">
                  {t("profile")}
                </Link>
                <Button
                  onClick={signOut}
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-red-400 hover:bg-red-400/10 flex items-center gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {t("logout")}
                </Button>
              </>
            ) : !loading ? (
              <>
                <Link href={`/${locale}/signin`}>
                  <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                    {t("login")}
                  </Button>
                </Link>
                <Link href={`/${locale}/signup`}>
                  <Button className="bg-[#D9B173] text-[#071424] hover:bg-[#B98A4E] font-semibold">
                    {t("register")}
                  </Button>
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-[#071424] border-white/10">
              <div className="flex flex-col gap-6 mt-8">
                {activeNavLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-lg font-medium text-white/80 hover:text-[#CEA66F] transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  </SheetClose>
                ))}

                {/* Language switcher in mobile */}
                {SHOW_LANGUAGE_SWITCHER && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">{t("language")}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <SheetClose asChild key={lang.code}>
                        <Link
                          href={`/${lang.code}${pathWithoutLocale}`}
                          className={cn(
                            "text-sm px-3 py-2 rounded text-center transition-colors border",
                            lang.code === locale
                              ? "bg-[#CEA66F]/10 text-[#CEA66F] border-[#CEA66F]/30"
                              : "text-white/60 hover:text-white hover:bg-white/5 border-white/10"
                          )}
                        >
                          {lang.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
                )}

                <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                  {!loading && user ? (
                    <>
                      <SheetClose asChild>
                        <Link href={myDashboard}>
                          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            {t("dashboard")}
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          onClick={signOut}
                          variant="ghost"
                          className="w-full text-white/60 hover:text-red-400 hover:bg-red-400/10 flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          {t("logout")}
                        </Button>
                      </SheetClose>
                    </>
                  ) : !loading ? (
                    <>
                      <SheetClose asChild>
                        <Link href={`/${locale}/signin`}>
                          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                            {t("login")}
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href={`/${locale}/signup`}>
                          <Button className="w-full bg-[#D9B173] text-[#071424] hover:bg-[#B98A4E] font-semibold">
                            {t("register")}
                          </Button>
                        </Link>
                      </SheetClose>
                    </>
                  ) : null}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
