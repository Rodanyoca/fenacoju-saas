import "server-only"
import { google } from "googleapis"
import { mapTable, schema, type Table, type Row, type Sheet } from "./territorial-schema"
import { territorialSources, validateTerritorialSource } from "./territorial-sources"
export const configured = () => Boolean(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && Object.keys(territorialSources).every(key => process.env[key]))
export function required(name: string) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Configuration manquante : ${name}.`)
  if (name in territorialSources) return validateTerritorialSource(name as keyof typeof territorialSources, value)
  return value
}
export function sheetsClient() {
  const auth = new google.auth.JWT({ email: required("GOOGLE_CLIENT_EMAIL"), key: required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"), scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] })
  return google.sheets({ version: "v4", auth })
}
const refsSchema = {
  PROVINCES: ["id_province", "nom_province"], VILLES: ["id_ville", "id_province", "nom_ville"],
  CATEGORIES_CLUB: ["id_categorie_club", "nom_categorie_club"], SEXES: ["id_sexe", "nom_sexe"],
}
export type TerritorialTables = Record<Sheet, Table>
export type ReferenceTables = Record<keyof typeof refsSchema, Table>
export async function readTables(): Promise<{ tables: TerritorialTables; refs: ReferenceTables }> {
  const ids = [required("FENACOJU_STRUCTURE_TERRITORIALE_SPREADSHEET_ID"), required("FENACOJU_REFERENTIELS_SPREADSHEET_ID")]
  const client = sheetsClient()
  const results = await Promise.all([schema, refsSchema].map(async (spec, index) => {
    const names = Object.keys(spec)
    const response = await client.spreadsheets.values.batchGet({ spreadsheetId: ids[index], ranges: names.map(name => `'${name}'!A:AZ`), valueRenderOption: "FORMATTED_VALUE" }, { timeout: 15000, retry: false })
    return Object.fromEntries(names.map((name, position) => [name, mapTable(response.data.valueRanges?.[position]?.values || [], spec[name as keyof typeof spec])]))
  }))
  return { tables: results[0] as TerritorialTables, refs: results[1] as ReferenceTables }
}
export async function writeRecord(_sheet: Sheet, _table: Table, _id: string, _record: Row, _editing: boolean): Promise<void> {
  throw new Error("Les mutations territoriales FENACOJU ne sont pas encore validées.")
}