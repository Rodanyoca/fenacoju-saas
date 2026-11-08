import { getTerritorialData } from "@/lib/territorial-data"
import { getNavigationAccess, getSession } from "@/lib/auth"
import { TerritoryPage, type TerritoryData } from "./page-client"

export async function TerritoryServerPage({ kind }: { kind: "ligues" | "ententes" | "clubs" }) {
  let data: TerritoryData = { ligues: [], ententes: [], clubs: [], provinces: [], cities: [], categories: [], sexes: [] }, error = "", canWrite = false
  try {
    const session = await getSession()
    const [loaded, access] = await Promise.all([getTerritorialData(), getNavigationAccess(session ?? undefined)])
    data = loaded
    canWrite = false // Mutations remain unavailable until the FENACOJU contract is validated.
  } catch {
    error = "Le référentiel territorial n’a pas pu être chargé. Vérifiez les variables FENACOJU_STRUCTURE_TERRITORIALE_SPREADSHEET_ID et FENACOJU_REFERENTIELS_SPREADSHEET_ID, les accès Google et le réseau. Aucune donnée de remplacement n’est affichée."
  }
  return <TerritoryPage kind={kind} data={data} error={error} canWrite={canWrite} />
}
