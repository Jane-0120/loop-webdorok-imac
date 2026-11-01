import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { getChapter } from '../data/archive'
import { introDone } from '../sections/Intro'
import { scrollToTarget } from '../lib/scroll'
import { prefersReducedMotion } from '../lib/useScrollProgress'
import ArchiveLightbox from '../components/ArchiveLightbox'
import { useReveal } from '../lib/useLandingMotion'
import Outcome from './Outcome'
import './archive.css'

// 리서치·기획·제작은 한 페이지(#/process)에 묶고, 결과물만 따로
const PROCESS_PARTS = ['research', 'plan', 'make']
const PART_LABEL = { research: 'Research', plan: 'Planning', make: 'Design' }

/** #/archive/:chapter — 결과물. 예전 리서치·기획·제작 주소는 #/process로 넘김 */
export default function Archive() {
  const { chapter } = useParams()
  const { search } = useLocation()
  if (PROCESS_PARTS.includes(chapter)) {
    const params = new URLSearchParams(search)
    if (!params.get('section') && !params.get('slide')) params.set('part', chapter)
    return <Navigate to={`/process?${params}`} replace />
  }
  if (chapter === 'result') return <Outcome />
  const ch = getChapter(chapter)
  if (!ch) return <Navigate to="/process" replace />
  return (
    <ChapterPage
      key={ch.id} parts={[ch]} title={ch.title} eyebrow={ch.eyebrow} summary={ch.summary} docTitle={ch.title}
      next={{ to: '/process', label: '만든 과정', hint: '처음부터 보기' }}
    />
  )
}

/** #/process — 리서치·기획·제작 세 파트를 한 페이지에 */
// 과정 페이지에서 빼는 섹션 (섹션 제목·설명은 과정 페이지에서 모두 숨기고 여백으로만 구분)
const PROCESS_SKIP = ['timeline']
export function Process() {
  const parts = PROCESS_PARTS.map(getChapter).map(ch => ({
    ...ch,
    sections: ch.sections.filter(s => !PROCESS_SKIP.includes(s.id)),
  }))
  return (
    <ChapterPage
      key="process" parts={parts} grouped docTitle="만든 과정"
      eyebrow="PROCESS · 2026.03 – 2026.10" title="리서치에서 시작해, 서비스로 이어지기까지"
      summary="8개월간의 조사와 기획, 디자인을 거쳐 측정 이후의 공백을 일상의 실천으로 잇는 lOOP를 구체화했어요."
      next={{ to: '/archive/result', label: 'Outcome', hint: '다음' }}
    />
  )
}

const isNarrow = () => window.matchMedia('(max-width: 1024px)').matches

function ChapterPage({ parts, grouped = false, title, eyebrow, summary, docTitle, next }) {
  const { search } = useLocation()
  const [lightbox, setLightbox] = useState(null)
  const sections = parts.flatMap(ch => ch.sections.map(s => ({ ...s, part: ch.id })))
  const count = sections.reduce((n, s) => n + s.slides.length, 0)
  const slides = sections.flatMap(s => s.slides.map((slide, i) => ({ ...slide, alt: `${s.title} ${i + 1}` })))
  const [active, setActive] = useState(sections[0]?.id)
  const activePart = sections.find(s => s.id === active)?.part
  const secRefs = useRef({})
  const partRefs = useRef({})
  const tocRef = useRef(null)
  const headRef = useRef(null)
  useReveal(headRef, '.ar-head > *', [docTitle])
  const activeIndex = Math.max(0, sections.findIndex(s => s.id === active))
  const progress = sections.length > 1 ? activeIndex / (sections.length - 1) : 0
  const chipsRef = useRef(null)

  useLayoutEffect(() => {
    // 아카이브로 바로 들어왔으면 랜딩 인트로는 생략
    introDone()
    document.title = `${docTitle} · lOOP`
    scrollToTarget(0, { immediate: true })
  }, [docTitle])

  // 근거 링크는 HashRouter 안의 검색 파라미터로 섹션/장표를 지정합니다.
  useEffect(() => {
    const params = new URLSearchParams(search)
    const slide = params.get('slide')
    const section = params.get('section')
    const part = params.get('part')
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const target = (slide && document.getElementById(`slide-${slide}`)) || secRefs.current[section] || (part && partRefs.current[part])
        if (target) scrollToTarget(target, { offset: (isNarrow() ? chipsRef.current?.offsetHeight ?? 0 : 0) + 120, immediate: true })
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [search, docTitle])

  // 스크롤 위치 하이라이트: 화면 30% 선을 넘은 마지막 섹션
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.3
      let cur = sections[0]?.id
      for (const s of sections) {
        const el = secRefs.current[s.id]
        if (el && el.getBoundingClientRect().top <= line) cur = s.id
      }
      setActive(cur)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [docTitle]) // eslint-disable-line react-hooks/exhaustive-deps

  // 세로 목차: 파트가 바뀌면 그 파트 묶음을 목차 맨 위로, 같은 파트 안에서는 활성 항목이 보이게
  const lastPart = useRef(null)
  useEffect(() => {
    const box = tocRef.current
    if (!box || !grouped) return
    const group = box.querySelector(`[data-part="${activePart}"]`)
    const item = box.querySelector('button.is-active')
    if (!group) return
    const smooth = { behavior: prefersReducedMotion() ? 'auto' : 'smooth' }
    if (lastPart.current !== activePart) {
      lastPart.current = activePart
      box.scrollTo({ top: group.offsetTop, ...smooth })
      return
    }
    if (!item) return
    const head = group.querySelector('.ar-toc-part')?.offsetHeight ?? 0
    const top = item.offsetTop - box.scrollTop
    if (top < head) box.scrollTo({ top: item.offsetTop - head, ...smooth })
    else if (top + item.offsetHeight > box.clientHeight - 24) box.scrollTo({ top: item.offsetTop + item.offsetHeight - box.clientHeight + 48, ...smooth })
  }, [active, activePart, grouped])

  // 가로 칩: 활성 칩을 바 안에서 가운데로
  useEffect(() => {
    const bar = chipsRef.current
    const chip = bar?.querySelector(`[data-id="${active}"]`)
    if (!bar || !chip || bar.scrollWidth <= bar.clientWidth) return
    bar.scrollTo({ left: chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' })
  }, [active])

  const goTo = (id, el = secRefs.current[id]) => {
    if (!el) return
    // 위로 가면 GNB가 다시 내려오니 그만큼 더 띄움
    const up = el.getBoundingClientRect().top < 0
    const gnb = up ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gnb-h')) || 0 : 0
    const chips = isNarrow() ? chipsRef.current?.offsetHeight ?? 0 : 0
    scrollToTarget(el, { offset: gnb + chips + 24 })
  }

  const renderSection = (s, si) => (
    <section key={s.id} className="ar-sec" ref={(el) => { secRefs.current[s.id] = el }} aria-label={s.title}>
      {!grouped && <header className="ar-section-head"><h2 className="t24 semibold">{s.title}</h2>{s.summary && <p className="t18 medium">{s.summary}</p>}</header>}
      {s.slides.length
        ? s.slides.map((sl, i) => <Slide key={sl.id} slide={sl} eager={si === 0 && i === 0} alt={`${s.title} ${i + 1}`} onOpen={() => setLightbox(slides.findIndex(item => item.id === sl.id))} />)
        : <div className="ar-soon t16 medium">{s.title}</div>}
    </section>
  )
  let order = 0
  return (
    <main className={grouped ? 'ar ar-process' : 'ar'}>
      <header className="ar-head inner" ref={headRef}>
        <p className="ar-eyebrow t16 semibold">{eyebrow}</p>
        <h1 className="t56 semibold">{title}</h1>
        <p className="ar-summary t20 medium">{summary}</p>
      </header>

      {grouped && (
        <nav className="ar-parts ar-parts-mobile" aria-label="과정 파트">
          {parts.map((ch) => (
            <button key={ch.id} type="button" className={activePart === ch.id ? 'is-active' : ''} aria-current={activePart === ch.id || undefined} onClick={() => goTo(ch.id, partRefs.current[ch.id])}>
              {PART_LABEL[ch.id]}
            </button>
          ))}
        </nav>
      )}

      {count === 0 ? (
        <div className="inner">
          <div className="ar-empty">
            <p className="t24 semibold">Hi-Fi 확정 후 공개</p>
            <p className="t16 medium muted">{sections.map((s) => s.title).join(' · ')}</p>
          </div>
        </div>
      ) : (
        <>
          <nav className="ar-chips" ref={chipsRef} aria-label="섹션 목차">
            {/* 모바일: 과정 페이지는 지금 파트의 섹션만 보여줌 */}
            {sections.filter(s => !grouped || s.part === activePart).map((s) => (
              <button key={s.id} data-id={s.id} className={`chip ${active === s.id ? 'is-dark' : ''}`} aria-current={active === s.id || undefined} onClick={() => goTo(s.id)}>
                {s.title}{!grouped && <span className="ar-n">{s.slides.length || '—'}</span>}
              </button>
            ))}
          </nav>

          <div className="ar-body inner">
            <aside className={grouped ? 'ar-toc ar-toc-process' : 'ar-toc'} aria-label="섹션 목차">
              {grouped && (
                <div className="ar-switch">
                  {/* 지금 어느 파트를 보고 있는지 + 전체 진행 */}
                  <div className="ar-switch-tabs" role="tablist" aria-label="과정 파트">
                    {parts.map((ch) => (
                      <button key={ch.id} type="button" role="tab" aria-selected={activePart === ch.id} onClick={() => goTo(ch.id, partRefs.current[ch.id])}>
                        {PART_LABEL[ch.id]}
                      </button>
                    ))}
                  </div>
                  <div className="ar-progress" aria-hidden="true"><i style={{ '--p': progress }} /></div>
                </div>
              )}
              <div className="ar-toc-scroll" ref={tocRef} data-lenis-prevent>
              {parts.map((ch) => (
                <div key={ch.id} className="ar-toc-group" data-part={ch.id} data-active={grouped && activePart === ch.id ? '' : undefined}>
                  {grouped && (
                    <button type="button" className="ar-toc-part" onClick={() => goTo(ch.id, partRefs.current[ch.id])}>
                      <b>{PART_LABEL[ch.id]}</b>
                    </button>
                  )}
                  <ol>
                    {ch.sections.map((s, i) => (
                      <li key={s.id}>
                        <button className={active === s.id ? 'is-active' : ''} aria-current={active === s.id || undefined} onClick={() => goTo(s.id)}>
                          <span className="ar-i t14 medium">{String(i + 1).padStart(2, '0')}</span>
                          <span className="ar-t t16 medium">{s.title}</span>
                          {!grouped && <span className="ar-n t14 medium">{s.slides.length ? `${s.slides.length}장` : '예정'}</span>}
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
              </div>
            </aside>

            <div className="ar-parts-stack">
              {parts.map((ch) => (
                <div key={ch.id} className="ar-part" ref={(el) => { partRefs.current[ch.id] = el }}>
                  {grouped && (
                    // 간지: 파트가 바뀌는 자리. 요약은 문장마다 줄바꿈
                    <header className="ar-part-head">
                      <h2 className="t36 semibold">{PART_LABEL[ch.id]}</h2>
                      <p className="t18 medium">{ch.summary.split(/(?<=\.)\s+/).map((line, i) => <span key={i}>{line}</span>)}</p>
                    </header>
                  )}
                  <div className="ar-stack">{ch.sections.map((s) => renderSection(s, order++))}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="inner">
        <Link className="ar-next" to={next.to}>
          <span className="t16 medium muted">{next.hint}</span>
          <span className="ar-next-t t48 semibold">{next.label} <span aria-hidden="true">→</span></span>
        </Link>
      </div>

      <TopButton />
      {lightbox !== null && <ArchiveLightbox slides={slides} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />}
    </main>
  )
}

/** 장표 한 장: 16:9 자리를 먼저 잡고, 이미지가 없으면(아직 export 전) 플레이스홀더 */
function Slide({ slide, eager, alt, onOpen }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className="ar-ph t14 medium" role="img" aria-label={alt}>{slide.id}</div>
  return (
    <button type="button" className="ar-slide-button" id={`slide-${slide.id}`} onClick={onOpen} aria-label={`${alt} 크게 보기`}>
    <img
      className="ar-img" src={slide.src} srcSet={slide.srcSet}
      sizes="(max-width: 1024px) 100vw, 75vw" width="1920" height="1080" alt={alt}
      loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async"
      onError={() => setFailed(true)}
    />
    </button>
  )
}

function TopButton() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button className={`ar-top ${show ? 'is-on' : ''}`} aria-label="맨 위로" tabIndex={show ? 0 : -1} onClick={() => scrollToTarget(0)}>
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 16V4M4.5 9.5 10 4l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  )
}
