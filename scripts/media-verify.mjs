/**
 * Comprueba que todo lo declarado en `media-manifest.json` exista realmente en
 * el bucket público. Es la red de seguridad del deploy: si olvidaste correr
 * `npm run media:sync`, esto falla antes de que producción quede rota.
 *
 * No necesita credenciales, solo `PUBLIC_MEDIA_BASE_URL`.
 */
import { loadEnv, bytes, pool, publicBase, readManifest } from "./media-lib.mjs";

await loadEnv();

const base = await publicBase();
if (!base) {
  console.error("PUBLIC_MEDIA_BASE_URL no está definida.");
  process.exit(1);
}

const manifest = await readManifest();
if (!manifest) {
  console.error("No existe media-manifest.json. Corre `npm run media:sync`.");
  process.exit(1);
}

const entries = Object.entries(manifest.assets ?? {});
if (!entries.length) {
  console.error("El manifest está vacío.");
  process.exit(1);
}

console.log(`Verificando ${entries.length} archivos contra ${base}`);

const problems = [];
await pool(entries, 8, async ([key, { size }]) => {
  const url = `${base}${key}`;
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      problems.push(`${key} -> HTTP ${response.status}`);
      return;
    }
    const remoteSize = Number(response.headers.get("content-length"));
    if (Number.isFinite(remoteSize) && remoteSize !== size) {
      problems.push(`${key} -> tamaño ${bytes(remoteSize)}, se esperaba ${bytes(size)}`);
    }
  } catch (error) {
    problems.push(`${key} -> ${error.message}`);
  }
});

if (problems.length) {
  console.error(`\n${problems.length} archivo(s) fuera de sincronía:`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error("\nCorre `npm run media:sync` y commitea el manifest actualizado.");
  process.exit(1);
}

console.log("Todos los medios están publicados y coinciden con el manifest.");
