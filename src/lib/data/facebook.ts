/**
 * Facebook 粉專動態 — Graph API 資料層。
 *
 * 由伺服器端用粉專 access token 抓貼文，前端只拿自家網域的 HTML，
 * 因此 Safari / iPad / 內容封鎖器等都能正常顯示（不像 iframe 內嵌會被擋）。
 *
 * 環境變數（.env.local）：
 * - FACEBOOK_PAGE_ID
 * - FACEBOOK_PAGE_ACCESS_TOKEN（建議用永不過期的 Page Token）
 *
 * 任何缺值或失敗都回傳空陣列，由前端退回 CTA 卡片，不讓首頁出錯。
 */
import type { FacebookPost } from "@/lib/types";

const GRAPH_VERSION = "v21.0";

type GraphPost = {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  permalink_url: string;
};

export async function getFacebookPosts(limit = 6): Promise<FacebookPost[]> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  if (!token || !pageId) return [];

  try {
    const params = new URLSearchParams({
      fields: "id,message,created_time,full_picture,permalink_url",
      // 多抓一些原始貼文，過濾掉空白貼文後仍有足夠數量
      limit: String(limit * 3),
      access_token: token,
    });
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/posts?${params}`,
      // 每 30 分鐘重新抓一次，避免每次請求都打 Graph API
      { next: { revalidate: 1800 } },
    );
    if (!res.ok) return [];

    const json: { data?: GraphPost[] } = await res.json();
    const data = Array.isArray(json.data) ? json.data : [];

    return data
      // 過濾空白貼文：必須有文字內容（純圖片 / 純打卡等視為空白）
      .filter((p) => p.message && p.message.trim().length > 0)
      .slice(0, limit)
      .map((p) => ({
        id: p.id,
        message: p.message!.trim(),
        createdTime: p.created_time,
        fullPicture: p.full_picture ?? null,
        permalink: p.permalink_url,
      } satisfies FacebookPost));
  } catch {
    return [];
  }
}
