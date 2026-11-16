import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LEGAL, SITE } from "@/lib/constants";

/**
 * Privacy policy (RGPD art. 13). Structure follows the AEPD "Guía para el
 * cumplimiento del deber de informar" (two layers: the basic layer sits under
 * the contact form, this page is the second layer).
 * Keep in sync with what the code really does: src/app/api/{contact,chat},
 * src/lib/server/*. Data controller fields live in LEGAL (constants.ts).
 */
export const metadata: Metadata = {
  title: "Política de privacidad | GT Dev Solutions",
  description: "Cómo tratamos los datos personales que nos facilita a través del formulario de contacto y del asistente virtual de gtdevsolutions.com.",
  robots: { index: true, follow: true },
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-white mt-10 mb-3">{children}</h2>;
}

export default function PrivacidadPage() {
  return (
    <main className="pt-28 pb-20 bg-section-dark">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-300 leading-relaxed space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-white">Política de privacidad</h1>
        <p className="text-sm text-gray-500">Última actualización: {LEGAL.lastUpdated}</p>

        <p>
          Esta política explica cómo se tratan los datos personales que usted nos facilita a través de
          gtdevsolutions.com: el formulario de contacto y el asistente virtual (chat). Se aplica el
          Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y
          garantía de los derechos digitales (LOPDGDD).
        </p>

        <H2>1. Responsable del tratamiento</H2>
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
        </ul>

        <H2>2. Qué datos tratamos</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Formulario de contacto:</strong> nombre, correo electrónico, teléfono, empresa o sector y el
            mensaje que escriba. Solo el correo y el mensaje son obligatorios.
          </li>
          <li>
            <strong>Asistente virtual:</strong> los mensajes que escriba en el chat y, si decide incluirlos, su
            correo electrónico o teléfono.
          </li>
          <li>
            <strong>Datos técnicos:</strong> la dirección IP desde la que se conecta y un identificador de
            conversación generado al azar, usados solo para evitar abusos y mantener el hilo del chat.
          </li>
        </ul>
        <p>Le pedimos que no incluya datos especialmente sensibles (salud, ideología, etc.) en sus mensajes.</p>

        <H2>3. Para qué los usamos y con qué base legal</H2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Atender su consulta y, si lo solicita, preparar una propuesta.</strong> Base legal: su
            consentimiento (art. 6.1.a RGPD), que presta al marcar la casilla del formulario o al escribirnos
            en el chat, y la aplicación de medidas precontractuales a petición suya (art. 6.1.b RGPD).
          </li>
          <li>
            <strong>Enviarle un correo automático de confirmación</strong> de que hemos recibido su consulta.
            Base legal: la misma que el punto anterior. No le enviaremos publicidad.
          </li>
          <li>
            <strong>Responder en el chat mediante un asistente de inteligencia artificial.</strong> Las
            respuestas las genera un modelo de lenguaje y pueden contener errores; no constituyen una oferta
            vinculante. Base legal: su consentimiento al usar el chat (art. 6.1.a RGPD).
          </li>
          <li>
            <strong>Prevenir abusos y spam</strong> (límites de envíos por dirección IP). Base legal: interés
            legítimo en proteger el servicio (art. 6.1.f RGPD).
          </li>
        </ul>
        <p>No tomamos decisiones automatizadas con efectos jurídicos sobre usted ni elaboramos perfiles.</p>

        <H2>4. Cuánto tiempo los conservamos</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Datos de contacto y consultas: el tiempo necesario para atenderlas y, si no se inicia una relación
            comercial, un máximo de 12 meses. Si se inicia, durante la relación y los plazos legales posteriores.
          </li>
          <li>Conversaciones del chat en el sistema del asistente: 24 horas.</li>
          <li>Registros técnicos para prevenir abusos (IP): un máximo de 24 horas.</li>
        </ul>

        <H2>5. Quién más accede a sus datos</H2>
        <p>
          No cedemos sus datos a terceros salvo obligación legal. Para prestar el servicio usamos proveedores que
          tratan los datos por cuenta nuestra (encargados del tratamiento):
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Vercel Inc. (alojamiento de la web y ejecución del servidor).</li>
          <li>Resend (envío de los correos del formulario).</li>
          <li>Google (Google Workspace: buzón de correo donde recibimos las consultas).</li>
          <li>Upstash (almacenamiento temporal de la conversación del chat y de los límites anti-abuso, y copia de seguridad de los datos de contacto recibidos durante 12 meses, en la UE).</li>
          <li>Anthropic (generación de las respuestas del asistente virtual).</li>
        </ul>

        <H2>6. Transferencias internacionales</H2>
        <p>
          Algunos de estos proveedores están establecidos en Estados Unidos o pueden tratar datos fuera del
          Espacio Económico Europeo. Las transferencias se amparan en la decisión de adecuación de la Comisión
          Europea sobre el Marco de Privacidad de Datos UE-EE.&nbsp;UU. (Decisión de Ejecución (UE) 2023/1795)
          cuando el proveedor está certificado, y en las cláusulas contractuales tipo de la Comisión Europea
          (Decisión (UE) 2021/914) en los demás casos:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Vercel Inc. (EE.&nbsp;UU.): certificada en el Marco de Privacidad de Datos UE-EE.&nbsp;UU.</li>
          <li>Google LLC (EE.&nbsp;UU.): certificada en el Marco de Privacidad de Datos UE-EE.&nbsp;UU.</li>
          <li>
            Resend: los datos se tratan en la región de la UE (Irlanda); la empresa, con sede en EE.&nbsp;UU., está
            certificada en el Marco de Privacidad de Datos UE-EE.&nbsp;UU. para cualquier acceso desde EE.&nbsp;UU.
          </li>
          <li>
            Upstash, Inc.: los datos se alojan en Fráncfort (UE); la empresa, con sede en EE.&nbsp;UU., está
            certificada en el Marco de Privacidad de Datos UE-EE.&nbsp;UU. para cualquier acceso desde EE.&nbsp;UU.
          </li>
          <li>
            Anthropic PBC (EE.&nbsp;UU.): no está certificada en el Marco de Privacidad de Datos; las transferencias
            se realizan mediante las cláusulas contractuales tipo de la Comisión Europea incorporadas en su
            addendum de tratamiento de datos. Solo recibe los mensajes que usted escribe en el chat.
          </li>
        </ul>
        <p>Puede solicitarnos información sobre estas garantías escribiendo a {LEGAL.privacyEmail}.</p>

        <H2>7. Sus derechos</H2>
        <p>
          Puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión, oposición,
          limitación del tratamiento y portabilidad, y retirar su consentimiento sin que ello afecte a la
          licitud del tratamiento previo. Escriba a{" "}
          <a href={`mailto:${LEGAL.privacyEmail}`} className="text-emerald-500 hover:underline">
            {LEGAL.privacyEmail}
          </a>{" "}
          indicando el derecho que desea ejercer. Le responderemos en el plazo máximo de un mes.
        </p>
        <p>
          Si considera que no hemos tratado sus datos correctamente, puede presentar una reclamación ante la
          Agencia Española de Protección de Datos (
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
            www.aepd.es
          </a>
          ).
        </p>

        <H2>8. Cookies y almacenamiento local</H2>
        <p>
          Esta web no usa cookies de analítica ni de publicidad. El asistente virtual guarda en su navegador
          (almacenamiento local) un identificador de conversación para mantener el hilo del chat; es necesario
          para el servicio que usted solicita al abrir el chat y puede borrarlo desde la configuración de su
          navegador.
        </p>

        <H2>9. Menores de edad</H2>
        <p>Este sitio no está dirigido a menores de 14 años. Si es menor de 14 años, no nos facilite datos personales.</p>

        <H2>10. Cambios en esta política</H2>
        <p>
          Podemos actualizar esta política para reflejar cambios legales o en el servicio. La fecha de la última
          actualización figura al inicio de esta página.
        </p>
      </article>
    </main>
  );
}
