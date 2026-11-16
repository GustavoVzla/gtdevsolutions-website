import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { PROJECTS, SITE } from "@/lib/constants";

export default function Projects() {
  return (
    <section id="proyectos" className="py-20 lg:py-28 bg-section-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Proyectos <span className="text-emerald-500 italic">Destacados</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conoce algunos de nuestros proyectos más recientes y descubre cómo podemos ayudar a tu empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {PROJECTS.map((project, i) => {
            const isExternal = project.link.startsWith("http");
            return (
              <div
                key={project.title}
                className="reveal group bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  {isExternal ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      Ver proyecto <ExternalLink size={14} />
                    </a>
                  ) : (
                    <Link
                      href={project.link}
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      Ver proyecto <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/catalogo"
            className="inline-block px-8 py-3 border-2 border-emerald-500 text-emerald-500 rounded-full font-medium hover:bg-emerald-500 hover:text-black transition-all duration-300"
          >
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
