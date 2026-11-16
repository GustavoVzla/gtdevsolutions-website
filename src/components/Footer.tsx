import { Facebook, Instagram, Twitter, Linkedin, Github, Youtube, Phone, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.19 8.19 0 0 0 4.76 1.52V6.79a4.83 4.83 0 0 1-1-.1z" />
    </svg>
  ),
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
};

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-2">
              <span className="text-emerald-500">GT</span> Dev Solutions
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {SITE.tagline}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 hover:text-emerald-500 transition-colors">
                  <Phone size={14} /> {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-emerald-500 transition-colors">
                  <Mail size={14} /> {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-500 transition-colors">
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Síguenos
            </h4>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = iconMap[social.icon];
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-[#222] pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} GT Dev Solutions. Todos los derechos reservados.
          <span className="mx-2">·</span>
          <Link href="/privacidad" className="hover:text-emerald-500 transition-colors">
            Política de privacidad
          </Link>
          <span className="mx-2">·</span>
          <Link href="/aviso-legal" className="hover:text-emerald-500 transition-colors">
            Aviso legal
          </Link>
        </div>
      </div>
    </footer>
  );
}
