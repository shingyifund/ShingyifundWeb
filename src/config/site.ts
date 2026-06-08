/** 興毅基金會 — 組織常數資訊（單一來源） */
export const siteConfig = {
  name: "財團法人興毅社會福利慈善事業基金會",
  shortName: "興毅基金會",
  enName: "Shing Yi Charity Foundation",
  slogan: "讓愛延續，讓需要被看見",
  description: "透過社會救助與食物銀行服務，陪伴弱勢家庭度過難關。",
  url: "https://www.shingyifund.org",

  contact: {
    address: "100033 臺北市中正區師大路160號",
    tel: "(02)2369-1200",
    fax: "(02)2369-1210",
    email: "shingyifund@gmail.com",
  },

  /** 立案資訊 */
  registration: {
    approval: "內政部 82年6月29日 台內社第8285270號",
    fundraising: "衛部救字第1141361944號",
    selfRegulation: "FN0326",
    foundedDate: "民國 82 年 7 月 16 日",
  },

  /** 捐款資訊 */
  donation: {
    bank: "第一銀行古亭分行",
    bankAccount: "171-50-188904",
    postal: "17477861",
    loveCode: "0103115",
  },

  social: {
    facebook: "https://www.facebook.com/shingyifund",
    youtube: "https://www.youtube.com/@shingyifund",
  },

  /** 網站版本號（每次改版手動更新） */
  version: "v0.1.11",
} as const;

export type SiteConfig = typeof siteConfig;
