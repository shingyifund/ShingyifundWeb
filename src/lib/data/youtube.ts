import { unstable_cache } from "next/cache";
import snapshot from "@/data/youtube-videos.json";
import { fetchYouTubeFeed, YOUTUBE_CHANNEL_ID } from "@/lib/youtube-feed.mjs";
import type { YouTubeVideo } from "@/lib/types";

// After a failed RSS check, skip further requests on this instance for a while,
// so an outage does not trigger one RSS request per visitor.
const RETRY_COOLDOWN_MS = 10 * 60 * 1000;
let retryAfter = 0;

// Keep a single cache boundary: Next.js bypasses nested unstable_cache reads.
// Failures throw so the last successful list stays cached: a stale entry is
// kept when its refresh throws. A refresh is eligible after 24 hours, on the
// next page request.
const getCachedVideos = unstable_cache(
  async () => {
    if (Date.now() < retryAfter) throw new Error("RSS retry cooldown");
    try {
      return await fetchYouTubeFeed();
    } catch (error) {
      retryAfter = Date.now() + RETRY_COOLDOWN_MS;
      const message = error instanceof Error ? error.message : "RSS request failed";
      console.warn("[YouTube] Daily RSS check failed:", message);
      throw error;
    }
  },
  ["youtube-daily-v3", YOUTUBE_CHANNEL_ID],
  { revalidate: 86400 },
);

export async function getYouTubeVideos(limit = 4): Promise<YouTubeVideo[]> {
  try {
    return (await getCachedVideos()).slice(0, limit);
  } catch {
    // Only reached with no cached list yet (cold start) and a failed RSS check.
    return snapshot.videos.slice(0, limit);
  }
}
