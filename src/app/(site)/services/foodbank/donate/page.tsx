import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowRight, HeartHandshake, Package, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { localizeHref } from "@/i18n/config";
import { getRequestLocale } from "@/i18n/request";

export const metadata: Metadata = {
  title: "忠信食物銀行 - 物資捐贈",
  description: "一起支持家庭的日常所需。了解忠信食物銀行所需物資、捐贈須知、親送與宅配方式、萊爾富愛心物資寄送及捐物收據申請。",
};

const steps = [
  "在店內 Life-ET 機台選擇「生活服務」。",
  "點選「愛心物資捐贈」。",
  "閱讀並確認防詐騙宣導、寄件注意事項及個資條款。",
  "選擇「興毅慈善基金會」。",
  "輸入商品價值及寄件人資料。",
  "確認資料後，列印寄件單。",
  "持寄件單與包裹，至櫃檯繳費寄件。",
];

function InfoTable({ headers, rows }: { headers: [string, string]; rows: string[][] }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-navy-100">
      <table className="w-full text-left text-sm leading-7 sm:text-base">
        <thead className="bg-navy-800 text-white">
          <tr>{headers.map((header) => <th key={header} scope="col" className="px-4 py-3 font-semibold sm:px-6">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {rows.map(([label, text]) => (
            <tr key={label} className="odd:bg-white even:bg-mist/50">
              <th scope="row" className="w-28 px-4 py-4 align-top font-semibold text-navy-800 sm:w-40 sm:px-6">{label}</th>
              <td className="px-4 py-4 align-top sm:px-6">{text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-navy-100 py-10 sm:py-14">
      <div className="mb-6 flex items-baseline gap-4">
        <span className="text-sm font-semibold tracking-widest text-amber-700">{number}</span>
        <h2 id={`${id}-title`} className="font-serif text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h2>
      </div>
      <div className="space-y-4 text-base leading-8 text-ink-soft">{children}</div>
    </section>
  );
}

export default async function FoodbankDonationPage() {
  const locale = await getRequestLocale();
  const contact = localizeHref("/about/contact", locale);
  const facebook = siteConfig.social.facebook;
  return (
    <Container className="pb-16 pt-12 sm:pb-24 sm:pt-20">
      <div className="mx-auto max-w-4xl md:pr-10 lg:pr-0">
        <header className="pb-10 sm:pb-14">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-amber-700"><HeartHandshake className="size-5" />一起支持家庭的日常所需</span>
          <h1 className="mt-5 font-serif text-3xl font-black leading-snug text-navy-900 sm:text-5xl">忠信食物銀行<span className="mt-2 block text-2xl sm:text-3xl">物資捐贈</span></h1>
          <div className="mt-7 space-y-4 text-base leading-8 text-ink-soft sm:text-lg">
            <p>忠信食物銀行期許能長期、穩定地提供會員家庭日常所需的食品與生活用品，協助減輕家庭的生活負擔。</p>
            <p>興毅基金會依會員家庭的實際需求採購物資，持續補充日常所需。若您願意一起支持、捐贈物資，將讓這份供應更加充足、穩定，為會員家庭提供持續的生活支持。</p>
          </div>
          <nav aria-label="物資捐贈頁面章節" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-navy-700">
            {[["supplies", "所需物資"], ["guidelines", "捐贈須知"], ["methods", "捐贈方式"], ["receipt", "捐物收據"]].map(([id, label]) => <a key={id} href={`#${id}`} className="underline decoration-amber-400 underline-offset-8 hover:text-amber-700 focus-visible:outline-2 focus-visible:outline-amber-500">{label}</a>)}
          </nav>
        </header>

        <Section id="supplies" number="01" title="我們持續提供哪些物資">
          <p>我們依會員家庭的需求準備不同類型的物資，主要包含：</p>
          <InfoTable headers={["類別", "物資範圍"]} rows={[
            ["食品類", "主食類、罐頭類、油品、調味料、飲品、沖泡類、乾貨類"],
            ["日用品類", "居家用品、盥洗用品、穿戴用品（衣物類）、廚房用品、清潔用品"],
          ]} />
          <p className="text-sm text-ink-muted">實際供應品項依各據點需求及庫存狀況調整。</p>
          <h3 className="pt-4 font-serif text-xl font-bold text-navy-900">想一起支持可優先參考這些物資</h3>
          <p>以下為會員家庭日常消耗較快的品項，提供您準備捐贈時參考。歡迎依個人意願與能力選擇，一次捐贈或定期提供。</p>
          <InfoTable headers={["類別", "消耗較快的品項"]} rows={[
            ["食品類", "建議蛋奶素餅乾、食用油、調味料、罐頭、泡麵、沖泡飲品、保久乳、營養品、奶粉等"],
            ["日用品", "洗髮精、沐浴乳、洗碗精、洗衣精、衛生紙、尿布等"],
          ]} />
        </Section>

        <Section id="guidelines" number="02" title="捐贈須知">
          <ul className="list-disc space-y-4 pl-6 marker:text-amber-600">
            <li><strong className="text-navy-900">食品及日常消耗用品：</strong>應保存正常，包裝及內容物狀況良好，可安全食用或正常使用。</li>
            <li><strong className="text-navy-900">有效期限：</strong>有標示有效期限的食品及日用品，請至少保留 <strong className="text-navy-900">3 個月以上效期</strong>。</li>
            <li><strong className="text-navy-900">二手物品：</strong>因人力有限，無法進行二手物品的整理與處理，原則上不接受二手捐贈。</li>
            <li><strong className="text-navy-900">其他品項：</strong>個人衣物鞋包、廚房鍋餐具、寢具電器等特殊物品，以及已拆封食品或已使用的消耗用品，請先與本會聯繫，確認是否適合接收。</li>
          </ul>
        </Section>

        <Section id="methods" number="03" title="如何捐贈物資">
          <p>您可以依自身方便，選擇以下三種方式：</p>
          <div className="space-y-10 pt-3">
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-navy-900">① 親送至收貨據點</h3>
              <p>歡迎將物資送至鄰近收貨據點。食物銀行於平日服務，請在前往前先以電話聯繫，確認時間及相關安排。</p>
              <p>各收貨據點的地址及電話，請至「聯絡我們」頁面查閱。</p>
              <Button href={contact} variant="white" className="max-w-full whitespace-normal">查看收貨據點與聯絡方式<ArrowRight className="size-4" /></Button>
            </div>
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-navy-900">② 自行安排宅配</h3>
              <p>若不方便親送，也可以自行安排宅配，將物資寄至本會收貨據點。收貨地址請至「聯絡我們」頁面查閱。</p>
              <p>寄出後，請透過以下任一方式通知本會，方便工作人員追蹤包裹及確認收貨：</p>
              <ul className="list-disc pl-6"><li>電話聯繫興毅基金會：<a href="tel:0223691200" className="text-navy-800 underline underline-offset-4">02-2369-1200</a></li><li>私訊興毅基金會 Facebook 粉絲專頁</li></ul>
              <p>通知時，請提供寄件人、物資內容、件數、收貨據點及物流單號。</p>
              <div className="flex flex-wrap gap-3"><Button href={contact} variant="white">查看收貨地址<ArrowRight className="size-4" /></Button><Button href={facebook} target="_blank" rel="noopener noreferrer" variant="white">私訊興毅基金會<ArrowRight className="size-4" /></Button></div>
            </div>
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-navy-900">③ 萊爾富愛心物資寄送</h3>
              <p>考量食物銀行於平日服務，部分民眾可能因工作或時間安排不方便親送，本會與萊爾富合作，提供「愛心物資捐贈」寄送管道，讓您能依自己的時間，前往門市辦理寄件。</p>
              <h4 className="pt-2 font-semibold text-navy-900">Life-ET 操作步驟</h4>
              <ol className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-amber-700">{steps.map((step) => <li key={step} className="pl-2">{step}</li>)}</ol>
              <p className="font-semibold text-navy-800">透過此服務寄出後，不需另行通知本會。</p>
              <h4 className="pt-4 font-semibold text-navy-900">寄送前請留意</h4>
              <p>請先查閱萊爾富官方公告，確認最新運費、包裝規範及寄件限制。以下提供包裹規格的簡要提醒：</p>
              <InfoTable headers={["項目", "規格提醒"]} rows={[
                ["包裝", "上、下方平整的立方體包裝，寄件服務單須能完整平貼、無皺褶。"],
                ["尺寸", "高度須大於 1 公分；最長邊不超過 45 公分；長、寬、高合計不超過 105 公分。"],
                ["重量", "須大於 40 公克，且不超過 5 公斤。"],
              ]} />
              <p className="text-sm text-ink-muted">上述資訊供寄件前參考，運費及寄件規範如有調整，請以萊爾富官方最新公告為準。</p>
              <Button href="https://www.hilife.com.tw/HI_Shipping/hilife/08-2_termsStoreToStore.aspx" target="_blank" rel="noopener noreferrer" variant="white" className="max-w-full whitespace-normal">查閱萊爾富官方寄件規定<ArrowRight className="size-4" /></Button>
            </div>
          </div>
        </Section>

        <Section id="receipt" number="04" title="如何申請捐物收據">
          <p>如需開立捐物收據，請與本會聯繫並提供：</p>
          <InfoTable headers={["資料", "說明"]} rows={[
            ["收據抬頭", "姓名或完整公司行號名稱"], ["統一編號", "公司捐贈者提供"],
            ["聯絡人", "可協助確認捐贈事宜的人員"], ["收據寄送地址", "供寄送捐物收據使用"], ["聯絡電話", "供相關事項聯繫確認使用"],
          ]} />
          <p className="text-sm text-ink-muted">上述資料僅供本會辦理捐物收據及相關聯繫使用。</p>
          <p>您可電洽 <a href="tel:0223691200" className="text-navy-800 underline underline-offset-4">02-2369-1200</a>，或私訊興毅基金會 Facebook 粉絲專頁，提供資料及詢問相關事宜。</p>
          <Button href={facebook} target="_blank" rel="noopener noreferrer" variant="white" className="max-w-full whitespace-normal">私訊興毅基金會粉絲專頁<ArrowRight className="size-4" /></Button>
        </Section>

        <Section id="thanks" number="05" title="感謝您的支持">
          <p>每一份食品與生活用品，都是支持會員家庭日常生活的一份力量。感謝您與忠信食物銀行一起，讓這份支持持續下去。</p>
          <div className="flex flex-wrap gap-3 pt-3"><Button href={contact}><Package className="size-4" />聯絡我們</Button><Button href="tel:0223691200" variant="white"><Phone className="size-4" />02-2369-1200</Button></div>
        </Section>
      </div>
    </Container>
  );
}
