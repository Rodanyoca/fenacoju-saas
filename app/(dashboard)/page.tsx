import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Shell } from "@/components/dashboard/shell"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { modules } from "@/lib/navigation"

export default function Dashboard() {
  return <Shell>
    <section className="mb-8 max-w-3xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Fédération nationale congolaise de judo</p>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Bienvenue dans l’espace FENACOJU</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">Retrouvez les espaces de gestion de votre fédération. Les modules seront activés après configuration du référentiel judo.</p>
    </section>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {modules.map(item => <Card key={item.slug}>
        <CardHeader><CardTitle>{item.title}</CardTitle><CardDescription>{item.description}</CardDescription></CardHeader>
        <CardContent><Link href={item.slug === "structures" ? "/ligues" : ({ acteurs: "/athletes", licences: "/licences", competitions: "/competitions", administration: "/activites" } as Record<string, string>)[item.slug]} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Consulter l’espace <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></CardContent>
      </Card>)}
    </div>
  </Shell>
}
