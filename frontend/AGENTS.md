<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Configuration - UNETI Next.js Stack

## Contexto
Migración de WordPress a un ecosistema moderno: Next.js 16 (App Router) + TypeScript + Tailwind CSS + Shadcn/ui.

## Instrucciones de Desarrollo
1. **Prioridad Visual:** Interfaz "Light Mode" dominante. El espacio en blanco es una herramienta de diseño fundamental para la claridad institucional.
2. **Implementación de Colores:** 
   - Mantener el fondo en `#ffffff`.
   - Reservar `#ef5b2b` para botones de acción.
   - Usar el resto de la paleta solo para acentos discretos.
3. **Estructura React:**
   - Priorizar componentes reutilizables en `@/components/ui`.
   - Animaciones con `framer-motion`: fade-in al cargar y hover dinámico en cards.
   - Seguir las pautas de accesibilidad web (WCAG 2.1 AA).
4. **Optimización:**

   - Uso obligatorio de `next/image` para el logo institucional.
   - Fuentes locales o Google Fonts con `next/font`.
   - Tailwind CSS para el estilizado y animaciones con framer-motion.
   - Shadcn/ui para los componentes.
   - Lucide React para la iconografía.
   
## Stack Tecnológico
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Componentes:** Shadcn/ui (Radix UI)
- **Iconografía:** Lucide React
- **Animaciones:** Framer Motion
