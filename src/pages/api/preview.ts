// src/pages/api/preview.ts
// API route for preview mode
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check the secret and slug
  if (
    req.query.secret !== process.env.CONTENTFUL_PREVIEW_SECRET ||
    !req.query.slug
  ) {
    return res.status(401).json({ message: "Invalid token or missing slug" });
  }

  // Fetch the page to check if it exists
  const slug = Array.isArray(req.query.slug)
    ? req.query.slug[0]
    : req.query.slug;

  try {
    // Enable Preview Mode by setting a cookie
    res.setPreviewData({});

    // Redirect to the path from the fetched page
    // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
    res.redirect(`/${slug === "home" ? "" : slug}`);
  } catch (error) {
    console.error("[Preview API] Error:", error);
    return res.status(500).json({ message: "Error enabling preview mode" });
  }
}
