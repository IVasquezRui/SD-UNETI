import { getClient } from "@/lib/apollo-client";
import { GET_PAGE_BY_SLUG } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

// We can optionally use generateStaticParams to statically generate known pages
// but for now we'll do SSR/ISR

export const revalidate = 60; // Revalidate every minute

async function fetchPageRest(slug: string) {
  const apiBase = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "http://wordpress/wp-json";
  const url = `${apiBase.replace(/\/$/, "")}/wp/v2/pages?slug=${encodeURIComponent(slug)}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`WordPress REST API error: ${response.status}`);
  }

  const pages = await response.json();
  if (!Array.isArray(pages) || pages.length === 0) {
    return null;
  }

  const page = pages[0];
  return {
    title: page.title?.rendered || slug,
    content: page.content?.rendered || "",
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = getClient();
  let pageData: { title: string; content: string } | null = null;

  try {
    const { data } = await client.query<{ page?: { title: string; content: string } | null }>({
      query: GET_PAGE_BY_SLUG,
      variables: { uri: `/${slug}/` },
    });

    if (data?.page) {
      pageData = {
        title: data.page.title,
        content: data.page.content,
      };
    }
  } catch (error) {
    console.error(`GraphQL failed for slug ${slug}`, error);
  }

  if (!pageData) {
    try {
      pageData = await fetchPageRest(slug);
    } catch (error) {
      console.error(`REST API failed for slug ${slug}`, error);
    }
  }

  if (!pageData) {
    return notFound();
  }

  const cleanContent = DOMPurify.sanitize(pageData.content);

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
          {pageData.title}
        </h1>
        
        {/* WordPress content is returned as HTML, so we use dangerouslySetInnerHTML */}
        <div 
          className="prose prose-slate max-w-none prose-headings:text-[#162953] prose-a:text-[#ef5b2b] prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: cleanContent }} 
        />
      </main>
    </div>
  );
}
