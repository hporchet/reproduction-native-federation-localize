import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const browserOutput = path.join(projectRoot, 'dist', 'shell-trad-bug', 'browser');
const failures = [];

for (const locale of ['en', 'fr']) {
  const localeOutput = path.join(browserOutput, locale);
  const manifestPath = path.join(localeOutput, 'remoteEntry.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  let verified = 0;

  for (const [filename, expected] of Object.entries(manifest.integrity ?? {})) {
    const bytes = await readFile(path.join(localeOutput, filename));
    const actual = `sha384-${createHash('sha384').update(bytes).digest('base64')}`;
    if (actual !== expected) {
      failures.push(`${locale}: SRI mismatch for ${filename}`);
    } else {
      verified += 1;
    }
  }

  const outputFiles = await readdir(localeOutput);
  for (const filename of outputFiles.filter((name) => name.endsWith('.js'))) {
    const source = await readFile(path.join(localeOutput, filename), 'utf8');
    const imports = source.matchAll(/import\(["']\.\/([^"']+)["']\)/g);
    for (const [, importedFile] of imports) {
      try {
        await readFile(path.join(localeOutput, importedFile));
      } catch {
        failures.push(`${locale}: ${filename} imports missing ${importedFile}`);
      }
    }
  }

  console.log(`${locale}: verified ${verified} federation integrity entries`);
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('All locale integrity entries and relative imports are valid.');
}