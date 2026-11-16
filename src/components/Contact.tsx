"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { LEGAL, SITE } from "@/lib/constants";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      nombre: (form.elements.namedItem("nombre") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      telefono: (form.elements.namedItem("telefono") as HTMLInputElement).value,
      empresa: (form.elements.namedItem("empresa") as HTMLInputElement).value,
      mensaje: (form.elements.namedItem("mensaje") as HTMLTextAreaElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "",
      privacidad: (form.elements.namedItem("privacidad") as HTMLInputElement).checked,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="py-20 lg:py-28 bg-section-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left text */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-emerald-500">Contáctanos</span> para más información
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Estamos aquí para ayudarte con soluciones de automatización, desarrollo web e inteligencia artificial. Completa el formulario y nos pondremos en contacto contigo.
            </p>
          </div>

          {/* Form */}
          <div>
            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle size={48} className="text-emerald-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mensaje enviado</h3>
                <p className="text-gray-400">Te responderemos lo antes posible.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-emerald-500 hover:text-emerald-400 text-sm"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot: hidden from humans, bots fill it */}
                <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label>
                    No rellenar este campo
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Nombre completo</label>
                  <input
                    name="nombre"
                    type="text"
                    placeholder="Ingresa tu nombre aquí"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Correo electrónico *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Ingresa tu correo aquí"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Número de teléfono</label>
                  <input
                    name="telefono"
                    type="tel"
                    placeholder="Ingresa tu número de contacto"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Nombre y sector de tu empresa</label>
                  <input
                    name="empresa"
                    type="text"
                    placeholder="Ej. GT Dev Solutions, Tecnología"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Mensaje o consulta *</label>
                  <textarea
                    name="mensaje"
                    required
                    rows={4}
                    placeholder="Escribe tu mensaje aquí"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-gray-300">
                  <input
                    name="privacidad"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 accent-emerald-500"
                  />
                  <span>
                    He leído y acepto la{" "}
                    <Link href="/privacidad" className="text-emerald-500 underline hover:text-emerald-400">
                      política de privacidad
                    </Link>
                    . *
                  </span>
                </label>

                <p className="text-xs text-gray-500 leading-relaxed">
                  <strong className="text-gray-400">Información básica sobre protección de datos.</strong>{" "}
                  Responsable: {LEGAL.controllerName}. Finalidad: atender su consulta y enviarle una confirmación
                  de recepción. Legitimación: su consentimiento y la aplicación de medidas precontractuales a
                  petición suya. Destinatarios: no se ceden datos a terceros, salvo obligación legal; los
                  proveedores tecnológicos pueden tratarlos fuera de la UE con garantías adecuadas. Derechos:
                  acceso, rectificación, supresión y otros, escribiendo a {LEGAL.privacyEmail}. Más información en
                  la{" "}
                  <Link href="/privacidad" className="underline hover:text-gray-300">
                    política de privacidad
                  </Link>
                  .
                </p>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    <span>
                      Error al enviar. Inténtalo de nuevo o escríbenos por{" "}
                      <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="underline">
                        WhatsApp
                      </a>{" "}
                      o a{" "}
                      <a href="mailto:soluciones@gtdevsolutions.com" className="underline">
                        soluciones@gtdevsolutions.com
                      </a>
                      .
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  {status === "sending" ? "Enviando..." : "Enviar consulta"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
