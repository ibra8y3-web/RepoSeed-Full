export function generateCrosspost(meta) { const article = `# ${meta.name}\n${meta.description}`; console.log('\n📝 مقال Dev.to:'); console.log(article.slice(0, 150) + '...'); }
