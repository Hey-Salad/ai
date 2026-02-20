import { build } from 'esbuild';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [join(__dirname, 'worker.ts')],
  bundle: true,
  outfile: join(__dirname, 'build/client/_worker.js'),
  format: 'esm',
  platform: 'browser',
  conditions: ['workerd', 'worker', 'browser', 'module'],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  logLevel: 'info',
});

console.log('✅ Worker built to build/client/_worker.js');
