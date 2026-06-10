import { getClient } from "@/lib/apollo-client";
import { GET_PAGE_BY_SLUG, GET_PAGES } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

// We can optionally use generateStaticParams to statically generate known pages
// but for now we'll do SSR/ISR

export const revalidate = 60; // Revalidate every minute

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const client = getClient();
  
  try {
    const { data } = await client.query({
      query: GET_PAGE_BY_SLUG,
      variables: { id: params.slug },
    });

    if (!data?.page) {
      return notFound();
    }

    const { title, content } = data.page;
    const cleanContent = DOMPurify.sanitize(content);

    return (
      <div className="flex flex-col flex-1 items-center bg-white font-sans min-h-screen">
        <header className="w-full bg-[#162953] p-4 text-white">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl hover:text-slate-200 transition-colors">
              SD-UNETI
            </Link>
          </div>
        </header>

        <main className="flex flex-col w-full max-w-5xl py-16 px-8">
          <h1 className="text-4xl font-bold tracking-tight text-[#162953] mb-8">
            {title}
          </h1>
          
          {/* WordPress content is returned as HTML, so we use dangerouslySetInnerHTML */}
          <div 
            className="prose prose-slate max-w-none prose-headings:text-[#162953] prose-a:text-[#ef5b2b] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: cleanContent }} 
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error(`Failed to fetch page ${params.slug}`, error);
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-red-600">Error cargando la página</h1>
        <p className="mt-4">No se pudo conectar con WordPress.</p>
        <Link href="/" className="mt-8 text-[#ef5b2b] underline">Volver al inicio</Link>
      </div>
    );
  }
}
