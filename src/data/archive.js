import manifest from '../../docs/archive/manifest.json'

/**
 * 아카이브 챕터 = docs/archive/manifest.json + 헤더 카피.
 * make·result 장표는 발표 장표 파일 export — 원본 노드는 docs/archive-sources.md
 */
const COPY = {
  research: { eyebrow: '아카이브 01 · 리서치 과정', summary: '체력 측정을 마친 뒤 사람들에게 어떤 일이 일어나는지 따라가 봤습니다. 데스크 리서치로 시작해 인터뷰와 넷노그라피를 거쳐 퍼소나까지 정리했습니다.', source: '발표 장표' },
  plan: { eyebrow: '아카이브 02 · 기획 과정', summary: '리서치에서 찾은 문제 가운데 가장 중요한 하나를 고르고, 아이디어를 MVP와 서비스 블루프린트로 구체화했습니다.', source: '발표 장표' },
  make: { eyebrow: '아카이브 03 · 제작 과정', summary: '브랜드와 디자인 시스템을 먼저 세우고, IA와 와이어프레임을 거쳐 실제 화면을 만들어 갔습니다.', source: '발표 장표' },
  result: { eyebrow: 'OUTCOME', summary: '모바일 앱, 처방사 대시보드, AIoT 디바이스의 최종 화면을 한곳에 모았습니다.', source: '발표 장표' },
}

/** 목차 영어 이름 — 랜딩 THE DECISIONS 목차 휠에서 사용. 섹션을 추가하면 여기에도 한 줄 추가 */
const EN = {
  research: {
    overview: 'Overview', desk: 'Desk Research', video: 'Video Research', 'safari-9988': 'Service Safari',
    survey: 'Survey', 'safari-web': 'Online Safari', interview: 'Interviews', netnography: 'Netnography',
    affinity: 'Affinity Map', expert: 'Expert Interviews', competitive: 'Competitors', persona: 'Persona',
  },
  plan: { problem: 'Problem', ideation: 'Ideation', features: 'Features', blueprint: 'Blueprint', fsd: 'Specs', timeline: 'Timeline' },
  make: {
    brand: 'Brand', foundation: 'Foundation', components: 'Components', ia: 'IA', wireframe: 'Wireframes',
    flow: 'Main Flow', dashboard: 'Dashboard', aiot: 'AIoT Device', usability: 'Usability Test',
  },
  result: { flow: 'Main Flow', mobile: 'Mobile App', dashboard: 'Dashboard', aiot: 'AIoT Device', exhibition: 'Exhibition' },
}
const CHAPTER_EN = { research: 'Research', plan: 'Planning', make: 'Design', result: 'Outcome' }

const BASE = import.meta.env.BASE_URL

/** 'research/r001.jpg' → { id, src, srcSet } */
const toSlide = (path) => {
  const stem = `${BASE}archive/${path.replace(/\.jpg$/, '')}`
  return { id: path.split('/').pop().replace(/\.jpg$/, ''), src: `${stem}.webp`, srcSet: `${stem}@960.webp 960w, ${stem}.webp 1920w` }
}

export const CHAPTERS = manifest.chapters.map((c) => {
  // cover: manifest에 대표 장표를 지정하면 그 장, 없으면 섹션 첫 장 — 장표를 바꾸면 랜딩 목차 휠 미리보기도 함께 바뀜
  const sections = c.sections.map((s) => {
    const slides = s.slides.map(toSlide)
    return { ...s, en: EN[c.id]?.[s.id] ?? s.title, slides, cover: slides.find((x) => x.id === s.cover?.replace(/\.jpg$/, '').split('/').pop()) ?? slides[0] }
  })
  return {
    ...c,
    ...COPY[c.id],
    en: CHAPTER_EN[c.id],
    sections,
    count: sections.reduce((n, s) => n + s.slides.length, 0),
  }
})

export const getChapter = (id) => CHAPTERS.find((c) => c.id === id)
export const nextChapter = (id) => CHAPTERS[(CHAPTERS.findIndex((c) => c.id === id) + 1) % CHAPTERS.length]
