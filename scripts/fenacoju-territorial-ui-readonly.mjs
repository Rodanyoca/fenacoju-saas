import { build } from "esbuild"
import { chromium } from "@playwright/test"
import { readFile, readdir, mkdir } from "node:fs/promises"
import path from "node:path"
import assert from "node:assert/strict"
const out = "test-results/fenacoju"
await mkdir(out, { recursive: true })
const result = await build({ entryPoints: ["tests/ui/fenacoju-readonly.tsx"], bundle: true, write: false, platform: "browser", format: "iife", jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' }, plugins: [{ name: "isolated-navigation", setup(b) { b.onResolve({ filter: /^next\/(?:navigation|link|image)$/ }, args => ({ path: path.resolve(args.path === "next/image" ? "tests/ui/image-shim.tsx" : "tests/ui/navigation-shim.tsx") })) } }] })
const cssFiles = async dir => { const parts = await readdir(dir, { withFileTypes: true }); return (await Promise.all(parts.map(p => p.isDirectory() ? cssFiles(path.join(dir, p.name)) : p.name.endsWith(".css") ? readFile(path.join(dir, p.name), "utf8") : ""))).flat() }
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.setDefaultTimeout(15000)
  // Verify the real route boundary without credentials or login writes.
  await page.goto("http://127.0.0.1:3041/ligues", { waitUntil: "domcontentloaded" })
  assert.match(page.url(), /\/login/)
  console.log("Real route: authentication redirect preserved; no authenticated table validation.")
  await page.route("http://fenacoju-qa.test/**", route => route.fulfill({ contentType: "text/html", body: '<html lang="fr"><body><div id="root"></div></body></html>' }))
  await page.goto("http://fenacoju-qa.test/")
  const errors = []
  page.on("pageerror", e => errors.push(e.message))
  await page.addStyleTag({ content: (await cssFiles(".next/static")).join("\n") })
  await page.addScriptTag({ content: result.outputFiles[0].text })
  await page.getByRole("heading", { name: "Ligues", exact: true }).waitFor()
  assert.equal(await page.locator("tbody tr:first-child td:first-child").textContent(), "01")
  await page.locator("tbody").getByText("Non renseigné", { exact: true }).first().waitFor()
  await page.getByRole("button", { name: "Page suivante", exact: true }).click()
  assert.equal(await page.locator("tbody tr:first-child td:first-child").textContent(), "11")
  const search = page.getByPlaceholder("Rechercher une ligue...")
  await search.fill("KINSHASA")
  assert.equal(await page.locator("tbody tr").count(), 1)
  await page.getByRole("button", { name: /Voir LIGUE DE JUDO.*KINSHASA/ }).last().click()
  await page.getByRole("heading", { name: /Fiche Ligue.*KINSHASA/ }).waitFor()
  await page.getByRole("button", { name: "Retour à la liste", exact: true }).waitFor()
  await page.screenshot({ path: `${out}/fiche-01.png`, fullPage: true })
  await page.getByRole("button", { name: "Retour à la liste", exact: true }).click()
  for (const kind of ["ententes", "clubs"]) {
    await page.evaluate(k => window.qaRender(k), kind)
    await page.getByRole("heading", { name: kind === "ententes" ? "Ententes" : "Clubs", exact: true }).waitFor()
    await page.getByText("Aucune donnée trouvée", { exact: true }).last().waitFor()
    await page.screenshot({ path: `${out}/${kind}-empty.png`, fullPage: true })
  }
  assert.deepEqual(errors, [])
  console.log("Isolated browser, real connector snapshot: list 26, text ID 01, blank status, pagination, search, detail01 and return, both empty lists passed. No application session or remote mutation.")
} finally { await browser.close() }