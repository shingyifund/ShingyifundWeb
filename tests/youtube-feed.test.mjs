import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fetchYouTubeFeed, parseYouTubeFeed, sameYouTubeVideos, YOUTUBE_CHANNEL_ID } from "../src/lib/youtube-feed.mjs";
import { syncYouTubeSnapshot } from "../scripts/sync-youtube.mjs";

const xml = `<feed><entry><yt:videoId>IBIxrjarc3Q</yt:videoId><title>食品 &amp; 生活 &#x611B;</title><published>2026-09-10T18:38:09-07:00</published></entry></feed>`;

test("RSS entries decode correctly and equivalent dates do not trigger updates", () => {
  const videos = parseYouTubeFeed(xml);
  assert.equal(videos[0].title, "食品 & 生活 愛");
  assert.equal(videos[0].publishedAt, "2026-09-11T01:38:09.000Z");
  assert.ok(sameYouTubeVideos(videos, [{ ...videos[0], publishedAt: "2026-09-10T18:38:09-07:00" }]));
});

test("404, network errors, empty feeds and malformed entries are failures", async () => {
  await assert.rejects(fetchYouTubeFeed(async () => new Response("", { status: 404 })), /404/);
  await assert.rejects(fetchYouTubeFeed(async () => { throw new Error("offline"); }), /offline/);
  assert.throws(() => parseYouTubeFeed("<feed />"), /no videos/);
  assert.throws(() => parseYouTubeFeed(xml.replace("IBIxrjarc3Q", "invalid")), /invalid/);
  assert.throws(() => parseYouTubeFeed(xml.replace("2026-09-10T18:38:09-07:00", "unknown")), /invalid/);
});

test("local sync preserves unchanged/failed snapshots and writes new videos", async () => {
  const directory = await mkdtemp(join(tmpdir(), "shingyi-youtube-test-"));
  const snapshotPath = join(directory, "videos.json");
  const videos = parseYouTubeFeed(xml);
  const original = JSON.stringify({ channelId: YOUTUBE_CHANNEL_ID, verifiedAt: "2026-11-07", videos });
  try {
    await writeFile(snapshotPath, original);
    assert.equal(await syncYouTubeSnapshot({ snapshotPath, loadFeed: async () => videos }), "unchanged");
    assert.equal(await readFile(snapshotPath, "utf8"), original);
    assert.equal(await syncYouTubeSnapshot({ snapshotPath, loadFeed: async () => { throw new Error("RSS 404"); } }), "fallback");
    assert.equal(await readFile(snapshotPath, "utf8"), original);
    assert.equal(await syncYouTubeSnapshot({ snapshotPath, loadFeed: async () => [] }), "fallback");
    assert.equal(await readFile(snapshotPath, "utf8"), original);
    const updated = [{ ...videos[0], id: "TERj22fxNDg", title: "New video" }, ...videos];
    assert.equal(await syncYouTubeSnapshot({ snapshotPath, loadFeed: async () => updated }), "updated");
    assert.deepEqual(JSON.parse(await readFile(snapshotPath, "utf8")).videos, updated);
  } finally {
    // Only remove the unique directory created by this test under the OS temp directory.
    assert.ok(directory.startsWith(join(tmpdir(), "shingyi-youtube-test-")));
    await rm(directory, { recursive: true, force: true });
  }
});
