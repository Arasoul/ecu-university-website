import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const markerPattern = /^\s*(<<<<<<<(?:\s|$)|=======(?:\s|$)|>>>>>>>(?:\s|$)|\|\|\|\|\|\|\|(?:\s|$))/;
const trackedFiles = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);
const findings = [];

for (const file of trackedFiles) {
  const contents = readFileSync(file, 'utf8');
  contents.split(/\r?\n/).forEach((line, index) => {
    if (markerPattern.test(line)) {
      findings.push(`${file}:${index + 1}: unresolved conflict marker`);
    }
  });
}

if (findings.length > 0) {
  console.error(findings.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${trackedFiles.length} tracked files: no unresolved conflict markers found.`);
}
