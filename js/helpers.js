export function getExamples(termObj) {
  const t = termObj.term; const n = termObj.example || ''; const cat = termObj.category || '';
  if (termObj.isCRUD) return ["사용자 정보를 새로 등록할 때는 Create, 내 정보를 볼 때는 Read를 쓴다고 생각하면 돼요.", "게시글을 고칠 땐 Update, 탈퇴할 땐 Delete를 호출해요."];
  if (cat.includes('Git')) return [`"${t} 하기 전에 ${n} 상황을 먼저 확인했어?"`, `"이번 기능은 ${t}으로 처리하고 PR 올릴게요."`];
  if (cat.includes('데이터베이스')) return [`"${t} 조건으로 ${n}에서 필터링해 볼게요."`, `"이 테이블은 ${t} 성능을 위해 인덱스를 추가해야 해요."`];
  if (cat.includes('웹') || cat.includes('HTTP')) return [`"${t} 요청이 404로 실패하면 ${n}를 확인해요."`, `"프론트에서 ${t} 호출할 때 헤더를 빼먹었네."`];
  if (cat.startsWith('AI')) return [`"${t} 때문에 ${n}가 달라졌어요, 프롬프트를 다시 튜닝해야 해요."`, `"이 서비스는 ${t}을 적용해 ${n}를 개선했어요."`];
  return [`"오늘 회의에서 ${t} 관련해서 ${n} 이슈가 나왔어요."`, `"${t}을 이해하면 ${n}를 다루기 훨씬 쉬워져요."`];
}
export function getMapping(termObj) {
  const cat = termObj.category || '';
  if (termObj.isCRUD) return { title: "CRUD의 각 연산과 SQL 대응", rows: [{ op: "Create", ko: "생성", desc: "새로운 레코드를 추가", sql: "INSERT" }, { op: "Read", ko: "읽기/조회", desc: "저장된 데이터를 검색", sql: "SELECT" }, { op: "Update", ko: "수정", desc: "기존 레코드를 변경", sql: "UPDATE" }, { op: "Delete", ko: "삭제", desc: "레코드를 제거", sql: "DELETE" }] };
  if (cat.includes('웹 공통·HTTP')) return { title: "HTTP 메서드로 보는 CRUD 매핑", rows: [{ op: "GET", ko: "조회", desc: "데이터 가져오기", sql: "SELECT · Read" }, { op: "POST", ko: "생성", desc: "새 리소스 만들기", sql: "INSERT · Create" }, { op: "PUT", ko: "전체 수정", desc: "리소스 덮어쓰기", sql: "UPDATE" }, { op: "PATCH", ko: "부분 수정", desc: "일부 필드 변경", sql: "UPDATE" }, { op: "DELETE", ko: "삭제", desc: "리소스 제거", sql: "DELETE" }] };
  if (cat.includes('Git')) return { title: "Git 명령어 흐름", rows: [{ op: "Clone", ko: "복사", desc: "원격 → 로컬", sql: "git clone" }, { op: "Branch", ko: "분기", desc: "독립 작업 공간", sql: "git branch" }, { op: "Commit", ko: "기록", desc: "변경 저장", sql: "git commit" }, { op: "Push", ko: "업로드", desc: "로컬 → 원격", sql: "git push" }, { op: "PR", ko: "요청", desc: "병합 요청", sql: "GitHub PR" }] };
  if (cat.includes('데이터베이스')) return { title: termObj.term.toUpperCase().includes("SELECT") || termObj.term === "SQL" ? "자주 쓰는 SQL 패턴" : "SQL 관점에서 보기", rows: [{ op: "SELECT", ko: "조회", desc: "데이터를 읽어오기", sql: "SELECT * FROM users" }, { op: "WHERE", ko: "조건", desc: "필터링", sql: "WHERE id = 1" }, { op: "JOIN", ko: "연결", desc: "테이블 합치기", sql: "JOIN orders ON ..." }, { op: "INSERT / UPDATE", ko: "변경", desc: "데이터 쓰기", sql: "INSERT · UPDATE" }] };
  return null;
}
