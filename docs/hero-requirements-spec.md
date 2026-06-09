# Hero 計劃需求規格書

## 1. 文件目的

本文件用來定義首頁 Hero 輪播的需求、資料結構、後台維護流程與驗收標準，作為後續開發與驗收對照依據。

---

## 2. 目標

建立一套可由後台維護的 Hero 管理系統，支援多種內容型態，並讓前台首頁依設定正確顯示。

目前規劃支援三種 Hero 型態：

1. 單純圖片
2. 圖片加文字
3. YouTube 影片

---

## 3. 使用情境

### 3.1 後台管理者

- 可新增 Hero 項目
- 可編輯 Hero 項目
- 可切換是否顯示
- 可調整排序
- 可刪除項目
- 可上傳圖片

### 3.2 前台訪客

- 首頁只看到啟用中的 Hero 項目
- Hero 依排序顯示
- 不同型態以對應方式呈現

---

## 4. Hero 型態定義

### 4.1 image

用途：
純視覺主圖，不帶文字內容。

前台顯示：
- 顯示圖片
- 不顯示標題、副標題、CTA

### 4.2 image_text

用途：
圖片搭配文案與按鈕，作為主要宣傳型 Hero。

前台顯示：
- 顯示圖片
- 可顯示主標題
- 可顯示副標題
- 可顯示 CTA 按鈕

### 4.3 youtube

用途：
以 YouTube 影片作為 Hero 內容。

前台顯示：
- 顯示 YouTube 影片
- 可選擇是否顯示封面圖
- 可選擇是否顯示標題與副標題

---

## 5. 後台表單需求

後台建立或編輯 Hero 時，先選擇內容型態，再依型態顯示欄位。

### 5.1 共用欄位

- `content_type`
- `sort_order`
- `is_active`

### 5.2 image 欄位

- `image_url`

### 5.3 image_text 欄位

- `image_url`
- `has_title`
- `title`
- `has_subtitle`
- `subtitle`
- `has_cta`
- `cta_label`
- `cta_href`
- `tone`

### 5.4 youtube 欄位

- `youtube_url`
- `youtube_video_id`
- `poster_image_url`
- `has_title`
- `title`
- `has_subtitle`
- `subtitle`

---

## 6. 表單互動規則

### 6.1 型態切換

- 管理者先選擇 Hero 型態
- 表單只顯示該型態所需欄位

### 6.2 標題與副標題

- 需提供 `是否顯示主標題` switch
- 開啟後才顯示 `title` input
- 關閉時不顯示 input，送出時資料應為 `null`

- 需提供 `是否顯示副標題` switch
- 開啟後才顯示 `subtitle` input
- 關閉時不顯示 input，送出時資料應為 `null`

### 6.3 CTA

- 僅 `image_text` 型態提供 `是否顯示按鈕` switch
- 開啟後才顯示 `cta_label` 與 `cta_href`
- 關閉時兩欄送出為 `null`

### 6.4 YouTube

- `youtube_url` 輸入後，系統需可解析出 `youtube_video_id`
- 若解析失敗，需阻止送出並顯示錯誤訊息

---

## 7. 列表頁需求

`/admin/hero` 列表需顯示：

- 預覽圖或影片型態標示
- Hero 型態
- 標題
- 顯示狀態
- 排序操作
- 編輯操作
- 刪除操作

列表頁需支援：

- 上下排序
- 顯示/停用切換
- 進入新增頁
- 進入編輯頁

---

## 8. 前台呈現需求

### 8.1 共通規則

- 只讀取 `is_active = true` 的資料
- 依 `sort_order` 排序

### 8.2 image

- 顯示圖片
- 不顯示文案區

### 8.3 image_text

- 顯示圖片
- 若 `has_title = true`，顯示主標題
- 若 `has_subtitle = true`，顯示副標題
- 若 `has_cta = true`，顯示按鈕

### 8.4 youtube

- 顯示 YouTube 影片內容
- 若設計上先不直接嵌入播放器，可先顯示封面圖與播放入口
- 若 `has_title = true`，顯示主標題
- 若 `has_subtitle = true`，顯示副標題

---

## 9. 建議資料表欄位

資料表名稱：`hero_slides`

建議欄位：

- `id`
- `content_type`
- `title`
- `has_title`
- `subtitle`
- `has_subtitle`
- `image_url`
- `poster_image_url`
- `youtube_url`
- `youtube_video_id`
- `has_cta`
- `cta_label`
- `cta_href`
- `tone`
- `sort_order`
- `is_active`
- `created_at`
- `updated_at`

---

## 10. 後端邏輯需求

- 新增資料時，自動給予排序值
- 更新資料時，需更新 `updated_at`
- 刪除資料時，若圖片在 `hero-images` bucket，需同步刪除
- 變更後需 revalidate 前台首頁與 Hero 後台頁面

---

## 11. 非功能需求

- 後台入口需受登入與授權保護
- 後台介面保持精簡，不增加多餘描述資訊
- 表單欄位只在需要時顯示
- 可擴充其他後台模組，不把整個後台綁死在 Hero

---

## 12. 驗收標準

### 12.1 後台

- 可新增 `image` 型 Hero
- 可新增 `image_text` 型 Hero
- 可新增 `youtube` 型 Hero
- 不同型態只顯示對應欄位
- 標題、副標題、CTA 可由 switch 控制是否出現
- 可排序
- 可切換顯示狀態
- 可刪除

### 12.2 前台

- 前台首頁能正確讀取三種型態
- 非啟用項目不顯示
- 排序正確
- 有文字的項目顯示對應文案
- YouTube 項目可正常呈現

---

## 13. 目前實作狀態

已完成：

- `/admin` 總覽入口
- `/admin/hero` 管理列表
- 新增 / 編輯 / 刪除 / 排序 / 顯示切換
- 圖片上傳

待完成：

- Hero 型態切換
- 標題/副標題 switch 顯示控制
- YouTube 型態
- 新資料表 schema
- 前台三型態渲染

---

## 14. SQL 交付原則

後續提供 SQL 時，需包含：

1. 刪除舊 `hero_slides` table
2. 重建新 `hero_slides` table
3. 必要 index
4. `updated_at` 自動更新機制
5. 範例測試資料

本文件確認後，下一步再依此輸出正式 SQL。
