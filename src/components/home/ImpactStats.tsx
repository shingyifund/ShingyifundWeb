import { getImpactStats } from "@/lib/data/queries";
import { StatsBand } from "./StatsBand";

export async function ImpactStats() {
  const stats = await getImpactStats();
  return <StatsBand stats={stats} />;
}
