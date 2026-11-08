SD-UNETI 08/11/2026

Estamos trabajando en el repo SD-UNETI ahora mismo. Antes que nada vas a subir a la rama develop la version del proyecto actual al repositorio SD-UNETI en el cual soy owner y colaborador directo. Vas a subirlo a la rama develop el cual la URL es "https://github.com/IVasquezRui/SD-UNETI/tree/develop". y Luego de subirlo, harás un PR a la rama main conmentando en el commit todos los avances del proyecto actual.

Ahora si, vamos a comenzar con las tareas que vas a completar una por una =

1# En este punto Actúa como Frontend Engineer especialista en CSS/Tailwind y UI/UX. En el componente de confirmación de envío de ticket (etiquetado con la insignia "TFSA"), el icono del check con su contenedor circular no está alineado con las ondas de pulso de fondo.

Realiza las siguientes correcciones técnicas:
1. **Contenedor Flexbox/Grid:** Asegúrate de que el contenedor padre de la animación de pulso utilice un layout flex con alineación centrada (`display: flex; align-items: center; justify-content: center;` o clases equivalentes en Tailwind como `flex items-center justify-center`).
2. **Posicionamiento Absoluto:** Si las ondas expansivas usan `position: absolute` para rodear al icono principal, verifica que el contenedor padre tenga `position: relative` y que las ondas estén centradas mediante transformaciones (`inset-0 m-auto` o `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`) para evitar desfases de caja.
3. **Validación de SVG/Icono:** Comprueba que el icono del check (`svg` o etiqueta de icono) tenga un contenedor con dimensiones fijas y equilibradas (`w-16 h-16` por ejemplo) para que el centrado de Flexbox actúe de forma simétrica.

2# Ver, analizar y corregir el envío de tickets en diseño de mobile y por qué no se envían. Que el portal web sea Responsive en todas sus paginas. Resumiendo información, y que los componentes sean un poco más pequeños y compactos para que la pagina se pueda ver “Fit” y no “XXXL”.

3# La animación de “Nosotros” sigue estando congelada y colgada, y no baja con el resto de información. Arregla ese bug, y que la animación realmente baje y cambie con cada punto. Te recuerdo; el componente de las imágenes tiene que bajar, no cambiar y quedarse pegado arriba en el punto 1.

4# En la pagina “Carreras”, En la ficha del programa -> elimina el item “titulo de la carrera”. Ya que se sobre entiende que el estudiante sale egresado de la UNETI con lo que dice “Salidas Profesionales”. Pero cambiaras “salidas profesionales” por -> “Titulos obtenidos”.
4.1# Vas a centrar los títulos en el componente “Titulos obtenidos” y le darás un toque entre azul y morado, sacados de la paleta de colores de la UNETI.
5# En cada pagina justificar los textos y párrafos, excepto los componentes como “botones” o “flashcards”

6# Sigue estando el bug de “saltos de cruz de pixeles” en las “flashcards” de la página “Nosotros”.

7# Pagina “cursos” cambiar botón de “admisiones” por “solicitar información” al link del numero de WhatsApp con mensaje personalizado “Hola, UNETI. Quiero saber más información sobre los cursos que ustedes dan.”

8# eliminar componente de redes sociales en la pagina “carreras” que dice ->
“Comunidad UNETI”. También de la pagina “posgrados”. 9# Sustituir el actual componente “Comunidad UNETI” en la pagina “Nosotros” por un componente detallado-animado de las 4 redes sociales de la universidad. Con imágenes estudiantiles que puedes sacar de la carpeta “STUDENTS” que se encuentra en el directorio “/Users/ivan/Desktop/ProyectosMacOS/SIS-UNETI-SISU-SD-UNETI/SD-UNETI/frontend/public/assets/images/uneti/”

10# A su vez, vas a crear un componente “simple-resumido” de las 4 redes sociales en la pagina principal sustituyendo el componente de YouTube. 

11# en el componente parallex “Nuestra historia Formamos ingenieros para la Venezuela Digital.” En la información del punto 4 “terriotio” hay una alucinación	y es que escribiste en su momento cuando hiciste el punto “núcleo altagracia” y realmente la UNETI solamente tiene sus dos sedes -> la sede administrativa y la sede CANTV, ninguna otra por los momentos.

12# En la pagina principal, en el apartado de cursos, tiene que haber la misma información resumida y no tan detallada que en la pagina “Cursos”. Y las FlashCards tienen que dar enlace al hacer click al curso que ha clikeado el usuario y enviarlo a la pagina de “Cursos”. No muestres o elimina del portal web el curso “Modelado 3D” ya que no existe todavía. Y no le pongas Imágenes. Coloca diseños minimalistas como logos. Como hiciste con los logos de los PNFA.

13# Quiero que no muestres mas las imagenes “nosotros-fondo.webp” y la imagen “nosotros-equipo.webp” en ninguna pagina del portal web. Excepto en las fotos de los estudiantes en los “testimonios” de la pagina principal.

14# En la página “Nosotros” Vas a mover de lugar el componente “Conoce nuestra casa de estudios” arriba, debajo/después del componente animado parallax, y arriba del componente “Tu ruta”.

15# Vas a añadir en un resumen dividido en 4 flashcards a mitad de la pagina principal la información que tienes en el documento “Modalidad_Hibrida.md”. Y la vas a detallar haciendo un apartado personalizado en la pagina “Nosotros” después del componente “Conoce nuestra casa de estudios”. De allí también vas a agarrar información para agregar en el punto 4 “territorio” de en la pagina “Nosotros”.

16# El componente completo y sus flashcards “TU RUTA” que se encuentra en la pagina “Nosotros” lo vas a mudar de la pagina “Nosotros” a la pagina principal. Colocándolo y sustituyendo en el actual componente “ECOSISTEMA UNETI” y todo lo demás que hay allí en ese componente.

17# En la pagina principal, en el Hero, quiero que solamente se muestren las ultimas dos imágenes.

18# Tienes que renderizar/hacer el componente de los cursos con una especie de viñeta con color según el curso. Tanto en sección de “cursos” en la pagina principal como en la pagina “Cursos”.

19# en la pagina de cada carrera PNF -> “Salidas profesionales
Avanza por etapas, obtén títulos progresivos”
centrar al centro los dos componentes de los títulos TSU e Ingeniería en carreras PNF y darles el toque entre azul y morado, sacados de la paleta de colores de la UNETI.

20# en la pagina de cada carrera PNF ->“Otra ruta
También puedes explorar”colocar tanto el componente PNF de la carrera vecina como los componentes de los PNFA

21# Y PUNTO IMPORTANTÍSIMO: Necesito que hagas un proceso de Hardening para toda la plataforma SD-UNETI como cybersecurity engineer and software arquitect basándotelos en SOC 2, ISO 27701, ISO 27001.

22# Recuerda actualizar la información del componente “Hamburguesa” de navegación rápida y que concuerde la información con todas las reformas y actualizaciones que hemos hecho en cada pagina si es necesaria una actualización.

Nota IMPORTANTE: Cuando completes cada punto, ejemplo -> (1#, 2#, y asi susecivamente... ) subes el proyecto a la rama develop con esa mejora/modificacion/reforma en un commit descrito y detallado. Y haces PR a la rama main segun el numero de la mejora siguiendo el las directrices de doc-as-code_2026-11-08.md.
