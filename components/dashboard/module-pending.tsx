import { Shell } from "./shell"
import { Header } from "./header"
export function ModulePending({ title }: { title: string }) {
  return <Shell bare><Header title={title} /><div className="p-4 sm:p-6"><section className="rounded-xl border border-border bg-card p-6"><h2 className="text-lg font-semibold">Module en préparation</h2><p className="mt-2 text-sm text-muted-foreground">L’espace {title} n’est pas encore disponible dans FENACOJU.</p></section></div></Shell>
}
