import { Zap, Code, Bot } from "lucide-react";
import { SITE } from "@/lib/constants";

const pills = [
  { icon: Zap, label: "Automatización n8n" },
  { icon: Code, label: "Desarrollo Web & Apps" },
  { icon: Bot, label: "IA & Chatbots" },
];

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Transformamos tu Empresa con{" "}
          <span className="text-emerald-500">Automatización Inteligente e IA</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          {SITE.tagline}
        </p>

        <a
          href="#contacto"
          className="inline-block px-8 py-3 bg-emerald-500 text-black font-semibold rounded-full hover:bg-emerald-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/20"
          style={{ textShadow: 'none' }}
        >
          ¿Quieres saber cómo puedo ayudarte?
        </a>

        {/* Service pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-16">
          {pills.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-300"
            >
              <Icon size={16} className="text-emerald-500" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
