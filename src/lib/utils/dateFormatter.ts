// src/lib/utils/dateFormatter.ts

/**
 * Formats a date string into a human-readable format
 * Supports multiple locale formats based on user preferences
 *
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (defaults to 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error(`Invalid date: ${dateString}`);
      return "Invalid date";
    }

    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error(`Error formatting date ${dateString}:`, error);
    return "Date unavailable";
  }
}

/**
 * Returns a relative time string (e.g., "2 days ago", "just now")
 *
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (defaults to 'en-US')
 * @returns Relative time string
 */
export function getRelativeTimeString(
  dateString: string | Date,
  locale: string = "en-US"
): string {
  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error(`Invalid date: ${dateString}`);
      return "Invalid date";
    }

    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Use Intl.RelativeTimeFormat if available
    if (typeof Intl !== "undefined" && Intl.RelativeTimeFormat) {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

      if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, "second");
      } else if (diffInMinutes < 60) {
        return rtf.format(-diffInMinutes, "minute");
      } else if (diffInHours < 24) {
        return rtf.format(-diffInHours, "hour");
      } else if (diffInDays < 30) {
        return rtf.format(-diffInDays, "day");
      } else {
        // For older dates, fall back to standard format
        return formatDate(date, locale);
      }
    }

    // Fallback for browsers that don't support RelativeTimeFormat
    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    } else {
      return formatDate(date, locale);
    }
  } catch (error) {
    console.error(`Error calculating relative time for ${dateString}:`, error);
    return "Date unavailable";
  }
}
