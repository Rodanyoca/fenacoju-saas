import "server-only"
export function getUsersSpreadsheetId(): string {
  // Keep all existing authentication checks; never reuse FECOT accounts.
  const id = process.env.FENACOJU_USERS_SPREADSHEET_ID?.trim()
  if (!id) throw new Error("FENACOJU_USERS_SPREADSHEET_ID est manquant.")
  return id
}