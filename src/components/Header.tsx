"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;

    const sectionLinks = NAV_LINKS.filter((l) => l.href.startsWith("/#"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`/#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sectionLinks.forEach((link) => {
      const id = link.href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return isHome && activeSection === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const navClass = (href: string, mobile = false) =>
    mobile
      ? `block py-3 transition-colors ${
          isActive(href)
            ? "text-emerald-500 font-medium"
            : "text-gray-300 hover:text-emerald-500"
        }`
      : `text-sm transition-colors ${
          isActive(href)
            ? "text-emerald-500 font-medium"
            : "text-gray-300 hover:text-emerald-500"
        }`;

  const renderNavLink = (link: { label: string; href: string }, mobile = false) => {
    const isHashLink = link.href.startsWith("/#");

    // On home page, hash links use native <a> for reliable CSS smooth scroll
    if (isHome && isHashLink) {
      return (
        <a
          key={link.href}
          href={link.href.replace("/", "")}
          className={navClass(link.href, mobile)}
          onClick={() => setIsOpen(false)}
        >
          {link.label}
        </a>
      );
    }

    // Route links (Catálogo) and hash links from other pages use Next.js Link
    return (
      <Link
        key={link.href}
        href={link.href}
        className={navClass(link.href, mobile)}
        onClick={() => setIsOpen(false)}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-gt.png" alt="GT Dev Solutions" width={56} height={56} />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-emerald-500">GT</span> Dev Solutions
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => renderNavLink(link))}
          </nav>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden pb-4 border-t border-white/5">
            {NAV_LINKS.map((link) => renderNavLink(link, true))}
          </nav>
        )}
      </div>
    </header>
  );
}
