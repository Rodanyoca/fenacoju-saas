"use client"

import { useRef, useState, type ReactNode } from "react"
import { Pencil } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTerritory } from "@/components/territorial/context"
import { SelectCity } from "@/components/territorial/select-city"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { CompactDateInput } from "@/components/ui/compact-date-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Entente, Ligue } from "@/lib/types"
import { compactDateFromSheet } from "@/lib/compact-date"

type SavedEntente = Pick<Entente, "idEntente" | "codeEntente" | "nomEntente" | "pseudoEntente" | "idLigue" | "nomLigue" | "provinceId" | "provinceNom" | "telephone" | "emailEntente" | "dateCreation" | "dateReconnaissance" | "statut" | "observations"> & {
  previousIdEntente?: string
}

function EntenteFormDialog({
  entente,
  ligues,
  lockedLigue,
  onSaved,
  trigger,
}: {
  entente?: Entente
  ligues: Ligue[]
  lockedLigue?: Ligue
  onSaved: (entente: SavedEntente) => void
  trigger?: ReactNode
}) {
  const router = useRouter()
  const { canWrite, cities, ligues: contextLigues } = useTerritory()
  const editing = Boolean(entente)
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const submitting = useRef(false)
  const [error, setError] = useState("")
  const initialForm = {
    codeEntente: entente?.codeEntente ?? "", idVille: entente?.idVille ?? "",
    nomEntente: entente?.nomEntente ?? "",
    pseudoEntente: entente?.pseudoEntente ?? "",
    idLigue: lockedLigue?.idLigue ?? entente?.idLigue ?? "",
    telephone: entente?.telephone ?? "",
    emailEntente: entente?.emailEntente ?? "",
    dateCreation: compactDateFromSheet(entente?.dateCreation ?? ""),
    dateReconnaissance: compactDateFromSheet(entente?.dateReconnaissance ?? ""),
    statut: entente?.statut || "active",
    observations: entente?.observations ?? "",
  }
  const [form, setForm] = useState(initialForm)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setPending(true)
    setError("")
    try {
      const response = await fetch(
        editing ? `/api/ententes/${encodeURIComponent(entente!.idEntente)}` : "/api/ententes",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      )
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || "Enregistrement impossible.")
      onSaved(result.entente)
      router.refresh()
      toast.success(result.message)
      setOpen(false)
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Enregistrement impossible."
      setError(message)
      toast.error(message)
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  if (!canWrite) return null
  return (
    <Sheet open={open} onOpenChange={(value) => { if (!pending) { if (value) { setForm(initialForm); setError("") }; setOpen(value) } }}>
      <SheetTrigger asChild>
        {trigger ?? (editing ? (
          <Button type="button" size="icon" variant="ghost" className="h-8 w-8 hover:bg-brand-gold/10 hover:text-brand-gold" aria-label={`Modifier ${entente!.nomEntente}`} title="Modifier">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" className="bg-brand-gold text-[#071827] hover:bg-brand-gold/90">Ajouter une entente</Button>
        ))}
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{editing ? "Modifier l’entente" : "Ajouter une entente"}</SheetTitle>
          <SheetDescription>
            {editing ? "Modifiez les informations de l’entente." : "L’identifiant FENACOJU reste immuable. Le code doit être unique dans la ligue."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={submit} className="space-y-6 px-4 pb-24">
          <div className="grid gap-4 sm:grid-cols-2">
            {editing && <div className="space-y-2"><Label>Identifiant</Label><Input value={entente!.idEntente} disabled /></div>}
            <div className="space-y-2">
              <Label htmlFor="fecot-codeEntente">Code de l’entente *</Label>
              <Input id="fecot-codeEntente" required value={form.codeEntente} onChange={(event) => setForm({ ...form, codeEntente: event.target.value })} placeholder="Ex. 01" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Ligue *</Label>
              <Select required disabled={Boolean(lockedLigue)} value={form.idLigue} onValueChange={(value) => setForm({ ...form, idLigue: value, idVille: "" })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner une ligue" /></SelectTrigger>
                <SelectContent>{ligues.map((ligue) => <SelectItem key={ligue.idLigue} value={ligue.idLigue}>{ligue.nomLigue}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label htmlFor="fecot-nomEntente">Nom de l’entente *</Label><Input id="fecot-nomEntente" required value={form.nomEntente} onChange={(event) => setForm({ ...form, nomEntente: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="fecot-pseudoEntente">Sigle</Label><Input id="fecot-pseudoEntente" value={form.pseudoEntente} onChange={(event) => setForm({ ...form, pseudoEntente: event.target.value })} /></div>
            <SelectCity provinceId={contextLigues.find(ligue => ligue.idLigue === form.idLigue)?.idProvince || ""} value={form.idVille} onChange={idVille => setForm({ ...form, idVille })} />
            <div className="space-y-2"><Label htmlFor="fecot-telephone">Téléphone</Label><Input id="fecot-telephone" type="tel" value={form.telephone} onChange={(event) => setForm({ ...form, telephone: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="fecot-emailEntente">Adresse e-mail</Label><Input id="fecot-emailEntente" type="email" value={form.emailEntente} onChange={(event) => setForm({ ...form, emailEntente: event.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="fecot-dateCreation">Date de création</Label><CompactDateInput id="fecot-dateCreation" optional value={form.dateCreation} onValueChange={(dateCreation) => setForm({ ...form, dateCreation })} /></div>
            <div className="space-y-2"><Label htmlFor="fecot-dateReconnaissance">Date de reconnaissance</Label><CompactDateInput id="fecot-dateReconnaissance" optional value={form.dateReconnaissance} onValueChange={(dateReconnaissance) => setForm({ ...form, dateReconnaissance })} /></div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={form.statut} onValueChange={(value) => setForm({ ...form, statut: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="fecot-observations">Observations</Label><Textarea id="fecot-observations" value={form.observations} onChange={(event) => setForm({ ...form, observations: event.target.value })} /></div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <SheetFooter className="px-0">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={pending} className="bg-brand-gold text-[#071827] hover:bg-brand-gold/90">{pending ? "Enregistrement..." : editing ? "Enregistrer" : "Ajouter l’entente"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export function CreateEntenteDialog({ ligues, lockedLigue, onSaved }: { ligues: Ligue[]; lockedLigue?: Ligue; onSaved: (entente: SavedEntente) => void }) {
  return <EntenteFormDialog ligues={ligues} lockedLigue={lockedLigue} onSaved={onSaved} />
}

export function EditEntenteDialog({ entente, ligues, lockedLigue, onSaved, trigger }: { entente: Entente; ligues: Ligue[]; lockedLigue?: Ligue; onSaved: (entente: SavedEntente) => void; trigger?: ReactNode }) {
  return <EntenteFormDialog entente={entente} ligues={ligues} lockedLigue={lockedLigue} onSaved={onSaved} trigger={trigger} />
}

export type { SavedEntente }
