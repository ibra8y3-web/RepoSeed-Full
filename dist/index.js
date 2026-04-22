#!/usr/bin/env node
import { Command } from 'commander';
import { seedRepo } from './core/seed.js';
const program = new Command();
program.name('reposeed').description('أداة النشر الذكي').version('1.0.0');
program.command('seed <url>').description('نشر أي مستودع').action(async (url) => { try {
    await seedRepo(url, {});
}
catch (e) {
    console.error('❌ خطأ:', e.message);
} });
program.command('auto').description('يكتشف المستودع تلقائيا').action(async () => { try {
    const { execSync } = await import('child_process');
    const url = execSync('git config --get remote.origin.url').toString().trim();
    await seedRepo(url, {});
}
catch (e) {
    await seedRepo('.', {});
} });
program.parse();
