import { build } from "esbuild"
import nextEnv from "@next/env"
import Module from "node:module"
import path from "node:path"
import { writeFile, mkdir } from "node:fs/promises"
nextEnv.loadEnvConfig(process.cwd())
const result = await build({ stdin: { contents: 'export { readTables } from "./lib/territorial-store"; export { mapTerritory } from "./lib/territorial-view-model"', resolveDir: process.cwd() }, bundle: true, write: false, platform: "node", format: "cjs", packages: "external", plugins: [{ name: "server-only-check", setup(b) { b.onResolve({ filter: /^server-only$/ }, () => ({ path: "server-only", namespace: "empty" })); b.onLoad({ filter: /.*/, namespace: "empty" }, () => ({ contents: "" })) } }] })
const mod = new Module(path.resolve("scripts/read-only-check.cjs"))
mod.filename = path.resolve("scripts/read-only-check.cjs")
mod.paths = Module._nodeModulePaths(process.cwd())
mod._compile(result.outputFiles[0].text, mod.filename)
try {
  const { tables, refs } = await mod.exports.readTables()
  const data = mod.exports.mapTerritory(tables, refs)
  const first = data.ligues.find(row => row.idLigue === "01")
  console.log(JSON.stringify({ ligues: data.ligues.length, ententes: data.ententes.length, clubs: data.clubs.length, fiche01: first ? { id: first.idLigue, nom: first.nomLigue, province: first.nomProvince, statut: first.statut } : null }))
  await mkdir("test-results/fenacoju", { recursive: true })
  await writeFile("test-results/fenacoju/territory-read.json", JSON.stringify(data))
} catch (error) {
  console.error("Lecture FENACOJU indisponible. Code :", error.code || "configuration ou source")
  process.exitCode = 1
}