export type Row = Record<string, string>
export type Table = { headers: string[]; rows: Row[]; values: unknown[][] }
export const schema = {
  LIGUES: ["id_ligue", "nom_ligue", "pseudo_ligue", "email_ligue", "id_province", "statut", "observations"],
  ENTENTES: ["id_entente", "code_entente", "nom_entente", "pseudo_entente", "id_ligue", "id_ville", "email_entente", "statut", "observations"],
  CLUBS: ["id_club", "nom_club", "id_categorie_club", "id_sexe", "date_affiliation", "id_ville", "id_entente", "id_ligue", "statut", "observations", "code_club"],
} as const
export type Sheet = keyof typeof schema
export function mapTable(values: unknown[][], required: readonly string[]): Table {
  const headers = (values[0] || []).map(value => String(value ?? "").trim())
  const named = headers.filter(Boolean)
  if (new Set(named).size !== named.length || required.some(name => !named.includes(name))) throw new Error("En-têtes absents ou dupliqués dans le classeur.")
  const rows = values.slice(1).filter(row => row.some(value => String(value ?? "").trim())).map(row => Object.fromEntries(headers.flatMap((name, index) => name ? [[name, String(row[index] ?? "").trim()]] : [])))
  const id = required[0]
  const ids = rows.map(row => row[id]).filter(Boolean)
  if (ids.length !== rows.length || new Set(ids).size !== ids.length) throw new Error("Identifiants absents ou dupliqués dans le classeur.")
  return { headers, rows, values }
}
export function columnLetter(index: number) {
  let result = ""
  for (let number = index + 1; number > 0; number = Math.floor((number - 1) / 26)) result = String.fromCharCode(65 + (number - 1) % 26) + result
  return result
}
