import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const hookDir = path.join(root, '.githooks');

if (!existsSync(hookDir)) {
  console.error(`Hook directory not found: ${hookDir}`);
  process.exit(0);
}

// Git only runs hooks that are executable. Windows ignores the bit, but POSIX
// checkouts need it, so set it when possible.
try {
  chmodSync(path.join(hookDir, 'commit-msg'), 0o755);
} catch {
  // chmod is a no-op on Windows.
}

try {
  execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: root, stdio: 'ignore' });
  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { cwd: root, stdio: 'ignore' });
  console.log('Git hooks installed: core.hooksPath=.githooks');
  console.log('The commit-msg hook strips Copilot/automation co-author trailers automatically.');
} catch {
  // Package installs outside a git checkout (CI archives, tarballs) must not fail.
  console.log('Skipped git hook installation: not a git work tree.');
}
