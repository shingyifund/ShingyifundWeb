import { listStats } from "./actions";
import { StatsEditor } from "./_components/stats-editor";

export default async function StatsAdminPage() {
  const stats = await listStats();
  return (
    <div className="space-y-6">
      <StatsEditor stats={stats} />
    </div>
  );
}
