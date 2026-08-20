import { PartnerManager } from "./_components/partner-manager";
import { listSustainabilityPartners } from "./actions";

export default async function SustainabilityPartnersAdminPage() {
  const partners = await listSustainabilityPartners();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">永續合作夥伴</h1>
        <p className="mt-2 text-sm text-muted-foreground">管理前台「興毅永續行動」合作夥伴 Logo、連結、顯示狀態與排序。</p>
      </div>
      <PartnerManager partners={partners} />
    </div>
  );
}
