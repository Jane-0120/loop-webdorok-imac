# 국민체력 loop — 웹도록 (Vite + React)

디자인씽킹스튜디오 2026 · 국민체력100 서비스 경험 리뉴얼 프로젝트의 웹도록. 장표 나열이 아니라 **실제 서비스 사이트처럼** 보이는 랜딩(앞면) + 리서치·기획·제작·결과물 장표 아카이브(뒷면).
작업자: 서연(디자인). 커뮤니케이션은 한국어 반말, 짧고 직설적으로.

## 실행
```
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ → GitHub Pages (vite base './')
```
- 배포: https://jane-0120.github.io/loop-webdorok-imac/ (저장소 Jane-0120/loop-webdorok-imac) — main에 push하면 자동 배포 (.github/workflows/deploy.yml)
- 이 저장소는 아이맥 24인치(기본 해상도 2240×1260) · 브라우저 도구막대 없는 전체 화면 전용 복사본. 원본: libe396/loop-webdorok

## 디자인 기준 (Figma가 원본)
- Figma 파일 `9wJzEafnp4YRzPSR6oswWX` (디자인씽킹스튜디오)
  - `웹도록` 페이지(2896:17195): 키프레임 와이어프레임(S00~S10) + `랜딩 v2 · Hi-Fi` 섹션
  - Hi-Fi 확정: S01 Hero(B 리본, 정지 배경) · S03 Loop · S04 Play — 1920×1080 프레임
  - `Design System` 페이지 'Logo' 섹션: `LOOP / Logo / Wordmark·App Icon·Symbol` 컴포넌트
- 인터랙션 스펙: `docs/loop-landing-v2-interaction.html` (장면별 동작·트리거·Small 대응)
- **Hi-Fi와 다르면 Hi-Fi가 이김.** 와이어프레임 Large(1440)는 비율 스케치일 뿐.

## 토큰 (src/styles/tokens.css)
- 레이아웃: 1920 기준 좌우 121 / 상하 110 → `--mx`, `--my` (clamp로 축소). 콘텐츠 폭 1678
- 타이포: Wanted Sans(npm `wanted-sans` variable). 12/14/16/18/20/24/36/48/56 — 36 이하 행간 150%, 48부터 130%, 자간 -2%. 굵기는 medium(500)/semibold(600). 유틸 클래스 `.t12`~`.t56`, `.medium`, `.semibold`
- 색: violet 100/300/500/700/900, gray 50~900, lime·aqua·peach·pink·paper. 배경 gray-50, 카드 흰색, 그림자 거의 없음
- 반경: 카드 32, 큰 요소 28, 버튼·칩 999
- 브레이크포인트: Small ≤480 / Medium 481–1024 / Large 1025~
- 글래스: 기본 `.glass`(흰 72% + blur 24), 포인트 `.glass-frost`(좌→우 그라디언트 + blur 28 · saturate 160 + 안쪽 하이라이트). frost는 뒤에 색·이미지 있을 때만 — GNB·Hero 카드·S03 카드·S04 토이
- 규칙: 한 화면(섹션)에 그라디언트 하나. 실외=peach·pink, 실내·기본=violet

## 구조
- `src/sections/` Intro(S00) · Hero(S01) · About(S01b 서비스 소개, #about) · Problem(S02) · Loop(S03) · Play(S04) · Focus(S05) · Band(S06) · Home(S06b AIoT, #aiot) · Prescriber(S07, #prescriber) · Behind(S08) · Brand(S09) · Outro(S10)
- `src/components/` Gnb, Wordmark(DS 로고 벡터), Phone(화면 목업), Button, Glass
- `src/pages/` Landing(S00~S10) · Archive(챕터 템플릿)
- `src/lib/useScrollProgress.js` sticky 핀 섹션 진행률(0→1) · `src/lib/scroll.js` 전역 Lenis + `scrollToTarget`
- `scripts/archive-from-pdf.py` PDF → 장표 JPG · `scripts/archive-webp.py` 장표 JPG → WebP 1920(q78) + @960
- `src/data/screens.js` 앱 화면 이미지 경로

## 진행 상태
- [x] S00 Intro — 도트 100 → l o o → +p → 워드마크 → GNB 로고로 비행. 세션당 1회, 건너뛰기·ESC, 끝나면 `loop:intro-done` 이벤트
- [x] S01 Hero — 리본 배경(정지 WebP) + GSAP 등장(헤드라인 줄 마스크 → 폰 → 글래스 카드)
- [x] S02 Problem — 단어 스크럽, 끊기는 선, 카운트업, 인용
- [x] S03 Loop — ∞ 위 러너, 4정거장마다 폰·카피 교체, 한 바퀴 뒤 MEASURE로. 하단 프로그레스바 없음(삭제 확정). 폰 2대(이전=뒤·흐림, 현재=앞), 목업 왼쪽 이동 · GROW는 첨부 AI 챗봇 화면 전체 표시(`src/assets/screens/ai.webp`, 빌드 해시 URL로 캐시 갱신) + 카드는 `.glass-frost`(프로스티드 글라스, loop.css)
- [x] S04 Play — 글라스 카드 + violet 블롭 배경. 유형 카드·코스·무브바디는 DS 원본 에셋(public/img/play/, #05) 사용, 수면 슬라이더는 DS Slider 스펙 CSS
- [x] S04 DS 에셋 5개 export (#05) — public/img/play/. route.svg 배경은 Mesh gradient 셰이더라 SVG export에서 빠져서 같은 식으로 렌더한 래스터를 SVG 안에 넣음
- [x] 앱 화면 이미지: `public/screens/{h0,m0,r00,ai,h4}.webp` (750×1624, 위쪽 크롭), `public/img/band.webp` — Figma MCP export → sharp WebP q82
- [x] S05 Focus(Focus.jsx) — 배경 다크 스크럽 + 무인 측정 다크 v2 화면 6장 — `public/screens/{s0,a1,a2,a3,a4,s9}.webp` export 완료 (#09)
- [x] S06 LOOP band(Band.jsx) — 기울기 회전 + 핫스팟 글라스 카드, band-cut.webp
- [x] S08 Behind(Behind.jsx) — 카운트업 숫자 · 장표 썸네일 마퀴 2줄(호버 정지·확대, 클릭→챕터) · 결정 전후 3개를 구분선으로 정리한 흰 패널 + 챕터 링크 · 파란 블롭·glow·겹침 제거
- [x] S09 Brand(Brand.jsx) — 핀 220vh, 워드마크 Violet→Intelligence→Delight→Clarity 전환, → #/archive/make
- [x] S10 Outro(Outro.jsx) — 커서 스포트라이트로 차오르는 워드마크 · 마그네틱 CTA · 문구 “직접 loop의 서비스를 체험해보세요.” · 로고 가운데 정렬 · D-90 ↺ 맨 위로
- [ ] 프로토타입 체험 링크 (Button href="#" 자리 — 프로토타입 URL 받으면 교체: Hero · GNB · Outro)
- [x] S06b AIoT(Home.jsx, #aiot) — 다크(gray-900), 「AIoT 디바이스」, 인쇄도록 제품 컷 한 장(카드) + 기능 4개(IOT-01 ROLE) + 원형 화면 6개(A-00·02·05·06·08·09, IOT-02~04 캡션). GNB 다크는 `is-aiot-dark`
- [x] S07 처방사(Prescriber.jsx, #prescriber) — 메인 대시보드 평면 화면 + 보조 3장, 캡션은 발표 PPT 「추출」 DH-01·02·07·09. 'lOOP' 소문자 l 의도된 표기
- [x] 아카이브 페이지 `#/archive/{research,plan,make,result}` — `src/pages/Archive.jsx` 템플릿 하나, 데이터 `src/data/archive.js`(manifest + 헤더 카피). 결과물 챕터 공개(#18): GNB·S08·S07/S06b 딥링크
- [x] 라우팅: HashRouter. `/archive/:chapter`만 라우트, 나머지 해시(#top·#service…)는 랜딩이 받아서 해당 id로 스크롤
- [x] 장표 WebP: research 134 · plan 31 · make 49 · result 44 = 258장 (`public/archive/`, 약 24MB). 장 수는 manifest에서 계산
  - research·plan 원본: `~/Desktop/Loop_Research.pdf`(167p: 1 표지 · 2–135 r001–r134 · 136–166 p001–p031 · 167 끝) → `scripts/archive-from-pdf.py`(pymupdf 필요) → `docs/archive/{research,plan}/*.jpg`
  - make·result 원본: 발표 장표 Figma `jm83f0M7tlSafawIkAZ6b5` 「추출」 페이지(+와이어프레임은 Week 2-1 섹션) → `docs/archive/{make,result}/`. 노드 표 `docs/archive-sources.md`
  - 변환: `python3 scripts/archive-webp.py [-f]`. p023(블루프린트)만 16:9 아님 → 이미지는 원본 비율로 표시

## 작업 규칙
- 새 값은 토큰 먼저. 하드코딩 색·크기 금지
- 모션은 `prefers-reduced-motion`이면 끄기 (Hero·Lenis 이미 처리)
- 텍스트는 Figma 카피 그대로. 없는 수치는 만들지 말 것

## Figma 에셋 노드 ID (파일 9wJzEafnp4YRzPSR6oswWX)
| 파일 | 노드 | 설명 |
|---|---|---|
| public/screens/h0.webp | 2673:21476 | H-0 홈 (Key visual) |
| public/screens/m0.webp | 2673:20706 | M-0 측정 탭 홈 |
| public/screens/r00.webp | 2673:20926 | R-00 루틴 홈 (D 반전) |
| public/screens/ai.webp | 2659:18987 | AI 챗봇 랜딩 |
| public/screens/h4.webp | 2840:27733 | H-4 변화 리포트 · 무브바디 |
| public/img/band.webp | 2701:56643 | LOOP band 제품 이미지 |
| public/screens/s0.webp | 2789:19754 | S0 · 측정 모드 진입 (다크 전환) |
| public/screens/a1.webp | 2786:18937 | A1 v2 · NFC 태그 대기 |
| public/screens/a2.webp | 2786:18954 | A2 v2 · 태그 인식 · 측정 준비 |
| public/screens/a3.webp | 2786:18978 | A3 v2 · 측정 중 (실시간) |
| public/screens/a4.webp | 2786:19005 | A4 v2 · 종목 완료 · 자동 기록 |
| public/screens/s9.webp | 2786:19127 | S9 v2 · 측정 완료 (라이트 복귀) |
| src/assets/screens/final/dash-home.webp | 3224:46487 | 01 · 대시보드 (v7 · 밸런스) |
| src/assets/screens/final/dash-queue.webp | 3224:44504 | M1 · 측정 대기 목록 |
| src/assets/screens/final/dash-ai.webp | 3224:43207 | 04 · AI 처방 검토 |
| src/assets/screens/final/dash-member.webp | 3224:45115 | 02 · 회원 상세 |
| public/img/aiot-front.webp | 3490:33243 (「Iot목업 1」 3472:41263 자리) | AIoT 디바이스 인쇄도록 컷 — 프레임 이미지 채우기 원본을 프레임 크롭대로 |
| src/assets/screens/final/aiot-a00.webp | 3059:24260 | A-00 · 홈 (기본 화면) |
| src/assets/screens/final/aiot-a02.webp | 3054:26720 | A-02 · 리마인드 알림 |
| src/assets/screens/final/aiot-a05.webp | 3054:26732 | A-05 · 운동 진행 |
| src/assets/screens/final/aiot-a06.webp | 3054:26736 | A-06 · 실시간 자세 코칭 |
| src/assets/screens/final/aiot-a08.webp | 3054:26744 | A-08 · 루틴 완료 |
| src/assets/screens/final/aiot-a09.webp | 3054:26748 | A-09 · AI 음성 질문 |

지시 이력은 `docs/claude-code-prompts.md`.


## #14 · 공개 완성도 개선

- 공유: 전체 서비스명 title, Hero 서브카피 description, OG/Twitter 메타·theme-color·DS 심볼 favicon 추가. `scripts/generate-social.mjs`로 Wanted Sans + 리본 + 워드마크를 1200×630 OG 이미지로 합성.
- 공개 상태: S07은 코드 유지·렌더 제외, GNB 결과물 숨김, S08 결과물은 비활성 span. result 라우트 유지.
- `src/data/links.js`의 PROTOTYPE_URL은 서연 확인으로 빈 값 유지. Hero/GNB/Outro CTA 모두 숨김. URL 설정 시 새 탭으로 열림.
- S04 유형 카드는 무작위 뽑기가 아닌 측정 결과 예시로 안내. 카드 회전 유지, 다시 뽑기 삭제, 무브바디와 벤토에 예시 표시.
- S02: r008/r009의 32만·4.6%는 PPT 출처로 유지(서연 승인, 원출처 문서·기준연도 미확인). 3일~1주는 r062/r071의 방문자 6명 인터뷰(2026) 범위로 문구 한정.
- S08: 지정 결정 문구 반영. 직접 근거 매칭 미확인으로 세 카드 모두 링크 없이 유지(서연 승인). 흰 glass-frost 카드·진한 본문, 단일 KV 블롭 배경·외부 KV 그림자.
- S06: 240vh 핀 제거, 진입 한 번 기울기 전환·핫스팟 0.4초 간격 등장. S05 240vh, S09 150vh. 1024 이하 및 reduced-motion에서는 S05 6장 가로 스크롤, S09 2×2 워드마크.
- S03 시점: D-0 / D-1 / 6주차 / 12주차.
- 아카이브: 21개 요약 서연 승인 후 manifest 반영. make 브랜드·로고 및 자료 없는 4개 섹션은 빈 summary 유지. 원본 라이트박스(ESC·배경 클릭·좌우 키), 서비스 소개 복귀, 근거 딥링크 추가.
- 검증: A~E 빌드 통과. 1920×1080 / 390×844 Chromium 캡처·조작 검증. Landing 높이 21,918→17,818px / 17,220→13,425px. 자세한 근거·승인은 `docs/review-14.md`.
- 배포: 모든 승인 완료. 단일 커밋 `공개 완성도 개선 #14`를 main에 push하는 기존 GitHub Pages 워크플로 사용.

## #15 · 노트북 폭 핫스팟·아웃트로 문구

- S06: 회전하는 제품 이미지와 카드 레이어 분리. ResizeObserver로 카드·stage 실제 크기를 재서 좌/우/아래 방향 전환 및 카드 간 충돌 회피. 1025~1600에서 심박은 아래, 수면은 왼쪽 우선. 모바일 전환 시 측정 좌표 초기화.
- 배경 블롭은 섹션 내부 radial-gradient + 상하 mask fade로 경계 제거. reduced-motion 유지.
- S10: PROTOTYPE_URL이 비면 `측정에서 끝나지 않는 / 건강의 선순환.`, 있을 때만 기존 체험 제목·CTA.
- 검증: 빌드 성공. Chromium 1920/1600/1440/1280/1025 캡처·좌표 검사에서 카드 3장 stage 내부, 설명·카드 간 겹침 없음. 1440/1920 배경 경계 육안 확인. 390 모바일 전환 및 URL 유무 두 분기 확인(테스트 URL은 브라우저 응답에만 주입).
- 배포: `#15 노트북 폭 핫스팟·아웃트로 문구` 단일 커밋 → main push → 기존 GitHub Pages 워크플로.

## #16 · S02 고정값·S03 겹침·Hero 동선

- #15 완료 상태에서 진행(S06 핫스팟/블롭/Outro 유지).
- S02 일반 섹션, 32만 명·4.6%·3일~1주 고정값. 숫자 영역은 최초 진입 시 opacity+translateY 0.5초, 문장·선은 뷰포트 진입 구간만 스크럽. 출처 유지.
- S03 데스크톱 앞 폰 폭 44%·위치 조정, 이전 폰 opacity .35. 1440/1920에서 카드 겹침 폭 약 3.5%, 상단 카드·버튼 노출 확인.
- 1024 이하 진행 표시 64px(점 4개+현재 단계), 폰 60vw 중앙, 설명 아래 배치. 가장 긴 AI 화면도 카드와 24px 간격. 긴 패널의 하단까지 읽도록 ResizeObserver로 모바일 sticky top 조정. 숨긴 폰의 transform으로 인한 가로 넘침 방지.
- Hero 검정 주 버튼 → S03 내부 스크롤, 리서치 과정은 violet 텍스트 링크. 프로토타입 URL 빈 값 유지.
- S04 코스 제목/힌트 변경, 예시 라벨. S08 KV 블롭 opacity .6, 그림자 blur 20→12px. S09 100vh, 로고는 진입 구간 기준 전환.
- 검증: npm run build 성공, lint 오류 없음(기존 경고 3개). Chromium 1440×1000/1920×1080/390×844 캡처, 1024 추가 경계 검사. 모바일 겹침·가로 넘침 없음, Hero 이동·고정 수치 확인.
- Landing scrollHeight: 1440×1000 16,478→14,379px(−2,099px, −12.7%), 390×844 13,425→12,714px(−711px, −5.3%).
- 배포: 단일 커밋 `#16 S02 고정값·S03 겹침·Hero 동선` → main push → 기존 Pages 워크플로.

## 최종 IA 화면·iPhone 17 목업 반영

- 최종 화면 기준은 Hi-Fi의 `LOOP · IA Screen Flow`(2954:20125). 사이트에 사용한 앱 화면 11개를 이 섹션의 대응 화면으로 교체.
- 같은 섹션 `목업`(3029:55057)의 `iPhone 17` 인스턴스(2953:27047) 원본 이미지 사용. 기존 CSS 폰 외곽을 원본 목업으로 교체, 화면 비율·오프셋을 토큰화.
- 긴 화면은 비율을 유지하며 폰 내부 스크롤. Loop AI 예외 비율 제거, Focus·Loop 목업 비율 통일. Vite 해시 에셋으로 캐시 갱신.
- 1440×1000/1920×1080/390×844에서 Hero·여정 4단계·Focus 6단계 캡처, 이미지 11개 및 목업 로딩·가로 넘침 검사 완료. 빌드 통과.
- 원본 노드·해상도·추출 방식: `docs/final-screen-sources.md`. 무브바디만 Figma screenshot 1배수, 나머지 앱 화면 2배수. 연구·제작 아카이브의 역사적 장표는 유지.

## #17 · S07 처방사 대시보드 복구 · AIoT 기기 섹션 신설

- 순서: S06 Band → S06b AIoT(#aiot) → S07 처방사(#prescriber) → S08. Rest.jsx·rest.css 삭제.
- 카피: 인쇄도록 3490:33242(처방사)·3490:33243(AIoT 제목 「AIoT 디바이스」 3492:18132·설명). S07은 인쇄도록 iPad 목업(3456:38851) 대신 평면 화면 유지(교수님 피드백). 캡션·기능은 발표 PPT(jm83f0M7tlSafawIkAZ6b5) 「추출」 DH-01·02·07·09, IOT-01~04 장표 문장 그대로. 영어 eyebrow 없음.
- 모션: 진입 한 번(메인→보조 순차 / 제품 페이드→원형 화면 0.1초 간격). 핀·스크럽 없음, reduced-motion 끔.
- 원본·해상도: `docs/final-screen-sources.md`.

## #18 · 결과물 아카이브 공개 · 제작 과정 최신본 교체

- result 5섹션 44장(메인 플로우 9 · 모바일 앱 18 · 처방사 대시보드 12 · AIoT 디바이스 4 · 실물 전시 구성 1), make 5섹션 49장(브랜드·로고 3 · 파운데이션 13 · 컴포넌트 5 · IA 개편 4 · 와이어프레임 24). 추출 페이지 73장 중 간지 4장 제외. 옛 DS PDF 장표·dark·hifi 섹션 삭제.
- 출처 칩은 전 챕터 「발표 장표」. 섹션 summary는 서연 문구(실물 전시 구성만 빈 값).
- 공개 복구: GNB 「결과물」, S08 결과물 링크, S07·S06b 「전체 화면 보기」 → `#/archive/result?section={dashboard,aiot}`.
- 노드·제외 장표: `docs/archive-sources.md`.

## #19 · 한글 설명 패스 · 서비스 소개 문단

- S01b About(About.jsx, #about): Hero 다음·Problem 앞. 인쇄도록 작품 설명(3352:34063 · 3426:8786) 합니다체 제목·문단 2개 + 구성 요소 3줄(모바일 앱 #service · AIoT 디바이스 #aiot · 처방사 대시보드 #prescriber). 이미지·그라디언트 없음, 진입 페이드 한 번.
- 영어 장식 라벨 → 한글: Hero 「아래로 ↓」·밴드 카드 「수면 · 심박 연동」, eyebrow 문제 / loop가 이어주는 과정 / 직접 만져보기 / 무인 측정 화면 / 웨어러블 밴드 / 만든 과정 / 리서치로 바꾼 결정 / 브랜드 · 디자인 시스템, 결정 01~03, 아카이브 01 · 리서치 과정 등.
- Loop 정거장: 한글 크게 + 영어(MEASURE·MOVE·GROW·REPORT) 작은 보조 글자. 영어는 브랜드 요소라 유지.
- Band 칩 「Coming next」 삭제. Brand 「Violet」·Intelligence·Delight·Clarity는 그라디언트·색 이름이라 유지.
- 화면 코드(M-01·M-07 등)는 alt·aria·로딩 실패 자리표시에만 쓰여 그대로 둠.

## #20 · S02 설문 수치 · 핵심 화면

- S02: 인쇄도록 포스터(3492:18147) PROBLEM 그대로 — 헤드라인 「측정은 고도화됐지만, 변화로 이어지지는 않았습니다」, 44%(Q7) · 64%(Q9) · 60%(Q14). 출처 「설문조사 70명」 → research survey r037·r038·r039 딥링크. 32만 명 · 4.6% · 3일~1주 삭제.
- S04b Screens(Screens.jsx, #screens): Play 다음·Focus 앞. 포스터 SOLUTION 설명 + 평면 화면 6장(M-01 · M-05 · HR-01 · R-01 · C-13 · HR-04), 첫 화면(402:874)만 보이게 위쪽 크롭. 3열(1025~1300은 2열, 최소 360px) · 1024 이하 70vw 가로 스크롤. 전체 화면 보기 → result mobile.
- About 「모바일 앱」 → #screens.

## #21 · 점검 수정

- S04b 핵심 화면 삭제(Screens.jsx·css, m05·hr01·c13·hr04 에셋, --screens-* 토큰). About 「모바일 앱」 → #service 복구.
- S02 라벨: 「꾸준히 못 하는 이유 1위, 시간 부족」「전문가 대면 서비스가 필요하다는 응답」. 수치·출처 유지.
- Hero 서브카피 br-l 앞 공백(1024 이하 「풀고, 5분」).
- S07: 메인+보조 4장 버튼 → ArchiveLightbox(loop 순환 · ESC · 배경 클릭 · 포커스 복귀). 보조 첫 캡션 옆 「눌러서 크게 보기」. 라이트박스 CSS는 src/components/lightbox.css로 이동.
- S06b AIoT 원형 화면 1025 이상 3열 2줄, 지름 최대 --aiot-screen-max(360), 캡션 가운데.
- 서비스명 화면 표기 lOOP 통일(Hero eyebrow·버튼, Loop eyebrow, 결정 문구, Brand 제목, Outro 체험 문구). LOOP band·워드마크·title·meta·alt·aria·코드 식별자는 유지.
