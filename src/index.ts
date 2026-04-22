#!/usr/bin/env node
import { Command } from 'commander';
import { seedRepo } from './core/seed.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function injectBadge(repoUrl: string) {
    const badge = `\n[![RepoSeed](https://img.shields.io/badge/RepoSeed-boosted-blue)](${repoUrl})\n`;
    if (fs.existsSync('README.md')) {
        let content = fs.readFileSync('README.md', 'utf8');
        if (!content.includes('RepoSeed-boosted')) {
            fs.writeFileSync('README.md', badge + content);
            console.log('✅ تم إضافة الـ Badge لملف README');
        }
    }
}

function createWorkflow(repoName: string) {
    const workflowPath = path.join('.github', 'workflows');
    if (!fs.existsSync(workflowPath)) fs.mkdirSync(workflowPath, { recursive: true });
    
    const yamlContent = `
name: RepoSeed Auto-Update
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: RepoSeed Analysis
        run: echo "Project ${repoName} is boosted by RepoSeed"
    `;
    fs.writeFileSync(path.join(workflowPath, 'reposeed.yml'), yamlContent);
    console.log('✅ تم إنشاء ملف الـ GitHub Action');
}

function pushChanges() {
    try {
        execSync('git add .');
        execSync('git commit -m "chore: boosted by RepoSeed [auto]"');
        execSync('git push'); 
        console.log('🚀 تم رفع التعديلات لـ GitHub بنجاح!');
    } catch (e) {
        console.error('❌ فشل الرفع: تأكد من وجود صلاحيات git');
    }
}

function applyAutomations(url: string) {
    const repoName = url.split('/').pop()?.replace('.git', '') || 'repository';
    injectBadge(url);
    createWorkflow(repoName);
    pushChanges();
}

const program = new Command();
program.name('reposeed').description('أداة النشر الذكي').version('1.0.0');

program.command('seed <url>')
    .description('نشر أي مستودع')
    .action(async (url) => {
        try {
            await seedRepo(url, {});
            applyAutomations(url);
        } catch (e) {
            console.error('❌ خطأ:', (e as Error).message);
        }
    });

program.command('auto')
    .description('يكتشف المستودع تلقائيا')
    .action(async () => {
        try {
            const url = execSync('git config --get remote.origin.url').toString().trim();
            await seedRepo(url, {});
            applyAutomations(url);
        } catch (e) {
            await seedRepo('.', {});
        }
    });

program.parse();

