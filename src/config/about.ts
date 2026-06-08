/**
 * 興毅緣起 — 組織歷史固定內容（單一來源）
 * 內容取自 https://www.shingyifund.org/about
 * 屬於不常變動的組織資料，故以 config 形式維護（非走 Supabase 資料層）。
 */

export type MilestoneEvent = {
  year: string;
  title: string;
  description: string;
};

export type AboutStat = {
  icon: "calendar" | "coins" | "store" | "target";
  value: string;
  label: string;
};

export type AboutValue = {
  icon: "heartHandshake" | "sprout" | "users";
  title: string;
  description: string;
};

export type ServiceScope = {
  icon:
    | "stethoscope"
    | "lifeBuoy"
    | "cloudRain"
    | "graduation"
    | "elderly"
    | "handshake"
    | "userCheck"
    | "bookOpen"
    | "sparkles";
  title: string;
  description: string;
};

export const aboutConfig = {
  /** 頁面主視覺 */
  hero: {
    en: "About ShingYi",
    title: "興毅緣起",
    couplet: ["興辦社福博施濟眾", "毅弘聖道繼往開來"],
  },

  /** 創辦緣起 */
  origin: {
    eyebrow: "創辦緣起",
    title: "一念慈悲，從這裡開始",
    founder: "吳靜宇 老先生",
    founderTitle: "興毅基金會 創辦人",
    paragraphs: [
      "創辦人吳靜宇老先生深知「慈悲」的意義，知其公益慈善事業為修道者的必要工作，不能漠視天災人禍中的災民與急待救濟的貧苦大眾。為此，聚集多位同修及幾間公司的捐助，集資叁仟萬元設立基金，於民國 82 年 7 月 16 日創辦了興毅慈善基金會，藉著造福社會以報天恩師德。",
      "基金會以「辦理社會福利相關項目、弘揚倫理道德並發揚人性光輝」為主要目標。興毅後學秉持創辦人所提示「興辦社福博施濟眾，毅弘聖道繼往開來」之精神，長期幫助兒少、老人、身心障礙或低收入戶等貧困老弱之民眾，舉辦各項公益活動，更於國內外災害時賑災、救災，落實慈善事業的發展。",
      "興毅成立第 28 年，近年來相繼於台北、新北及台南成立「忠信食物銀行」，針對經濟弱勢之家庭提供關懷訪視、物資補充等福利服務，協助改善弱勢家庭的生活。",
    ],
  },

  /** 創辦人語錄 */
  quote: {
    text: "真正的修道者，就是善用此生此身來完成菩薩行；修道不能徒唱高調，要有實際現行。",
    source: "吳靜宇《微明集（下）》",
    note: "博施濟眾之公益事業，正是弘道之先鋒和基礎。",
  },

  /** 大事紀 */
  milestones: [
    {
      year: "民國 82 年",
      title: "興毅慈善基金會創辦",
      description: "吳靜宇老先生集資三千萬元，於 7 月 16 日正式創立基金會。",
    },
    {
      year: "2016 年",
      title: "設立忠信食物銀行",
      description: "於臺北市文山區成立首座「忠信食物銀行」，串聯資源減少食物浪費。",
    },
    {
      year: "近年",
      title: "食物銀行據點擴展",
      description: "相繼於台北、新北及台南設立食物銀行，服務範圍持續擴大。",
    },
  ] as MilestoneEvent[],

  /** 核心數據 */
  stats: [
    { icon: "calendar", value: "28", label: "成立第 28 年" },
    { icon: "coins", value: "3,000萬", label: "創辦設立基金" },
    { icon: "store", value: "3+", label: "食物銀行據點" },
    { icon: "target", value: "14", label: "落實 SDGs 目標" },
  ] as AboutStat[],

  /** 核心精神 / 價值 */
  values: [
    {
      icon: "heartHandshake",
      title: "人飢己飢，人溺己溺",
      description: "以同理之心看待每一個需要，發揮人性至善之精神。",
    },
    {
      icon: "sprout",
      title: "弘揚倫理道德",
      description: "以公益慈善為弘道之基，發揚人性光輝、繼往開來。",
    },
    {
      icon: "users",
      title: "善盡社會責任",
      description: "善盡社會慈善法人之義務與責任，長期陪伴弱勢族群。",
    },
  ] as AboutValue[],

  /** 服務範圍 */
  services: {
    intro:
      "從急難救助、長者關懷到兒少福利，秉持「人飢己飢、人溺己溺」的同理心，發揮人性至善之精神，善盡社會慈善法人之義務與責任。",
    items: [
      {
        icon: "stethoscope",
        title: "醫療服務",
        description: "提供中醫義診，照顧弱勢族群的健康需求。",
      },
      {
        icon: "lifeBuoy",
        title: "急難救助",
        description: "個案訪視與關懷，協助家庭度過突發困境。",
      },
      {
        icon: "cloudRain",
        title: "災害救助",
        description: "投入國內外重大天然災害賑災，伸出援手。",
      },
      {
        icon: "graduation",
        title: "教育扶助",
        description: "協助偏鄉地區經濟缺乏的學生，不讓貧窮中斷學習。",
      },
      {
        icon: "elderly",
        title: "銀髮照顧",
        description: "長青課程、素食盒餐、重陽敬老、獨居長者環保清理。",
      },
      {
        icon: "handshake",
        title: "社會公益",
        description: "捐血活動、環保、監所教化、素食推廣等公益行動。",
      },
      {
        icon: "userCheck",
        title: "志工培訓",
        description: "辦理社會青年志工服務培訓，培育公益人才。",
      },
      {
        icon: "bookOpen",
        title: "讀經教育",
        description: "於北、中、南三區開辦兒童讀經班，紮根品格。",
      },
      {
        icon: "sparkles",
        title: "心靈教育",
        description: "道德成長課程與監所矯正教化，啟發人性向善。",
      },
    ] as ServiceScope[],
  },

  /** 食物銀行 */
  foodbank: {
    eyebrow: "忠信食物銀行",
    title: "讓每一份食物，都送到最需要的人手中",
    paragraphs: [
      "2016 年 5 月，於臺北市文山區設立「忠信食物銀行」，服務政府列冊且有需求的低收入戶，後續陸續於台南、新北成立據點。",
      "提供關懷訪視、食物及生活物資補充、急難救助、資源連結與轉介等服務，協助改善弱勢家庭之功能，避免其陷入貧窮的代間複製。",
    ],
    highlights: [
      "關懷訪視",
      "食物與生活物資補充",
      "急難救助",
      "資源連結與轉介",
    ],
  },
} as const;
