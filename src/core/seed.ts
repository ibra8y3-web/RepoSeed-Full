import { generateBadge } from '../modules/badge.js'
import { generateAction } from '../modules/action.js'
import { generateCrosspost } from '../modules/crosspost.js'
import { generateErrorSnippet } from '../modules/error-hijack.js'

export async function seedRepo(urlOrPath: string, opts: any) {
  try {
    console.log('🚀 RepoSeed يحلل...', urlOrPath)
    let owner='owner', name='repo'
    try {
      const parts = urlOrPath.replace('.git','').split('/')
      if(parts.length>=2){ owner = parts[parts.length-2] || 'owner'; name = parts[parts.length-1] || 'repo' }
    } catch {}
    const meta = { owner, name, description: 'مشروع رائع على GitHub' }

    // كل وحدة محمية حتى لو فشلت ما توقف الباقي
    try{ generateBadge(meta) }catch(e){console.warn('Badge skipped')}
    try{ generateAction(meta) }catch(e){console.warn('Action skipped')}
    try{ generateCrosspost(meta) }catch(e){console.warn('Crosspost skipped')}
    try{ generateErrorSnippet(meta) }catch(e){console.warn('Error snippet skipped')}

    console.log('✅ تم التحليل - جاهز للنشر')
  } catch (err:any) {
    console.error('❌ فشل التحليل:', err.message)
  }
}
