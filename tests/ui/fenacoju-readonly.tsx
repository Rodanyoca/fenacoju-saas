// Isolated test document only: connector-read snapshot, no application auth bypass.
import React from "react"
import { createRoot } from "react-dom/client"
import snapshot from "../data/fenacoju-territory.json"
import { mapTable, schema } from "@/lib/territorial-schema"
import { mapTerritory } from "@/lib/territorial-view-model"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TerritoryPage } from "@/components/territorial/page-client"
const tables = { LIGUES: mapTable(snapshot.tables.LIGUES, schema.LIGUES), ENTENTES: mapTable(snapshot.tables.ENTENTES, schema.ENTENTES), CLUBS: mapTable(snapshot.tables.CLUBS, schema.CLUBS) }
const refs = { PROVINCES: mapTable(snapshot.refs.PROVINCES, ["id_province", "nom_province"]), VILLES: mapTable(snapshot.refs.VILLES, ["id_ville", "id_province", "nom_ville"]), CATEGORIES_CLUB: mapTable(snapshot.refs.CATEGORIES_CLUB, ["id_categorie_club", "nom_categorie_club"]), SEXES: mapTable(snapshot.refs.SEXES, ["id_sexe", "nom_sexe"]) }
const data = mapTerritory(tables, refs)
const root = createRoot(document.getElementById("root")!)
let kind: "ligues" | "ententes" | "clubs" = "ligues"
const render = () => root.render(<DashboardLayout initialUser={{ estSuperAdmin: false, access: { "AUT-SPT:READ": true } }}><TerritoryPage kind={kind} data={data} canWrite={false} error="" /></DashboardLayout>)
Object.assign(window, { qaRender: (next: typeof kind) => { kind = next; render() }, qaRefresh: render })
window.fetch = async () => new Response("{}", { status: 403 })
render()