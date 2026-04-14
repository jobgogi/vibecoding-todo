# Todo App

React + TypeScript + Tailwind CSS로 만든 할 일 관리 앱입니다.

## 기능

- **할 일 추가** — 텍스트 입력 후 Enter 또는 `+` 버튼
- **우선순위 설정** — Low(초록) / Medium(노랑) / High(빨강) 선택
- **완료 토글** — 체크박스 클릭 (완료 시 취소선)
- **인라인 편집** — 텍스트 더블클릭, Enter 저장 / Esc 취소
- **삭제** — 항목 호버 시 나타나는 삭제 버튼
- **필터** — All / Active / Done 탭
- **Clear completed** — 완료 항목 일괄 삭제
- **진행률 표시** — 상단 프로그레스 바
- **다국어 지원** — 한국어 / English / 日本語 / 中文
- **데이터 영속** — localStorage에 자동 저장

## 기술 스택

| 역할 | 라이브러리 |
|------|-----------|
| UI | React 18 + TypeScript |
| 빌드 | Vite 6 |
| 스타일 | Tailwind CSS 3 |
| 국제화 | i18next + react-i18next |
| E2E 테스트 | Playwright |

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 테스트

```bash
# E2E 테스트 실행 (57개)
npm run test:e2e

# UI 모드로 실행
npm run test:e2e:ui

# HTML 리포트 보기
npm run test:e2e:report
```

## 프로젝트 구조

```
src/
├── components/
│   ├── FilterTabs.tsx      # 필터 탭 (All / Active / Done)
│   ├── LanguageSelector.tsx # 언어 선택기
│   ├── TodoInput.tsx       # 할 일 입력
│   ├── TodoItem.tsx        # 할 일 항목 (편집/삭제/완료)
│   └── TodoList.tsx        # 할 일 목록
├── hooks/
│   └── useTodos.ts         # Todo CRUD + 필터 + localStorage
├── i18n/
│   ├── index.ts            # i18next 설정
│   └── locales/            # en / ko / ja / zh
├── types/
│   └── todo.ts             # Todo, Priority, Filter 타입
└── App.tsx
tests/
├── todo.spec.ts            # CRUD, 필터, 통계, 우선순위, 영속성 테스트
└── i18n.spec.ts            # 다국어 전환 테스트
```
