import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LEGAL, SITE } from "@/lib/constants";

/** Legal notice required by art. 10 of Ley 34/2002 (LSSI-CE). Data in LEGAL (constants.ts). */
export const metadata: Metadata = {
  title: "Aviso legal | GT Dev Solutions",
  description: "Datos identificativos del titular de gtdevsolutions.com y condiciones de uso del sitio.",
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-white mt-10 mb-3">{children}</h2>;
}

export default function AvisoLegalPage() {
  return (
    <main className="pt-28 pb-20 bg-section-dark">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-300 leading-relaxed space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-white">Aviso legal</h1>
        <p className="text-sm text-gray-500">Última actualización: {LEGAL.lastUpdated}</p>

        <H2>1. Datos identificativos</H2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de
          comercio electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Titular: {LEGAL.controllerName} (nombre comercial: {LEGAL.tradeName})
          </li>
          {LEGAL.controllerId ? <li>NIE: {LEGAL.controllerId}</li> : null}
          <li>Domicilio: {LEGAL.controllerAddress}</li>
          <li>
            Correo electrónico:{" "}
            <a href={`mailto:${LEGAL.privacyEmail}`} className="text-emerald-500 hover:underline">
              {LEGAL.privacyEmail}
            </a>
          </li>
          <li>Teléfono: {SITE.phone}</li>
          <li>Sitio web: gtdevsolutions.com</li>
        </ul>

        <H2>2. Objeto</H2>
        <p>
          Este sitio web informa sobre los servicios de automatización de procesos, desarrollo web y de
          aplicaciones, asistentes con inteligencia artificial y tecnología blockchain que ofrece {LEGAL.tradeName}, y
          permite contactar con el titular. La información publicada es orientativa y no constituye una oferta
          vinculante.
        </p>

        <H2>3. Condiciones de uso</H2>
        <p>
          El acceso a este sitio es gratuito y atribuye la condición de usuario. El usuario se compromete a hacer un
          uso adecuado de los contenidos y a no emplearlos para actividades ilícitas o contrarias a la buena fe, ni
          para enviar comunicaciones no solicitadas a través del formulario o del asistente virtual.
        </p>

        <H2>4. Propiedad intelectual e industrial</H2>
        <p>
          Los textos, diseños, logotipos, código y demás contenidos de este sitio son titularidad de{" "}
          {LEGAL.controllerName} o se usan con licencia. Las imágenes de terceros se usan conforme a sus licencias. No
          se permite su reproducción, distribución o transformación con fines comerciales sin autorización.
        </p>

        <H2>5. Responsabilidad</H2>
        <p>
          El titular no se hace responsable de los daños derivados de interrupciones del servicio, de errores en los
          contenidos ni de las respuestas generadas automáticamente por el asistente virtual, que tienen carácter
          informativo. Los enlaces a sitios de terceros se ofrecen por comodidad; el titular no controla ni responde
          de su contenido.
        </p>

        <H2>6. Protección de datos</H2>
        <p>
          El tratamiento de los datos personales se rige por la{" "}
          <Link href="/privacidad" className="text-emerald-500 hover:underline">
            política de privacidad
          </Link>
          .
        </p>

        <H2>7. Legislación aplicable</H2>
        <p>Este aviso legal se rige por la legislación española.</p>
      </article>
    </main>
  );
}
