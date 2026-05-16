"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/kurse", key: "courses" },
  { href: "/online-akademie", key: "academy" },
  { href: "/retreats", key: "retreats" },
  { href: "/community", key: "community" },
  { href: "/uber-uns", key: "about" },
  { href: "/magazin", key: "magazine" },
];

export function Navigation() {
  const t = useTranslations("nav");
  const params = useParams();
  const locale = (params?.locale as string) ?? "de";
  const [isScrolled, setIsScrolled] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  const otherLocale = locale === "de" ? "en" : "de";
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const pathWithoutLocale = currentPath.replace(`/${locale}`, "") || "/";

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
          <Link href={`/${locale}` as any} className="flex items-center gap-2">
            {/* Wing icon — mix-blend-mode:screen makes dark navy bg invisible, gold stays */}
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
                Sprache. Zukunft. Du.
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}` as any}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={`/${otherLocale}${pathWithoutLocale}` as any}
              className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase">{locale}</span>
              <ChevronDown className="h-3 w-3" />
            </Link>
            <Link href={`/${locale}/login` as any}>
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                {t("login")}
              </Button>
            </Link>
            <Link href={`/${locale}/register` as any}>
              <Button className="bg-gold text-navy-900 hover:bg-gold/90 font-semibold">
                {t("register")}
              </Button>
            </Link>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-navy-900 border-white/10">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={`/${locale}${link.href}` as any}
                      className="text-lg font-medium text-white/80 hover:text-gold transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  </SheetClose>
                ))}
                <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                  <Link href={`/${locale}/login` as any}>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/register` as any}>
                    <Button className="w-full bg-gold text-navy-900 hover:bg-gold/90 font-semibold">
                      {t("register")}
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
