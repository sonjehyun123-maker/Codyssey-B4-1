# jaehyun@portfolio

재현의 개발 포트폴리오. 순수 HTML/CSS/JavaScript로 제작한 반응형 웹사이트이며,
CRT 터미널(모노톤 인광) 컨셉으로 디자인했습니다.

## 배포
- 배포 URL: https://sonjehyun123-maker.github.io/Codyssey-B4-1/
- 저장소: https://github.com/sonjehyun123-maker

## 사용 기술
- HTML5 시맨틱 마크업
- CSS3 (Flexbox, Grid, CSS 변수, `[data-theme]` 기반 테마 전환)
- Vanilla JavaScript (ES6+, `fetch`/`async-await`, `IntersectionObserver`)
- GitHub REST API (`/users/{username}/repos`)
- 웹폰트: Press Start 2P(Google Fonts), Galmuri(한글 도트 폰트)

## 디자인 컨셉
1980~90년대 CRT 모니터의 인광(phosphor) 디스플레이에서 착안했습니다.
헤더의 테마 버튼을 누르면 **그린 인광(기본) ↔ 라이트(도트 프린터 용지)**로 전환되며,
상태는 `localStorage`에 저장되어 새로고침 후에도 유지됩니다.

라이트 모드는 크림색 종이 배경 + 짙은 잉크색 텍스트로, 오래된 도트 프린터 영수증에서
착안했습니다. 과제 요구사항의 "다크 모드 토글"이 요구하는 실제 명암 대비(밝은 배경 ↔
어두운 배경)를 이 구조가 그대로 충족합니다.

## 상태 → 렌더링 흐름
1. 테마 토글 클릭 → `data-theme` 상태 변경 → 전체 색상 변경 (localStorage 유지)
2. GitHub API 호출 → 로딩/성공/에러/빈 상태 변경 → Projects 섹션 렌더링
3. 폼 입력 → 유효성 상태 변경 → 에러 메시지 표시/숨김

## 주요 기준값
- 스크롤 300px 이상 → 맨 위로 버튼 노출
- 스크롤 60px 이상 → 네비게이션 배경 전환
- IntersectionObserver threshold: 0.2

## 실행 방법
```bash
# VS Code Live Server 확장 사용 또는
npx serve .
```

## 폴더 구조
```
.
├── index.html
├── css/style.css
├── js/main.js
└── images/avatar-placeholder.svg
```

## 스크린샷
