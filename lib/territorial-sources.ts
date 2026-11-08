// No inherited workbook or fallback is accepted on the FENACOJU territory path.
export const territorialSources = {
  FENACOJU_STRUCTURE_TERRITORIALE_SPREADSHEET_ID: '1bHanWLt_-Kajm09v2FY6bnWHjVQQfM-oP7I0KQzEHlw',
  FENACOJU_REFERENTIELS_SPREADSHEET_ID: '1FFdw_48OmQFJFf7swMqvbuwfMTnz8kJdpuIK-SFAxUA',
} as const
export function validateTerritorialSource(name: keyof typeof territorialSources, value: string | undefined) {
  if (!value?.trim()) throw new Error(`Configuration manquante : ${name}.`)
  if (value.trim() !== territorialSources[name]) throw new Error(`Source incorrecte pour FENACOJU : ${name}.`)
  return value.trim()
}