// src/pages/[slug].tsx (Pages Router)
import { GetStaticProps, GetStaticPaths } from "next";
import { ParsedUrlQuery } from "querystring";
import Head from "next/head";
import { getClient } from "@/lib/contentful/client";
import { PageContent, SEOMetadata } from "@/types/contentful";
import PageTemplate from "@/components/layouts/PageTemplate";
import PageSections from "@/components/sections/PageSections";
import ErrorPage from "@/components/common/ErrorPage";
import { generateSEO } from "@/lib/seo/metadata";

// Define interface for page props
interface PageProps {
  page: PageContent | null;
  seo: SEOMetadata;
  preview: boolean;
}

// Define interface for params from dynamic route
interface Params extends ParsedUrlQuery {
  slug: string;
}

export default function Page({ page, seo, preview }: PageProps) {
  // Handle case where page doesn't exist
  if (!page) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.ogTitle || seo.title} />
        <meta
          property="og:description"
          content={seo.ogDescription || seo.description}
        />
        {seo.ogImage && <meta property="og:image" content={seo.ogImage.url} />}
        <meta property="og:type" content="website" />
        <link rel="canonical" href={seo.canonicalUrl} />
        {/* Add structured data JSON-LD if available */}
        {seo.structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(seo.structuredData),
            }}
          />
        )}
      </Head>

      <PageTemplate>
        <PageSections sections={page.sections} />
      </PageTemplate>
    </>
  );
}

// Generate static paths for all pages
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const client = getClient();
    // Fetch all slugs for page entries
    // Adjust the content type ID to match your Contentful setup
    const { items } = await client.getEntries<PageContent>({
      content_type: "page",
      select: "fields.slug",
      limit: 1000, // Adjust based on your content volume
    });

    // Create paths from slugs
    const paths = items.map((item) => ({
      params: { slug: item.fields.slug },
    }));

    return {
      paths,
      // Fallback 'blocking' means pages not generated at build time will be generated on-demand
      // This enables incremental static regeneration for new content
      fallback: "blocking",
    };
  } catch (error) {
    console.error("[getStaticPaths] Failed to fetch slugs:", error);
    // Return empty paths, fallback blocking will handle runtime generation
    return { paths: [], fallback: "blocking" };
  }
};

// Generate static props for each page with ISR
export const getStaticProps: GetStaticProps<PageProps, Params> = async ({
  params,
  preview = false,
}) => {
  try {
    const slug = params?.slug;
    if (!slug) {
      return { notFound: true };
    }

    const client = getClient(preview);

    // Fetch page content by slug
    const { items } = await client.getEntries<PageContent>({
      content_type: "page",
      "fields.slug": slug,
      include: 2, // Include nested entries (adjust based on your content structure)
    });

    // If no page found, return 404
    if (items.length === 0) {
      return { notFound: true };
    }

    const page = items[0];

    // Generate SEO metadata
    const seo = generateSEO(page);

    // Return page data with ISR config
    return {
      props: {
        page: page,
        seo,
        preview: preview || false,
      },
      // Enable ISR with a revalidation period of 60 seconds
      revalidate: 60,
    };
  } catch (error) {
    console.error(
      `[getStaticProps] Error fetching page with slug ${params?.slug}:`,
      error
    );

    // Return graceful fallback in case of error
    return {
      notFound: true,
      // Still revalidate even on error, to try again later
      revalidate: 60,
    };
  }
};
