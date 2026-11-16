import Image from "next/image";
import { Linkedin } from "lucide-react";
import { ABOUT, SITE } from "@/lib/constants";

export default function About() {
  return (
    <section id="sobre-mi" className="py-20 lg:py-28 bg-section-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Sobre <span className="text-emerald-500">Mí</span>
            </h2>
            <p className="text-emerald-500 font-medium mb-6">{ABOUT.role}</p>
            <p className="text-gray-300 leading-relaxed mb-4">
              {ABOUT.bio}
            </p>
            <p className="text-gray-300 leading-relaxed mb-8">
              {ABOUT.mission}
            </p>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-full font-medium hover:bg-[#004182] transition-colors"
            >
              <Linkedin size={18} />
              Conecta conmigo en LinkedIn
            </a>
          </div>

          {/* Photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-72 h-90 sm:w-80 sm:h-[400px] lg:w-96 lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10">
              <Image
                src={ABOUT.photo}
                alt={ABOUT.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
