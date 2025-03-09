// src/components/content-blocks/RichTextBlock/index.tsx
import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { RichTextProps } from "./types";
import { renderOptions } from "./renderOptions";
import { useRichTextStyles } from "./styles";

/**
 * Rich Text Block - Renders Contentful Rich Text content
 *
 * This component follows a pattern that separates:
 * 1. Component logic (this file)
 * 2. Type definitions (types.ts)
 * 3. Render options (renderOptions.ts)
 * 4. Styling logic (styles.ts)
 */
export const RichTextBlock: React.FC<RichTextProps> = ({
  content,
  className = "",
  customRenderers = {},
}) => {
  const styles = useRichTextStyles();

  // Merge default renderers with custom renderers
  const options = {
    ...renderOptions,
    renderNode: {
      ...renderOptions.renderNode,
      ...customRenderers,
    },
  };

  if (!content) {
    return null;
  }

  return (
    <div className={`rich-text ${styles.container} ${className}`}>
      {documentToReactComponents(content, options)}
    </div>
  );
};

// src/components/content-blocks/RichTextBlock/types.ts
import { Document } from "@contentful/rich-text-types";
import { NodeRenderer } from "@contentful/rich-text-react-renderer";

export interface RichTextProps {
  content: Document;
  className?: string;
  customRenderers?: {
    [key: string]: NodeRenderer;
  };
}

// src/components/content-blocks/RichTextBlock/renderOptions.ts
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { Options } from "@contentful/rich-text-react-renderer";
import Link from "next/link";

/**
 * Custom render options for Rich Text content from Contentful
 */
export const renderOptions: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
    [MARKS.CODE]: (text) => (
      <code className="px-1 py-0.5 bg-gray-100 rounded font-mono text-sm">
        {text}
      </code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="mb-4 last:mb-0">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="text-3xl font-bold mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="text-2xl font-bold mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="text-xl font-bold mb-2">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc pl-8 mb-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-decimal pl-8 mb-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li className="mb-1">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-1 italic my-4">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-6 border-t border-gray-300" />,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { title, description, file } = node.data.target.fields;
      const mimeType = file?.contentType;
      const url = file?.url;

      if (mimeType && mimeType.startsWith("image/")) {
        return (
          <figure className="my-6">
            <img
              src={`https:${url}`}
              alt={description || title || "Embedded image"}
              className="max-w-full rounded"
            />
            {title && (
              <figcaption className="mt-2 text-sm text-gray-600 text-center">
                {title}
              </figcaption>
            )}
          </figure>
        );
      }

      if (mimeType && mimeType.startsWith("video/")) {
        return (
          <figure className="my-6">
            <video
              controls
              src={`https:${url}`}
              className="max-w-full rounded"
            />
            {title && (
              <figcaption className="mt-2 text-sm text-gray-600 text-center">
                {title}
              </figcaption>
            )}
          </figure>
        );
      }

      return (
        <a
          href={`https:${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          Download {title || "attachment"}
        </a>
      );
    },
    [INLINES.HYPERLINK]: (node, children) => {
      const { uri } = node.data;
      const isInternal =
        uri.startsWith("/") ||
        uri.startsWith(process.env.NEXT_PUBLIC_SITE_URL || "");

      // Handle internal links with Next.js Link
      if (isInternal) {
        const href = uri.replace(process.env.NEXT_PUBLIC_SITE_URL || "", "");
        return (
          <Link href={href}>
            <a className="text-blue-600 hover:underline">{children}</a>
          </Link>
        );
      }

      // External links open in new tab with security attributes
      return (
        <a
          href={uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};

// src/components/content-blocks/RichTextBlock/styles.ts
import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";

/**
 * Hook for generating styles for rich text content
 * This centralizes styling logic and allows for theme-based styling
 */
export function useRichTextStyles() {
  const { theme } = useAppContext();

  return useMemo(
    () => ({
      container: `rich-text-container ${theme === "dark" ? "dark-mode" : ""}`,
    }),
    [theme]
  );
}
