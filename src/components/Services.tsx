import { SERVICES } from "@/lib/constants";

export default function Services() {
  return (
    <section id="servicios" className="py-20 lg:py-28 bg-section-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Nuestros <span className="text-emerald-500">Servicios</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ofrecemos soluciones tecnológicas avanzadas adaptadas a las necesidades específicas de tu empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <div
              key={service.title}
              className="reveal group bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-emerald-500/30 hover:scale-[1.02] transition-all duration-300"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-emerald-500 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
