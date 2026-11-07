import { readFile, writeFile, rename } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { fetchYouTubeFeed, sameYouTubeVideos, YOUTUBE_CHANNEL_ID } from "../src/lib/youtube-feed.mjs";

export async function syncYouTubeSnapshot({
  snapshotPath = fileURLToPath(new URL("../src/data/youtube-videos.json", import.meta.url)),
  loadFeed = fetchYouTubeFeed,
} = {}) {
  const local = JSON.parse(await readFile(snapshotPath, "utf8"));
  if (local.channelId !== YOUTUBE_CHANNEL_ID || !local.videos?.length) {
    throw new Error("A valid local YouTube snapshot is required");
  }
  let remote;
  try {
    remote = await loadFeed();
    if (!remote.length) throw new Error("YouTube RSS contains no videos");
  } catch (error) {
    console.warn(`[YouTube sync] Keeping local snapshot: ${error.message}`);
    return "fallback";
  }
  if (sameYouTubeVideos(local.videos, remote)) {
    console.info("[YouTube sync] No changes; local file unchanged.");
    return "unchanged";
  }
  const updated = { channelId: YOUTUBE_CHANNEL_ID, verifiedAt: new Date().toISOString(), videos: remote };
  const temporaryPath = `${snapshotPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
  await rename(temporaryPath, snapshotPath);
  console.info(`[YouTube sync] Saved ${remote.length} videos to local snapshot.`);
  return "updated";
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await syncYouTubeSnapshot();
}
