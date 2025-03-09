// ------------------------------------------------
// src/components/sections/ContentSection.tsx
// ------------------------------------------------
import React from "react";
import { RichTextBlock } from "@/components/content-blocks/RichTextBlock";
import { Entry } from "contentful";
import { ContentSectionFields } from "@/types/contentful";

interface ContentSectionProps {
  section: Entry<ContentSectionFields>;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ section }) => {
  const { title, subtitle, content, alignment = "center" } = section.fields;

  // Generate alignment classes based on the chosen alignment
  const alignmentClasses =
    {
      left: "text-left",
      center: "text-center mx-auto",
      right: "text-right ml-auto",
    }[alignment] || "text-left";

  return (
    <section className="py-12 px-4">
      <div className={`max-w-prose ${alignmentClasses}`}>
        {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
        {subtitle && <p className="text-xl text-gray-600 mb-6">{subtitle}</p>}
        {content && <RichTextBlock content={content} />}
      </div>
    </section>
  );
};
