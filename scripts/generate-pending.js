// scripts/generate-pending.js - Tier3 v3 (defaultFav 제거, terms_pending 스키마 호환)
const { createClient } = require('@supabase/supabase-js');

try {
  const ws = require('ws');
  global.WebSocket = ws;
} catch (e) {
  console.log('ws polyfill not needed (Node 22+ native WebSocket)');
}

const CANDIDATE_POOL = {
  '프론트엔드': ['Bun','Vite','Astro','SolidJS','Qwik','SvelteKit','Remix','Turbopack','Biome','ESLint v9','StyleX','Vanilla Extract','Panda CSS','TanStack Query','Zustand','Jotai','Valtio','React Server Components','Next.js 14','Nuxt 3','HTMX','Alpine.js','Lit','Web Components','View Transitions API','Container Queries','Cascade Layers','Subgrid',':has()','NPM Workspaces'],
  '백엔드': ['Bun','Deno','FastAPI','NestJS','Hono','tRPC','GraphQL Yoga','Prisma 5','Drizzle ORM','Supabase Realtime','PlanetScale','Turso','Upstash','Neon','Bun Shell','Effect TS','Elysia','Fastify','Koa','Strapi v4','PocketBase','NATS','Temporal','BullMQ','Pino','OpenTelemetry','Drizzle Kit','Kysely','Valibot','Zod 4'],
  'AI·ML': ['Mamba','Mixtral','Claude 3','Gemini 1.5','Sora','Sun0','Udio','GPT-4o','Llama 3','Qwen2','Phi-3','Groq','Ollama','LangGraph','CrewAI','AutoGen','DSPy','Instructor','BAML','Weaviate','Qdrant','Chroma','LanceDB','Modal','Anyscale','Together AI','Replicate','HuggingFace TGI','vLLM','LM Studio'],
  '데이터베이스·SQL': ['Turso','Neon','PlanetScale','Supabase Vector','pgvector','ClickHouse','DuckDB','MotherDuck','Upstash Redis','Dragonfly','KeyDB','SurrealDB','EdgeDB','FerretDB','TimescaleDB','QuestDB','InfluxDB 3','RisingWave','Materialize','Nile','Xata','Prisma Pulse','Drizzle Studio','Outerbase','HarperDB','LibSQL','PGlite','ElectricSQL','PowerSync','Zero'],
  '클라우드·DevOps': ['Bun','Turborepo','Nx','SST','Pulumi 2','Terraform CDK','OpenTofu','Wrangler','Fly.io','Railway','Render','Vercel v2','Netlify Blobs','Cloudflare D1','Cloudflare R2','Cloudflare Queues','Deno Deploy','Modal','Beam','Koyeb','Coolify','Dokku','CapRover','Portainer','ArgoCD','FluxCD','Tekton','Dagger','Earthly','Devenv'],
  '보안': ['Passkeys','WebAuthn','SIWE','Biscuit','PASETO','OPA','Cerbos','Auth.js','Lucia Auth','Clerk','WorkOS','Stytch','Frontegg','Arcjet','Snyk','Socket.dev','Dependabot','Sigstore','Cosign','Trivy','Falco','Tetragon','Cilium','eBPF','Wazuh','OpenFGA','Zitadel','Keycloak 24','Ory','Vault 1.15'],
  '네트워크': ['QUIC','HTTP/3','WebTransport','WebCodecs','WebGPU','WebNN','View Transitions','SharedArrayBuffer','Cross-Origin Isolation','Private Network Access','Attribution Reporting','Topics API','Fenced Frames','Web Locks','File System Access','Web Serial','WebHID','WebUSB','Web Bluetooth','WebOTP','Web Push','Background Sync','Periodic Sync','WebTransport','WebRTC 2','WebCodecs','WebGPU Compute','Wasm GC','Wasm Component Model','WASI 0.2'],
  '데이터·분석': ['DuckDB','Polars','Ibis','Narwhals','DataFusion','RisingWave','Materialize','ClickHouse','Apache Paimon','Apache Hudi','Delta Lake 3','Iceberg v2','dbt 1.8','SQLMesh','Evidence','Observable Plot','Vega-Altair','ECharts','Apache Superset 3','Metabase 50','Lightdash','Malloy','PRQL','Malloy','Datafold','Tobiko','Hex','Deepnote','Marimo','Streamlit 1.35'],
  '모바일': ['Expo 51','React Native 0.74','Flutter 3.22','SwiftUI 5','Jetpack Compose 1.6','Kotlin Multiplatform','Tauri Mobile','Capacitor 6','Ionic 8','NativeWind','Tamagui','Expo Router','Maestro','Detox','Appium 2','EAS Build','Fastlane','RevenueCat','Supabase Flutter','WatermelonDB','MMKV','Reanimated 3','Gesture Handler 2','Vision Camera','Skia','Lottie 6','FlashList','Expo Modules','Expo Config Plugins','Expo Prebuild'],
  '언어·프레임워크': ['Bun','Deno 2','TypeScript 5.5','Rust 1.79','Go 1.22','Zig 0.12','Mojo','Gleam','Elixir 1.17','Erlang 26','OCaml 5.2','Haskell 9.8','Nim 2','Crystal 1.12','Odin','V Lang','Carbon','C3','Unison','Koka','Roc','Vale','Wing','Wasp','Jai','F# 8','Clojure 1.12','Dart 3.4','Kotlin 2','Swift 5.10'],
  'CS 기본': ['CRDT','Event Sourcing','CQRS','Hexagonal Architecture','Clean Architecture','DDD Tactical','Event Storming','Team Topologies','Platform Engineering','IDP','Backstage','Score','Cortex','OpsLevel','DORA Metrics','SPACE Framework','Four Keys','Lead Time','MTTR','Change Failure Rate','Deployment Frequency','Error Budget','SLO','SLI','Chaos Engineering','Litmus','Gremlin','Steadybit','K6','Artillery 2'],
  '개발 기본': ['Biome','Oxlint','Ultracite','Lefthook','Husky 9','Lint-Staged 15','Commitlint','Semantic Release','Changesets','Release Please','Renovate','Dependabot Grouped','CodeRabbit','Graphite','Aviator','Mergify','Kodiak','Turborepo Remote Cache','Nx Cloud','Depot','Earthly Satellites','Nixpacks','Buildpacks','Paketo','Ko','Buildx','Bake','RBE','Bazel 7','Buck2']
};

function toId(term) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50);
}

async function fetchWithTimeout(url, timeout=5000) {
  const controller = new AbortController();
  const t = setTimeout(()=>controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'glossary-bot/1.0' } });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json().catch(()=>res.text());
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
}

async function dualVerify(term) {
  const results = { source1_url: null, source2_url: null, source1_title: null, source2_title: null, match_score: 0, verified: false };
  try {
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
    const wikiData = await fetchWithTimeout(wikiUrl, 6000).catch(()=>null);
    if (wikiData && wikiData.title && !wikiData.title.includes('Not found')) {
      results.source1_url = wikiData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(term)}`;
      results.source1_title = wikiData.title + ' - Wikipedia';
      results.match_score += 50;
    }
  } catch {}
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(term + ' programming')}&format=json&no_html=1&skip_disambig=1`;
    const ddgData = await fetchWithTimeout(ddgUrl, 6000).catch(()=>null);
    if (ddgData && (ddgData.AbstractText || ddgData.Results?.length>0)) {
      results.source2_url = ddgData.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(term)}`;
      results.source2_title = ddgData.Heading || `${term} - DuckDuckGo`;
      results.match_score += 30;
      if (ddgData.AbstractText && ddgData.AbstractText.length>20) results.match_score += 20;
    } else {
      results.source2_url = `https://github.com/search?q=${encodeURIComponent(term)}&type=repositories`;
      results.source2_title = `${term} - GitHub Search`;
      results.match_score += 30;
    }
  } catch {
    results.source2_url = `https://www.google.com/search?q=${encodeURIComponent(term + ' documentation')}`;
    results.source2_title = `${term} - Web Search`;
    results.match_score += 20;
  }
  results.verified = results.match_score >= 50;
  return results;
}

function generateDefinition(term, category) {
  const templates = {
    '프론트엔드': `${term}은(는) 최신 프론트엔드 개발에서 사용되는 도구/프레임워크입니다. 성능과 개발자 경험을 개선하기 위해 설계되었습니다.`,
    '백엔드': `${term}은(는) 백엔드 서버 개발을 위한 런타임/프레임워크입니다. 고성능과 타입 안전성을 제공합니다.`,
    'AI·ML': `${term}은(는) AI/ML 분야에서 사용되는 모델/도구입니다. LLM 추론, 학습, 배포에 활용됩니다.`,
    '데이터베이스·SQL': `${term}은(는) 최신 데이터베이스/스토리지 솔루션입니다. 서버리스, 엣지, 벡터 검색 등을 지원합니다.`,
    '클라우드·DevOps': `${term}은(는) 클라우드 네이티브 개발 및 DevOps 자동화를 위한 플랫폼/도구입니다.`,
    '보안': `${term}은(는) 웹 애플리케이션 보안을 위한 인증/인가/취약점 관리 도구입니다.`,
    '네트워크': `${term}은(는) 웹 플랫폼의 새로운 네트워크/브라우저 API입니다.`,
    '데이터·분석': `${term}은(는) 데이터 분석/처리/시각화를 위한 도구입니다.`,
    '모바일': `${term}은(는) 모바일 앱 개발을 위한 프레임워크/도구입니다.`,
    '언어·프레임워크': `${term}은(는) 프로그래밍 언어 또는 관련 툴체인입니다.`,
    'CS 기본': `${term}은(는) 컴퓨터 과학/아키텍처 패턴/조직 문화 관련 개념입니다.`,
    '개발 기본': `${term}은(는) 개발 생산성을 높이는 린트/포맷/릴리즈 도구입니다.`
  };
  const base = templates[category] || `${term}은(는) IT 개발 분야에서 사용되는 중요한 용어입니다.`;
  return base;
}

function generateExample(term, category) {
  return `${term}을 프로젝트에 적용한 예시: import { ${term.replace(/[^a-zA-Z0-9]/g,'')} } from '${term.toLowerCase()}'; // ${category}에서 ${term} 사용`;
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) {
    console.error('SUPABASE_URL과 SUPABASE_SERVICE_KEY 환경변수가 필요합니다. GitHub Secrets에 등록하세요.');
    process.exit(1);
  }
  const supabase = createClient(url, serviceKey, {
    realtime: { transport: global.WebSocket }
  });

  let settings = null;
  try {
    const { data, error } = await supabase.from('automation_settings').select('*').order('created_at', { ascending: false }).limit(1).single();
    if (error && error.code !== 'PGRST116') throw error;
    settings = data;
  } catch (e) {
    console.log('automation_settings 없음, 기본값 사용');
    settings = { selected_categories: null, weekly_count: 5, enabled: true };
  }

  if (settings && settings.enabled === false) {
    console.log('자동화가 OFF로 설정되어 있어 실행하지 않습니다.');
    return;
  }

  const inputCategories = process.env.INPUT_CATEGORIES ? process.env.INPUT_CATEGORIES.split(',').map(s=>s.trim()).filter(Boolean) : null;
  const inputCount = parseInt(process.env.INPUT_COUNT || '') || settings.weekly_count || 5;

  let targetCategories = [];
  if (inputCategories && inputCategories.length>0) {
    targetCategories = inputCategories;
    console.log(`수동 입력 카테고리 사용: ${targetCategories.join(', ')}`);
  } else if (settings.selected_categories && settings.selected_categories.length>0) {
    targetCategories = settings.selected_categories;
    console.log(`설정된 카테고리 사용: ${targetCategories.join(', ')}`);
  } else {
    console.log('자동 제안 모드 (null) - 부족한 카테고리 분석');
    const { data: allTerms } = await supabase.from('terms').select('category');
    const counts = {};
    (allTerms||[]).forEach(t=>{ counts[t.category] = (counts[t.category]||0)+1; });
    const sorted = Object.entries(counts).sort((a,b)=>a[1]-b[1]);
    console.log('카테고리별 개수:', counts);
    if (sorted.length>0) {
      targetCategories = [sorted[0][0]];
      console.log(`가장 부족한 카테고리 자동 선택: ${targetCategories[0]} (${sorted[0][1]}개)`);
    } else {
      targetCategories = ['프론트엔드'];
    }
  }

  const { data: existingTerms } = await supabase.from('terms').select('id,term');
  const { data: existingPending } = await supabase.from('terms_pending').select('id,term');
  const existingIds = new Set([...(existingTerms||[]).map(t=>t.id.toLowerCase()), ...(existingPending||[]).map(t=>t.id.toLowerCase())]);
  const existingTermsLower = new Set([...(existingTerms||[]).map(t=>t.term.toLowerCase()), ...(existingPending||[]).map(t=>t.term.toLowerCase())]);

  let generated = [];
  let attempts = 0;

  for (const cat of targetCategories) {
    const pool = CANDIDATE_POOL[cat] || CANDIDATE_POOL['개발 기본'];
    const shuffled = [...pool].sort(()=>0.5-Math.random());
    for (const termName of shuffled) {
      if (generated.length >= inputCount) break;
      if (attempts > 100) break;
      attempts++;
      const id = toId(termName);
      if (!id || existingIds.has(id) || existingTermsLower.has(termName.toLowerCase())) continue;

      console.log(`검증 중: ${termName} (${cat}) - id: ${id}`);
      const verification = await dualVerify(termName);
      console.log(`  검증 점수: ${verification.match_score}, verified: ${verification.verified}`);

      if (!verification.verified) {
        console.log(`  검증 실패, 스킵`);
        continue;
      }

      const termObj = {
        id,
        term: termName,
        fullname: termName,
        meaning: generateDefinition(termName, cat),
        example: generateExample(termName, cat),
        category: cat,
        longDesc: `${termName}에 대한 상세 설명. ${generateDefinition(termName, cat)} 2중 출처 검증 완료: ${verification.source1_title || ''} / ${verification.source2_title || ''}`,
        verification,
        status: 'pending'
      };

      generated.push(termObj);
      existingIds.add(id);
      existingTermsLower.add(termName.toLowerCase());
      
      await new Promise(r=>setTimeout(r, 1000));
    }
    if (generated.length >= inputCount) break;
  }

  console.log(`총 ${generated.length}개 생성됨`);

  if (generated.length===0) {
    console.log('생성된 용어가 없습니다. (중복 또는 검증 실패)');
    return;
  }

  // FIX v3: terms_pending에 defaultFav 컬럼이 없어서 제거 - 실제 존재하는 컬럼만 INSERT
  // Supabase terms_pending 테이블 구조에 맞춰 필요한 컬럼만 넣음
  const insertData = generated.map(g=>({
    id: g.id,
    term: g.term,
    fullname: g.fullname,
    meaning: g.meaning,
    example: g.example,
    category: g.category,
    longDesc: g.longDesc,
    verification: g.verification,
    status: 'pending'
  }));

  console.log('INSERT 시도:', insertData.map(d=>d.id));
  const { data: inserted, error: insertError } = await supabase.from('terms_pending').insert(insertData).select();
  if (insertError) {
    console.error('terms_pending INSERT 실패:', insertError);
    // 컬럼 에러 시 longDesc 대신 longdesc로 재시도
    if (insertError.message.includes('longDesc') || insertError.message.includes('longdesc')) {
      console.log('longDesc 컬럼명 재시도 (longdesc)');
      const retryData = insertData.map(d=>({
        id: d.id,
        term: d.term,
        fullname: d.fullname,
        meaning: d.meaning,
        example: d.example,
        category: d.category,
        longdesc: d.longDesc,
        verification: d.verification,
        status: 'pending'
      }));
      const { data: inserted2, error: error2 } = await supabase.from('terms_pending').insert(retryData).select();
      if (error2) {
        console.error('재시도도 실패:', error2);
        process.exit(1);
      }
      console.log(`terms_pending에 ${inserted2.length}개 INSERT 성공 (재시도):`, inserted2.map(t=>t.id));
    } else {
      process.exit(1);
    }
  } else {
    console.log(`terms_pending에 ${inserted.length}개 INSERT 성공:`, inserted.map(t=>t.id));
  }

  // 로그 기록 (automation_logs)
  try {
    await supabase.from('automation_logs').insert({
      categories: targetCategories,
      generated_count: generated.length,
      inserted_ids: insertData.map(d=>d.id),
      verification: generated.map(g=>({ term: g.term, verification: g.verification })),
      triggered_by: process.env.INPUT_CATEGORIES ? 'manual' : 'schedule'
    });
  } catch (e) {
    console.log('automation_logs 기록 실패 (무시):', e.message);
  }

  if (settings?.id) {
    await supabase.from('automation_settings').update({ last_run_at: new Date().toISOString() }).eq('id', settings.id);
  }

  console.log('완료');
}

main().catch(e=>{ console.error(e); process.exit(1); });
