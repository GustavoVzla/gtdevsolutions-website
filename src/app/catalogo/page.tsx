import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Globe, Smartphone, Monitor, Zap, Bot, Wrench, Dumbbell, HeartPulse } from "lucide-react";
import { CATALOG_CATEGORIES } from "@/lib/constants";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Bot,
  Wrench,
  Dumbbell,
  HeartPulse,
};

export const metadata: Metadata = {
  title: "Catálogo de Prototipos | GT Dev Solutions",
  description: "24 prototipos interactivos organizados en 6 categorías: webs, apps, software, automatizaciones, chatbots y retainers.",
};

const TIER_COLORS: Record<string, string> = {
  Starter: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Pro: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Premium: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  Enterprise: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
};

const CATEGORY_ACCENT: Record<string, string> = {
  emerald: "border-emerald-500/30 hover:border-emerald-500/60",
  blue: "border-blue-500/30 hover:border-blue-500/60",
  violet: "border-violet-500/30 hover:border-violet-500/60",
  amber: "border-amber-500/30 hover:border-amber-500/60",
  rose: "border-rose-500/30 hover:border-rose-500/60",
  teal: "border-teal-500/30 hover:border-teal-500/60",
  red: "border-red-500/30 hover:border-red-500/60",
};

function HashScroller() {
  "use client";
  return (
    <script dangerouslySetInnerHTML={{ __html: `
      if (window.location.hash) {
        function tryScroll(attempts) {
          var el = document.getElementById(window.location.hash.substring(1));
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (attempts > 0) {
            requestAnimationFrame(function() { setTimeout(function() { tryScroll(attempts - 1); }, 200); });
          }
        }
        if (document.readyState === 'complete') {
          tryScroll(10);
        } else {
          window.addEventListener('load', function() { tryScroll(10); });
        }
      }
    `}} />
  );
}

export default function CatalogoPage() {
  return (
    <main className="pt-16">
      <HashScroller />
      {/* Hero */}
      <section className="bg-section-green py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/#proyectos"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-500 transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Volver a inicio
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Catálogo de <span className="text-emerald-500">Prototipos</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            24 prototipos interactivos organizados en 6 categorías. Cada uno es una demo funcional del producto final.
          </p>
          <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400 font-medium">
            24 Productos &bull; 6 Categorías
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {CATALOG_CATEGORIES.map((category) => (
            <div key={category.name} id={category.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')} className="mb-16 last:mb-0 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                {(() => {
                  const IconComponent = CATEGORY_ICONS[category.icon];
                  return IconComponent ? (
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10">
                      <IconComponent size={20} className="text-gray-300" />
                    </span>
                  ) : (
                    <span className="text-2xl">{category.icon}</span>
                  );
                })()}
                <div>
                  <h2 className="text-xl font-bold text-white">{category.name}</h2>
                  <span className="text-sm text-gray-500">{category.count} products</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.products.map((product) => (
                  <a
                    key={product.number}
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`reveal group block bg-[#111] border rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/5 ${CATEGORY_ACCENT[category.color] || "border-[#222]"}`}
                  >
                    {product.thumb && (
                      <div
                        className="w-full h-36 bg-cover bg-center"
                        style={{ backgroundImage: `url('${product.thumb}')` }}
                      />
                    )}
                    <div className="p-5">
                    <span className="text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider">
                      #{product.number}
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1 mb-1.5 group-hover:text-emerald-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-2">
                      {product.desc}
                    </p>
                    {product.demo && (
                      <p className="text-xs text-gray-600 mb-3 italic">
                        Demo: {product.demo}
                      </p>
                    )}
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${TIER_COLORS[product.tier] || ""}`}>
                      {product.tier}
                    </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-section-green text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            ¿Te interesa algún <span className="text-emerald-500">prototipo</span>?
          </h2>
          <p className="text-gray-400 mb-8">
            Cada prototipo se personaliza completamente para tu negocio. Contáctanos para convertir cualquiera de estas demos en tu producto real.
          </p>
          <Link
            href="/#contacto"
            className="inline-block px-8 py-3 bg-emerald-500 text-black font-semibold rounded-full hover:bg-emerald-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/20"
          >
            Solicitar presupuesto
          </Link>
        </div>
      </section>
    </main>
  );
}
