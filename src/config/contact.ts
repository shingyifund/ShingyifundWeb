/**
 * 聯絡我們 — 五個服務據點固定資料（單一來源）
 * 內容取自 https://www.shingyifund.org/contact
 * 地圖以 Google Maps 官方 iframe 用地址查詢呈現（中文、位置準、合規）。
 */

export type ContactLocation = {
  id: string;
  name: string;
  isHQ?: boolean;
  address: string;
  tel: string;
  fax?: string;
  email: string;
};

export const contactLocations: ContactLocation[] = [
  {
    id: "hq",
    name: "興毅慈善基金會",
    isHQ: true,
    address: "100 臺北市中正區師大路160號",
    tel: "(02)2369-1200",
    fax: "(02)2369-1210",
    email: "shingyifund@gmail.com",
  },
  {
    id: "taipei",
    name: "台北忠信食物銀行",
    address: "台北市文山區興隆路四段42巷3號1樓",
    tel: "(02)2936-3199",
    email: "sytp@shingyifund.org",
  },
  {
    id: "tainan",
    name: "台南忠信食物銀行",
    address: "台南市安定區新吉里125之16號1棟",
    tel: "(06)593-2882",
    email: "sytn@shingyifund.org",
  },
  {
    id: "newtaipei",
    name: "新北忠信食物銀行",
    address: "242 新北市新莊區新北大道七段385號",
    tel: "(02)2202-8863",
    email: "synt@shingyifund.org",
  },
  {
    id: "taoyuan",
    name: "桃園惜食基地",
    address: "桃園市八德區重慶街36號",
    tel: "(03)365-5336",
    email: "syty@shingyifund.org",
  },
];
