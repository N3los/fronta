import { spawn } from 'child_process';

process.env.BASE_PATH = '/2026';
process.env.NODE_ENV = 'production';

console.log('Building for staging with BASE_PATH=/2026...');

const child = spawn('npx', ['astro', 'build', '--mode', 'staging'], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});
