import { spawn, spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const found = args.find((arg) => arg.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : fallback;
};

const port = flag('port', '3100');
const baseUrl = flag('base', `http://127.0.0.1:${port}`);
const outputPath = flag('out', 'reports/FULL_SITE_AUDIT.json');
const shouldBuild = args.includes('--build');
const useLegacy = args.includes('--legacy');
const auditScript = useLegacy ? 'scripts/audit-site.mjs' : 'scripts/audit-full-site.mjs';

const run = (command, commandArgs, options = {}) =>
  spawnSync(command, commandArgs, { stdio: 'inherit', shell: process.platform === 'win32', ...options });

if (shouldBuild) {
  console.log('> next build');
  const build = run('npx', ['next', 'build']);
  if (build.status !== 0) process.exit(build.status ?? 1);
}

console.log(`> next start -p ${port}`);
const server = spawn('npx', ['next', 'start', '-p', port], {
  stdio: 'ignore',
  shell: process.platform === 'win32',
  detached: process.platform !== 'win32',
});

const stop = () => {
  if (server.pid) {
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
    else process.kill(-server.pid, 'SIGTERM');
  }
};
process.on('exit', stop);
process.on('SIGINT', () => { stop(); process.exit(130); });
process.on('SIGTERM', () => { stop(); process.exit(143); });

const waitForServer = async () => {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/`, { redirect: 'manual' });
      if (response.status < 500) return true;
    } catch {
      // server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
};

if (!(await waitForServer())) {
  console.error(`Server did not become ready on ${baseUrl}`);
  stop();
  process.exit(1);
}

console.log(`> ${auditScript} ${baseUrl}`);
const audit = spawn('node', [auditScript, `--base=${baseUrl}`, `--out=${outputPath}`], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
audit.on('exit', (code) => {
  stop();
  process.exit(code ?? 0);
});
