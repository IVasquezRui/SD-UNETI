import Image from "next/image";
import Link from "next/link";
import { getClient } from "@/lib/apollo-client";
import { GET_GENERAL_SETTINGS } from "@/lib/queries";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const client = getClient();
  let title = "UNETI Headless CMS";
  let description = "Bienvenidos al nuevo portal";

  try {
    const { data } = await client.query<{ generalSettings?: { title?: string; description?: string } }>({
      query: GET_GENERAL_SETTINGS,
    });
    if (data?.generalSettings) {
      title = data.generalSettings.title || title;
      description = data.generalSettings.description || description;
    }
  } catch (error) {
    console.error("Failed to fetch general settings", error);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white font-sans">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center justify-center py-32 px-8 sm:items-center">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#162953]">
            {title}
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl leading-8 text-slate-600">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-12 sm:flex-row">
          <Link
            href="http://netx.uneti.local/beta_sduneti"
            className="flex h-12 w-full items-center justify-center rounded-md bg-[#ef5b2b] px-8 text-white transition-colors hover:bg-[#d9481d] md:w-auto font-medium shadow-sm"
          >
            Ver Página Beta
          </Link>
          <a
            className="flex h-12 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-8 transition-colors hover:border-[#162953] hover:text-[#162953] text-slate-700 md:w-auto font-medium shadow-sm"
            href="http://wp.uneti.local/wp-admin"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ir a WordPress Admin
          </a>
        </div>
      </main>
    </div>
  );
}
