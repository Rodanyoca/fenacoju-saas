"use client"
import Link from "next/link"
import { useState } from "react"
import { LogOut, UserRound } from "lucide-react"
import { apiFetch } from "@/lib/api/client"
export function AccountMenu() {
  const [busy, setBusy] = useState(false), [error, setError] = useState("")
  async function logout() {
    if (busy) return
    setBusy(true);setError("")
    try {
      const response = await apiFetch("/api/auth/logout", { method: "POST" })
      if (!response.ok) throw new Error()
      window.location.replace("/login")
    } catch { setError("Déconnexion impossible. Réessayez.");setBusy(false) }
  }
  return <div className="flex shrink-0 items-center gap-2">
    <Link href="/mon-compte" className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm hover:bg-muted" aria-label="Mon compte"><UserRound className="size-4" /><span className="hidden sm:inline">Mon compte</span></Link>
    <button type="button" onClick={logout} disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm hover:bg-muted disabled:opacity-50" aria-label="Se déconnecter"><LogOut className="size-4" /><span className="hidden sm:inline">{busy ? "Déconnexion…" : "Déconnexion"}</span></button>
    {error && <p role="alert" className="max-w-40 text-xs text-destructive">{error}</p>}
  </div>
}
