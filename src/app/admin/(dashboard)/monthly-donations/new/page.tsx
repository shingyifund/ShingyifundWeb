import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MonthlyDonationForm } from "../_components/monthly-donation-form";

export default function NewMonthlyDonationPage() {
  return (
    <div className="space-y-6">
      <Button href="/admin/monthly-donations" variant="ghost" size="sm">
        <ArrowLeft />
        返回列表
      </Button>

      <section className="rounded-lg border bg-white p-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">新增清單</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            建立每月捐物清單
          </h1>
        </div>
        <MonthlyDonationForm />
      </section>
    </div>
  );
}
