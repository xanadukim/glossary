# glossary - IT·AI 용어 사전 (Supabase 연동)

## 구조
- GitHub Pages: https://<user>.github.io/glossary/
- Supabase Project: https://efklbyhqsmbieefbamen.supabase.co
- Table: public.terms (445 rows)

## 파일 규칙 (소문자)
- js/config.js, js/supabase.js, js/loader.js, js/auth.js, js/export.js
- css/app.css
- index.html, admin.html

## Supabase 설정
1. Table: terms (id PK text, term, fullname, meaning, example, category, longDesc, defaultFav)
2. RLS:
   - SELECT to public using true (읽기)
   - ALL to authenticated using true (쓰기)
3. Auth: Users > Add user (admin@glossary.local)

## CRUD 데이터 처리 방식
- id: 키필드, 중복 불가. 클라이언트 + DB PK로 2중 체크. 생성 시 /^[a-z0-9-]+$/ 검증.
- category: 기존 12개 + 직접 입력 허용. select에 "__custom__" 옵션으로 처리.
- 저장: supabase.from('terms').insert/update/delete 즉시 반영. CSV fallback 유지.
- index.html은 supabase 실패 시 ./terms.csv 자동 fallback.
- admin.html은 Supabase Auth 로그인 후에만 CRUD 가능.

## 배포
glossary/ 폴더 전체를 GitHub repo 루트에 업로드. terms.csv는 백업용으로 유지.


