#!/usr/bin/env node
import { Command } from 'commander';
import { seedRepo } from './core/seed.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// --- استراتيجيات النشر الذكي ---

function injectBadge(repoUrl: string) {
    const badge = `\n[![RepoSeed](https://img.shields.io/badge/RepoSeed-boosted-blue)](${repoUrl})\n`;
    if (fs.existsSync('README.md')) {
        let content = fs.readFileSync('README.md', 'utf8');
        if (!content.includes('RepoSeed-boosted')) {
            fs.writeFileSync('README.md', badge + content);
            console.log('✅ تم حقن الـ Badge الذكي لضمان الانتشار.');
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
      - uses: actions/checkout@v4
      - name: RepoSeed Analysis
        run: echo "Project ${repoName} is boosted by RepoSeed 🌱"
    `;
    fs.writeFileSync(path.join(workflowPath, 'reposeed.yml'), yamlContent);
    console.log('✅ تم تفعيل الـ GitHub Action للـ Automation.');
}

function pushChanges() {
    try {
        execSync('git add .');
        execSync('git commit -m "chore: smart-publishing by RepoSeed 🌱"');
        execSync('git push'); 
        console.log('🚀 تم النشر التقني بنجاح على GitHub!');
    } catch (e) {
        console.log('⚠️ لا يوجد تغييرات جديدة للرفع.');
    }
}

async function applySmartPublishing(url: string) {
    const repoName = url.split('/').pop()?.replace('.git', '') || 'repository';
    console.log(`\n🌱 بدأ عملية البذر لـ ${repoName}...`);
    
    injectBadge(url);
    createWorkflow(repoName);
    
    console.log('🎯 استراتيجية Awesome Lists: جاري تجهيز اقتراحات الـ PR...');
    // مستقبلاً: هنا يتم استدعاء سكريبت البحث عن القوائم المناسبة
    
    pushChanges();
}

// --- إعدادات الأوامر (CLI) ---

const program = new Command();
program.name('reposeed').description('RepoSeed: أداة النشر الذكي').version('1.1.0');

program.command('seed <url>')
    .description('نشر مستودع معين')
    .action(async (url) => {
        try {
            await seedRepo(url, {});
            await applySmartPublishing(url);
        } catch (e) {
            console.error('❌ خطأ في التنفيذ:', (e as Error).message);
        }
    });

program.command('auto')
    .description('اكتشاف ونشر المستودع الحالي تلقائياً')
    .action(async () => {
        try {
            const url = execSync('git config --get remote.origin.url').toString().trim();
            await seedRepo(url, {});
            await applySmartPublishing(url);
        } catch (e) {
            console.log('❌ فشل الاكتشاف التلقائي. تأكد أنك داخل مجلد Git.');
        }
    });

program.parse();

