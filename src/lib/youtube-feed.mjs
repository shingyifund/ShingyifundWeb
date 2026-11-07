export const YOUTUBE_CHANNEL_ID = "UCQgUmF4zZ8t8hWmgCXAFv2w";
export const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

function decodeXmlEntities(text) {
  return text
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (entity, code) => {
      const value = code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code);
      return value <= 0x10ffff ? String.fromCodePoint(value) : entity;
    })
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

/** @returns {import("./types").YouTubeVideo[]} */
export function parseYouTubeFeed(xml) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  const videos = entries.map((match) => {
    const block = match[1];
    const id = block.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1]?.trim();
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
    const published = block.match(/<published>(.*?)<\/published>/)?.[1];
    if (!id || !/^[\w-]{11}$/.test(id) || !title || !published || !Number.isFinite(Date.parse(published))) {
      throw new Error("YouTube RSS contains an invalid video entry");
    }
    return { id, title: decodeXmlEntities(title), publishedAt: new Date(published).toISOString() };
  });
  if (!videos.length) throw new Error("YouTube RSS contains no videos");
  return videos;
}

/** @param {typeof fetch} [fetcher] */
export async function fetchYouTubeFeed(fetcher = fetch) {
  const response = await fetcher(YOUTUBE_FEED_URL, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`YouTube RSS HTTP ${response.status}`);
  return parseYouTubeFeed(await response.text());
}

/** @param {import("./types").YouTubeVideo[]} left
 * @param {import("./types").YouTubeVideo[]} right */
export function sameYouTubeVideos(left, right) {
  return left.length === right.length && left.every((video, index) => {
    const other = right[index];
    return video.id === other.id && video.title === other.title && Date.parse(video.publishedAt) === Date.parse(other.publishedAt);
  });
}
