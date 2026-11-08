import { test } from "node:test"
import assert from "node:assert/strict"
// @ts-expect-error Node requires explicit extensions.
import { mapTable, schema } from "../lib/territorial-schema.ts"
// @ts-expect-error Node requires explicit extensions.
import { validateTerritorialSource, territorialSources } from "../lib/territorial-sources.ts"

test("FENACOJU headers map independently of order and preserve text IDs and empty status", () => {
  const headers = [...schema.LIGUES].reverse()
  const row: Record<string, string> = { id_ligue: "01", id_province: "PRO01", nom_ligue: "Ligue de test" }
  const result = mapTable([headers, headers.map(key => row[key] || "")], schema.LIGUES)
  assert.equal(result.rows[0].id_ligue, "01")
  assert.equal(result.rows[0].statut, "")
})
test("empty sheets differ from a missing required header", () => {
  assert.deepEqual(mapTable([[...schema.ENTENTES]], schema.ENTENTES).rows, [])
  assert.deepEqual(mapTable([[...schema.CLUBS]], schema.CLUBS).rows, [])
  assert.throws(() => mapTable([["id_club"]], schema.CLUBS))
  assert.throws(() => mapTable([], schema.LIGUES))
})
test("an inherited or missing workbook is rejected instead of falling back", () => {
  const key = "FENACOJU_STRUCTURE_TERRITORIALE_SPREADSHEET_ID"
  assert.throws(() => validateTerritorialSource(key, undefined), /Configuration manquante/)
  assert.throws(() => validateTerritorialSource(key, "inherited-workbook"), /Source incorrecte/)
  assert.equal(validateTerritorialSource(key, territorialSources[key]), territorialSources[key])
})