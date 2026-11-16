import { MapPin, Clock } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function Location() {
  return (
    <section id="ubicacion" className="py-20 lg:py-28 bg-section-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Nuestra <span className="text-emerald-500">Ubicación</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <div className="rounded-xl overflow-hidden h-[400px]">
            <iframe
              src={SITE.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación GT Dev Solutions"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin size={24} className="text-emerald-500 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Dirección</h3>
                <p className="text-gray-400">{SITE.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock size={24} className="text-emerald-500 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Horario</h3>
                <p className="text-gray-400">{SITE.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
