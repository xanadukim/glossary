
export const CATEGORY_COLORS = {
  "Git·GitHub": { dot: "#f97316", light: "#fff1e6", text: "#c2410c", border: "#ffedd5" },
  "개발 기본": { dot: "#57534e", light: "#f5f5f4", text: "#44403c", border: "#e7e5e4" },
  "프로그래밍 개념": { dot: "#d97706", light: "#fef3c7", text: "#92400e", border: "#fde68a" },
  "웹 공통·HTTP": { dot: "#2563eb", light: "#eff6ff", text: "#1d4ed8", border: "#dbeafe" },
  "프론트엔드": { dot: "#ec4899", light: "#fdf2f8", text: "#be185d", border: "#fce7f3" },
  "백엔드": { dot: "#6366f1", light: "#eef2ff", text: "#4338ca", border: "#e0e7ff" },
  "데이터베이스·SQL": { dot: "#16a34a", light: "#f0fdf4", text: "#15803d", border: "#dcfce7" },
  "배포·운영": { dot: "#0891b2", light: "#ecfeff", text: "#0e7490", border: "#cffafe" },
  "프로젝트·협업": { dot: "#57534e", light: "#f5f5f4", text: "#44403c", border: "#e7e5e4" },
  "AI 기초": { dot: "#8b5cf6", light: "#f5f3ff", text: "#6d28d9", border: "#ede9fe" },
  "AI 활용·개발": { dot: "#d946ef", light: "#fdf4ff", text: "#a21caf", border: "#fae8ff" },
  "AI 정책·윤리": { dot: "#f43f5e", light: "#fff1f2", text: "#be123c", border: "#ffe4e6" }
};
export const INITIAL_TERM = { id: "crud", term: "CRUD", fullname: "Create Read Update Delete", meaning: "데이터를 다루는 4가지 기본 연산", example: "데이터베이스 기본 사이클", category: "데이터베이스·SQL", isCRUD: true };
export const TOP30 = [
  { term: "Repo", desc: "프로젝트 저장소" }, { term: "Clone", desc: "프로젝트 복사" }, { term: "Commit", desc: "변경 기록" }, { term: "Push", desc: "GitHub 업로드" }, { term: "Pull", desc: "최신 코드 받기" }, { term: "Branch", desc: "독립 작업 공간" }, { term: "Merge", desc: "브랜치 합치기" }, { term: "PR", desc: "코드 반영 요청" }, { term: "Issue", desc: "할 일·버그 기록" }, { term: "Conflict", desc: "코드 충돌" }, { term: "API", desc: "프로그램 연결 창구" }, { term: "JSON", desc: "데이터 교환 형식" }, { term: "HTTP/HTTPS", desc: "웹 통신/보안 통신" }, { term: "GET/POST/PUT/PATCH/DELETE", desc: "조회·생성·수정·삭제" }, { term: "200/404/500", desc: "성공·없음·서버 오류" }, { term: "Frontend", desc: "사용자 화면" }, { term: "Backend", desc: "서버 처리" }, { term: "Database", desc: "데이터 저장소" }, { term: "SQL", desc: "DB 질의 언어" }, { term: "SELECT/WHERE/JOIN", desc: "조회·조건·테이블 연결" }, { term: "PRIMARY KEY/FOREIGN KEY", desc: "기본키·외래키" }, { term: "Deployment", desc: "서비스 배포" }, { term: "CI/CD", desc: "자동 테스트·배포" }, { term: "Docker/Container", desc: "환경 포장·실행 단위" }, { term: "Bug/Debug", desc: "오류·오류 수정" }, { term: "AI/ML/DL", desc: "인공지능·머신러닝·딥러닝" }, { term: "GenAI/LLM", desc: "생성형 AI·대규모 언어모델" }, { term: "Prompt/Context/Token", desc: "지시·참고정보·처리단위" }, { term: "RAG/Vector DB/Embedding", desc: "문서검색 답변·유사검색 DB·의미 변환" }, { term: "MCP/Agent/Tool Calling", desc: "AI-외부도구 연결·업무 수행 AI·기능 호출" }
];
export const ADMIN_PASSWORD_HASH = "4b191de8ad43bdcb2784d816282df5ec453355c2040ee60157c6f962067136c5";
