// src/pages/api/config.ts
import type { NextApiRequest, NextApiResponse } from "next";

// Define public runtime config structure
type PublicRuntimeConfig = {
  featureFlags: {
    enableComments: boolean;
    enableSearch: boolean;
    // Other feature flags
  };
  contentful: {
    environment: string;
  };
  siteInfo: {
    name: string;
    locale: string;
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PublicRuntimeConfig>
) {
  // Return public config - can be linked to a database or external service
  // for dynamic configuration without redeployment
  res.status(200).json({
    featureFlags: {
      enableComments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === "true",
      enableSearch: process.env.NEXT_PUBLIC_ENABLE_SEARCH === "true",
    },
    contentful: {
      environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
    },
    siteInfo: {
      name: process.env.NEXT_PUBLIC_SITE_NAME || "Site Name",
      locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en-US",
    },
  });
}

