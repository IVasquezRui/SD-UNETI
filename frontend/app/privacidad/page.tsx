import type { Metadata } from "next";
import EncabezadoSitio from "../componentes/EncabezadoSitio";
import PieSitio from "../componentes/PieSitio";
import TituloPagina from "../componentes/TituloPagina";
import { CONTACTO } from "../lib/institucional";

export const metadata: Metadata = {
  title: "Privacidad | UNETI",
  description:
    "Política de privacidad y tratamiento de datos personales del portal de la Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI).",
};

const DATOS = [
  "Datos de identificación y contacto que envías en los formularios: nombre, cédula, correo electrónico, teléfono, programa de interés y mensaje.",
  "Datos de los comentarios públicos: nombre, correo (opcional) y contenido del comentario.",
  "Datos técnicos mínimos de seguridad: dirección IP almacenada únicamente como hash, agente del navegador y fecha de la solicitud.",
];

const FINALIDADES = [
  "Gestionar solicitudes de admisión a los PNF y a los posgrados (PNFA), así como los mensajes de contacto.",
  "Responder consultas y dar seguimiento con el número de ticket asignado.",
  "Publicar comentarios en las noticias cuando el usuario lo solicita.",
  "Prevenir abuso, spam y accesos no autorizados al portal.",
  "Cumplir obligaciones institucionales y legales de registro.",
];

const DERECHOS = [
  "Conocer qué datos personales tratamos y con qué finalidad.",
  "Solicitar la rectificación de datos inexactos o incompletos.",
  "Solicitar la supresión de los datos cuando ya no sean necesarios.",
  "Oponerte al tratamiento o solicitar su limitación.",
  "Solicitar la portabilidad de los datos que nos proporcionaste.",
];

export default function PrivacidadPage() {
  return (
    <>
      <EncabezadoSitio />
      <main>
        <TituloPagina
          title="Privacidad"
          subtitle="Cómo tratamos y protegemos tus datos personales."
          image="/assets/images/uneti/nosotros-graduados.webp"
          crumbs={[{ label: "Inicio", href: "/" }, { label: "Privacidad" }]}
          particleId="privacidad-page-particles"
        />

        <section className="position-relative overflow-hidden">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <span className="uneti-section-eyebrow mb-15px">Política de privacidad</span>
                <h2 className="alt-font text-dark-gray fw-600 ls-minus-3px mb-20px">
                  Tratamiento de datos personales
                </h2>
                <p className="mb-30px">
                  La Universidad Nacional Experimental de las Telecomunicaciones e Informática
                  (UNETI) trata los datos personales que recibe a través de este portal con
                  criterios de minimización, finalidad determinada, consentimiento informado y
                  seguridad de la información, en línea con la normativa venezolana de protección de
                  datos y con las buenas prácticas de los sistemas de gestión de privacidad.
                </p>

                <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-10px">
                  Responsable del tratamiento
                </h3>
                <p className="mb-25px">
                  {CONTACTO.name}. Dirección: {CONTACTO.address}. Correo de contacto:{" "}
                  <a href={`mailto:${CONTACTO.email}`} className="text-dark-gray fw-600">
                    {CONTACTO.email}
                  </a>
                  .
                </p>

                <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-10px">
                  Datos que tratamos
                </h3>
                <ul className="uneti-difference-list mb-30px">
                  {DATOS.map((dato) => (
                    <li key={dato}>{dato}</li>
                  ))}
                </ul>

                <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-10px">
                  Finalidades y base de licitud
                </h3>
                <p className="mb-10px">
                  El tratamiento se basa en el consentimiento que otorgas al marcar la casilla
                  correspondiente en cada formulario, en el interés legítimo de proteger el portal y
                  en el cumplimiento de obligaciones institucionales.
                </p>
                <ul className="uneti-difference-list mb-30px">
                  {FINALIDADES.map((finalidad) => (
                    <li key={finalidad}>{finalidad}</li>
                  ))}
                </ul>

                <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-10px">
                  Conservación y destino de los datos
                </h3>
                <p className="mb-20px">
                  Las solicitudes de admisión, posgrado y contacto se conservan durante un máximo de
                  doce (12) meses desde su recepción, salvo que deban mantenerse para una actuación
                  administrativa en curso. Los comentarios permanecen mientras la noticia esté
                  publicada. Los registros técnicos de seguridad se conservan por periodos breves y
                  la dirección IP no se almacena en texto claro.
                </p>
                <p className="mb-30px">
                  Los datos no se venden ni se ceden a terceros ajenos a la gestión universitaria. El
                  portal se apoya en el gestor de contenido institucional y en los servicios de
                  infraestructura de la propia universidad.
                </p>

                <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-10px">Tus derechos</h3>
                <ul className="uneti-difference-list mb-30px">
                  {DERECHOS.map((derecho) => (
                    <li key={derecho}>{derecho}</li>
                  ))}
                </ul>
                <p className="mb-30px">
                  Para ejercerlos, escribe a{" "}
                  <a href={`mailto:${CONTACTO.email}`} className="text-dark-gray fw-600">
                    {CONTACTO.email}
                  </a>{" "}
                  indicando tu nombre, el derecho que deseas ejercer y el número de ticket o la fecha
                  de tu solicitud.
                </p>

                <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-10px">Cookies y terceros</h3>
                <p className="mb-30px">
                  El portal utiliza únicamente cookies y almacenamiento técnico necesarios para su
                  funcionamiento. Al interactuar con contenidos incrustados (mapas de Google Maps o
                  videos de YouTube) esos proveedores pueden aplicar sus propias políticas de cookies.
                  No utilizamos cookies publicitarias ni de seguimiento propias.
                </p>

                <h3 className="alt-font fs-22 fw-600 text-dark-gray mb-10px">Seguridad</h3>
                <p className="mb-30px">
                  Aplicamos cifrado en tránsito cuando el portal se publica con HTTPS, control de
                  acceso, validación y saneamiento de entradas, limitación de peticiones, tokens
                  servidor-a-servidor y restricción de acceso al panel de administración. Puedes
                  revisar el canal de reporte de vulnerabilidades en{" "}
                  <a
                    href="/.well-known/security.txt"
                    className="text-dark-gray fw-600"
                    rel="nofollow"
                  >
                    security.txt
                  </a>
                  .
                </p>

                <p className="fs-14 mb-0">
                  Última actualización: 8 de noviembre de 2026. Cualquier cambio sustancial se
                  publicará en esta misma página.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PieSitio />
    </>
  );
}
