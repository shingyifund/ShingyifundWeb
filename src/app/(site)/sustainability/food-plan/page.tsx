import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Camera,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Footprints,
  GraduationCap,
  Snowflake,
  Sparkles,
  Users,
  Wheat,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getRequestLocale } from "@/i18n/request";

const APPLICATION_URL = "https://forms.gle/JajsgXJNHn77o2Pn6";
const PDF_URL = "/taoyuan-food-plan-visit-guide.pdf";

const content = {
  tw: {
    metadata: {
      title: "桃園市優食計畫｜惜食基地參訪",
      description: "認識桃園市政府優食計畫惜食基地的參訪內容、申請資格、開放時段與安全須知。",
    },
    eyebrow: "桃園市政府優食計畫",
    title: "走進惜食基地，\n看見食物的下一段旅程",
    intro: "從接收、檢驗、分揀到配送，認識一份仍可安心食用的物資，如何重新抵達需要的人手中。",
    apply: "申請團體參訪",
    readPdf: "閱讀參訪規範 PDF",
    applyHint: "請於預計參訪日前 14 至 30 天提出申請",
    factsLabel: "參訪前，先確認這些資訊",
    factsTitle: "一眼掌握參訪條件",
    facts: [
      { label: "開放對象", value: "機關、學校、社區、企業及公益團體", note: "暫不開放個人自由參觀" },
      { label: "團體人數", value: "每梯 15–40 人", note: "超過 40 人需分組或分梯" },
      { label: "開放日期", value: "週一至週五", note: "例假日及國定假日不開放" },
      { label: "參訪時段", value: "09:30／14:00", note: "上午場或下午場" },
      { label: "導覽時間", value: "約 60–90 分鐘", note: "包含簡報、導覽與問答" },
      { label: "審核時間", value: "3 個工作天內", note: "結果將寄送至申請人信箱" },
    ],
    journeyLabel: "惜食生命週期",
    journeyTitle: "參訪不只看見倉庫，更理解食物如何被珍惜",
    journeyIntro: "導覽依照惜食生命週期安排，從理解理念開始，走入實際作業現場，最後回到每個人的日常選擇。",
    journey: [
      { time: "20 分鐘", title: "惜食簡報", text: "認識計畫緣起、續食與格外品，以及基地串聯量販店、市場和弱勢關懷據點的方式。" },
      { time: "40 分鐘", title: "實地導覽", text: "走訪物資接收區、食安檢驗、分揀流程與低溫冷藏庫，理解基地的日常運作。" },
      { time: "20 分鐘", title: "反思與互動", text: "透過惜食遊戲與問答，把「吃多少、點多少」及剩食打包帶回生活。" },
    ],
    processLabel: "申請流程",
    processTitle: "送出表單後，接下來會發生什麼？",
    process: [
      { title: "線上提出申請", text: "填寫單位名稱、人數、希望參訪日期及特殊學習需求。機關如有參訪需求，請另函文桃園市政府社會局申請。" },
      { title: "基地審核檔期", text: "基地將確認參訪目的、人數與現場作業檔期，原則上於收件後 3 個工作天內完成審核。" },
      { title: "收到確認通知", text: "通過後會寄送確認電子郵件；如遇檔期衝突，將由專人聯繫協調日期。" },
      { title: "回傳行前資料", text: "參訪前 3 天回傳最終人數，以及公務車車牌號碼（若有），方便安排進出與停車。" },
    ],
    safetyLabel: "現場安全",
    safetyTitle: "基地仍在運作，請一起守護安全動線",
    safetyIntro: "參訪期間仍有物資搬運、機械設備與冷鏈作業，請全程跟隨導覽人員指引。",
    safety: [
      { title: "穿包頭平底鞋", text: "請勿穿拖鞋、涼鞋或高跟鞋，並建議穿著長褲。" },
      { title: "衡量冷鏈體驗", text: "冷藏庫約 4°C–7°C，進入前請評估自身身體狀況。" },
      { title: "不離隊、不觸碰", text: "請勿自行離開隊伍、觸摸倉儲物資或操作設備。" },
      { title: "依指示拍照", text: "作業人員工作畫面與含個資看板禁止拍攝。" },
    ],
    childNote: "國小（含）以下學童，需由家長或師長以 1：5 的比例全程陪同。",
    finalTitle: "準備好安排一場惜食學習之旅了嗎？",
    finalText: "送出申請前，建議先閱讀完整參訪規範，確認人數、日期及安全注意事項。",
  },
  en: {
    metadata: {
      title: "Taoyuan Food Plan | Food Rescue Base Visit",
      description: "Visitor eligibility, times, application process, and safety guidance for the Taoyuan Food Plan Food Rescue Base.",
    },
    eyebrow: "Taoyuan City Government Food Plan",
    title: "Step inside the food rescue base\nand follow food's next journey",
    intro: "See how safe, usable food moves from receiving and inspection through sorting and delivery to people who need it.",
    apply: "Apply for a group visit",
    readPdf: "Read the visit guide PDF",
    applyHint: "Please apply 14–30 days before your preferred visit date",
    factsLabel: "Before your visit",
    factsTitle: "Key visit requirements",
    facts: [
      { label: "Who may visit", value: "Institutions, schools, communities, companies and nonprofits", note: "Individual walk-in visits are unavailable" },
      { label: "Group size", value: "15–40 people", note: "Larger groups must be divided" },
      { label: "Open days", value: "Monday–Friday", note: "Closed on public holidays" },
      { label: "Visit times", value: "09:30 / 14:00", note: "Morning or afternoon session" },
      { label: "Duration", value: "About 60–90 minutes", note: "Briefing, tour and Q&A" },
      { label: "Review time", value: "Within 3 workdays", note: "The result is sent by email" },
    ],
    journeyLabel: "The food rescue life cycle",
    journeyTitle: "See the operation and understand why rescued food matters",
    journeyIntro: "The visit starts with the idea, moves into the working facility, and ends with practical choices everyone can take home.",
    journey: [
      { time: "20 min", title: "Food rescue briefing", text: "Learn how the plan connects retailers, markets, and community support locations." },
      { time: "40 min", title: "Facility tour", text: "Visit receiving, food safety inspection, sorting, and cold storage areas." },
      { time: "20 min", title: "Reflection and activity", text: "Use games and Q&A to turn food-saving ideas into daily habits." },
    ],
    processLabel: "Application process",
    processTitle: "What happens after you submit the form?",
    process: [
      { title: "Submit online", text: "Provide your organization, group size, preferred date, and any learning needs. Government institutions should also apply by official letter to the Department of Social Welfare." },
      { title: "Schedule review", text: "The base reviews the purpose, group size, and working schedule, generally within three workdays." },
      { title: "Receive confirmation", text: "Approved groups receive an email. Staff will contact you to discuss another date if needed." },
      { title: "Confirm final details", text: "Three days before the visit, send the final headcount and official vehicle plate number, if applicable." },
    ],
    safetyLabel: "On-site safety",
    safetyTitle: "The base remains operational during your visit",
    safetyIntro: "Goods handling, machinery, and cold-chain operations continue during visits. Please follow your guide at all times.",
    safety: [
      { title: "Wear closed flat shoes", text: "Slippers, sandals, and high heels are not permitted; long trousers are recommended." },
      { title: "Prepare for cold storage", text: "The cold room is about 4°C–7°C. Consider your health before entering." },
      { title: "Stay with the group", text: "Do not touch stored goods or operate equipment." },
      { title: "Follow photo guidance", text: "Do not photograph staff at work or boards containing personal information." },
    ],
    childNote: "Primary-school children and younger require one accompanying adult or teacher for every five children.",
    finalTitle: "Ready to plan a food-saving learning visit?",
    finalText: "Please read the full visit guide before applying and confirm your group size, date, and safety needs.",
  },
} as const;

const factIcons = [Building2, Users, CalendarCheck, Clock3, Sparkles, CheckCircle2];
const safetyIcons = [Footprints, Snowflake, Users, Camera];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return content[locale].metadata;
}

export default async function FoodPlanPage() {
  const locale = await getRequestLocale();
  const c = content[locale];

  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_22%,rgb(245_166_35/0.2),transparent_22%),radial-gradient(circle_at_82%_78%,rgb(143_180_221/0.2),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.07)_1px,transparent_0)] bg-size-[30px_30px]" />
        <Container className="relative grid min-h-[590px] items-center gap-12 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <Reveal>
            <p className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-amber-300">
              <Wheat className="size-5" strokeWidth={1.5} />
              {c.eyebrow}
            </p>
            <h1 className="mt-6 whitespace-pre-line font-serif text-3xl font-black leading-[1.25] tracking-wide sm:text-5xl sm:leading-[1.2] lg:text-[3.35rem]">
              {c.title}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-navy-100 sm:text-lg">{c.intro}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={APPLICATION_URL} target="_blank" rel="noopener noreferrer" size="lg">
                {c.apply}
                <ExternalLink data-icon="inline-end" />
              </Button>
              <Button href={PDF_URL} target="_blank" rel="noopener noreferrer" variant="white" size="lg">
                <FileText data-icon="inline-start" />
                {c.readPdf}
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-navy-200">
              <CalendarCheck className="size-4" />
              {c.applyHint}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative mx-auto aspect-square w-full max-w-[430px]">
              <div className="absolute inset-[8%] rounded-full border border-white/15" />
              <div className="absolute inset-[22%] rounded-full border border-amber-300/45" />
              <div className="absolute inset-[37%] flex items-center justify-center rounded-full bg-amber-400 text-navy-950 shadow-[0_0_80px_rgb(245_166_35/0.28)]">
                <Wheat className="size-16" strokeWidth={1.25} />
              </div>
              {["接收", "檢驗", "分揀", "配送"].map((label, index) => (
                <div
                  key={label}
                  className="absolute flex size-20 items-center justify-center rounded-full border border-white/20 bg-navy-800/90 font-serif text-base font-bold text-white shadow-lg backdrop-blur-sm"
                  style={[
                    { left: "4%", top: "40%" },
                    { left: "40%", top: "3%" },
                    { right: "3%", top: "40%" },
                    { bottom: "3%", left: "40%" },
                  ][index]}
                >
                  {locale === "tw" ? label : ["Receive", "Inspect", "Sort", "Deliver"][index]}
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-mist/60 py-16 sm:py-20">
        <Container>
          <Reveal>
            <header className="max-w-2xl">
              <p className="text-sm font-bold tracking-[0.18em] text-amber-700">{c.factsLabel}</p>
              <h2 className="mt-3 font-serif text-3xl font-black text-navy-900 sm:text-4xl">{c.factsTitle}</h2>
            </header>
          </Reveal>
          <div className="mt-10 grid overflow-hidden rounded-3xl border border-navy-100 bg-navy-100 shadow-card sm:grid-cols-2 lg:grid-cols-3">
            {c.facts.map((fact, index) => {
              const Icon = factIcons[index];
              return (
                <article key={fact.label} className="bg-white p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-bold tracking-[0.14em] text-amber-700">{fact.label}</p>
                      <h3 className="mt-2 text-lg font-bold leading-snug text-navy-900">{fact.value}</h3>
                    </div>
                    <Icon className="size-6 shrink-0 text-navy-400" strokeWidth={1.5} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink-muted">{fact.note}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <p className="text-sm font-bold tracking-[0.18em] text-amber-700">{c.journeyLabel}</p>
                <h2 className="mt-3 font-serif text-3xl font-black leading-tight text-navy-900 sm:text-4xl">{c.journeyTitle}</h2>
                <p className="mt-6 leading-8 text-ink-soft">{c.journeyIntro}</p>
              </div>
            </Reveal>
            <div className="flex flex-col gap-4">
              {c.journey.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.08}>
                  <article className="grid gap-5 rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-soft sm:grid-cols-[6rem_1fr] sm:p-8">
                    <div>
                      <span className="font-serif text-4xl font-black text-amber-400">{String(index + 1).padStart(2, "0")}</span>
                      <p className="mt-1 text-xs font-bold text-amber-800">{item.time}</p>
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-navy-900">{item.title}</h3>
                      <p className="mt-3 leading-7 text-ink-soft">{item.text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-amber-50/70 py-16 sm:py-20">
        <Container>
          <Reveal>
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold tracking-[0.18em] text-amber-700">{c.processLabel}</p>
              <h2 className="mt-3 font-serif text-3xl font-black text-navy-900 sm:text-4xl">{c.processTitle}</h2>
            </header>
          </Reveal>
          <ol className="mx-auto mt-12 grid max-w-6xl gap-4 lg:grid-cols-4">
            {c.process.map((step, index) => (
              <li key={step.title} className="relative rounded-2xl border border-amber-200 bg-white p-6 shadow-card">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-serif text-3xl font-black text-amber-400">{String(index + 1).padStart(2, "0")}</span>
                  {index < c.process.length - 1 && <ArrowRight className="hidden size-5 text-amber-400 lg:block" />}
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-navy-900 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.06)_1px,transparent_0)] bg-size-[28px_28px]" />
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <Reveal>
              <div>
                <p className="text-sm font-bold tracking-[0.18em] text-amber-300">{c.safetyLabel}</p>
                <h2 className="mt-3 font-serif text-3xl font-black leading-tight sm:text-4xl">{c.safetyTitle}</h2>
                <p className="mt-6 leading-8 text-navy-100">{c.safetyIntro}</p>
                <div className="mt-7 flex gap-3 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5 text-sm leading-7 text-amber-100">
                  <GraduationCap className="mt-0.5 size-5 shrink-0 text-amber-300" />
                  <p>{c.childNote}</p>
                </div>
              </div>
            </Reveal>
            <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {c.safety.map((item, index) => {
                const Icon = safetyIcons[index];
                return (
                  <article key={item.title} className="bg-navy-800 p-6 sm:p-7">
                    <Icon className="size-7 text-amber-300" strokeWidth={1.5} />
                    <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-navy-100">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-grain py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-5xl rounded-3xl border border-navy-100 bg-white p-8 text-center shadow-soft sm:p-12">
              <FileText className="mx-auto size-10 text-amber-500" strokeWidth={1.5} />
              <h2 className="mt-5 font-serif text-3xl font-black text-navy-900">{c.finalTitle}</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-ink-soft">{c.finalText}</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href={PDF_URL} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
                  <FileText data-icon="inline-start" />
                  {c.readPdf}
                </Button>
                <Button href={APPLICATION_URL} target="_blank" rel="noopener noreferrer" size="lg">
                  {c.apply}
                  <ExternalLink data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
