import { useEffect, useRef, useState } from 'react'
import { CHAPTERS } from '../data/archive'
import { prefersReducedMotion } from '../lib/useScrollProgress'
import './archive-wheel.css'

// 리서치·기획·제작·결과물 목차를 한 줄로. 데이터는 docs/archive/manifest.json에서 오므로
// 아카이브 장표·대표 장표(cover)를 바꾸면 이 미리보기도 함께 바뀜
const PARTS = ['research', 'plan', 'make'] // 과정 페이지와 같은 세 파트만 (Outcome은 따로)
const HIDDEN = ['research/overview'] // 휠에서만 뺄 목차
const ITEMS = CHAPTERS
  .filter(ch => PARTS.includes(ch.id))
  .flatMap(ch => ch.sections.map(s => ({ key: `${ch.id}/${s.id}`, chapter: ch, section: s })))
  .filter(item => !HIDDEN.includes(item.key))
const N = ITEMS.length
const AUTO_MS = 2200
const VISIBLE = 9      // 가운데 기준 위아래로 보이는 개수
const PX_PER_ITEM = 90 // 휠(트랙패드) 스크롤 이만큼에 한 칸
const wrap = v => ((v % N) + N) % N
// i번 항목이 지금 위치에서 몇 칸 떨어졌는지(가장 가까운 방향, -N/2 ~ N/2) — 무한 루프

export default function ArchiveWheel() {
  const [pos, setPos] = useState(0)          // 연속 위치(스크롤 중엔 소수)
  const [scrolling, setScrolling] = useState(false)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const root = useRef(null)
  const wheel = useRef(null)
  const posRef = useRef(0)
  const active = wrap(Math.round(pos))

  useEffect(() => { posRef.current = pos }, [pos])
  useEffect(() => {
    const el = root.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  // 자동으로 한 칸씩 (끝 없이 이어짐)
  useEffect(() => {
    if (paused || scrolling || !visible || prefersReducedMotion()) return
    const id = setTimeout(() => setPos(p => Math.round(p) + 1), AUTO_MS)
    return () => clearTimeout(id)
  }, [pos, paused, scrolling, visible])
  // 목차 안에서는 스크롤로 목차를 굴림 (무한 루프)
  useEffect(() => {
    const el = wheel.current
    if (!el) return
    let snap = 0
    const onWheel = e => {
      const delta = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY
      const next = posRef.current + delta / PX_PER_ITEM
      e.preventDefault()
      e.stopPropagation()
      posRef.current = next
      setPos(next)
      setScrolling(true)
      clearTimeout(snap)
      snap = setTimeout(() => { setScrolling(false); setPos(Math.round(posRef.current)) }, 140)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => { el.removeEventListener('wheel', onWheel); clearTimeout(snap) }
  }, [])

  // 카드 색을 밝은 장표의 바탕색(왼쪽 위 모서리)에 맞춰 한 면처럼. 어두운 장표면 흰 카드 유지
  const matchCardColor = e => {
    const card = root.current
    if (!card) return
    try {
      const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
      ctx.canvas.width = ctx.canvas.height = 1
      ctx.drawImage(e.currentTarget, 2, 2, 1, 1, 0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
      const light = (r * .299 + g * .587 + b * .114) / 255 > .92
      if (light) card.style.setProperty('--aw-bg', `rgb(${r} ${g} ${b})`)
      else card.style.removeProperty('--aw-bg')
    } catch { card.style.removeProperty('--aw-bg') }
  }

  const current = ITEMS[active]
  return (
    <div className="aw" ref={root} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className={scrolling ? 'aw-wheel is-scrolling' : 'aw-wheel'} ref={wheel} data-lenis-prevent>
        <span className="aw-pin" aria-hidden="true" />
        <ol className="aw-list" aria-label="아카이브 목차">
          {ITEMS.map((item, i) => {
            let d = wrap(i - pos)
            if (d > N / 2) d -= N
            const near = Math.abs(d) <= VISIBLE
            return (
              <li key={item.key} style={{ '--d': d }} data-active={i === active || undefined} aria-hidden={!near || undefined}>
                <button type="button" tabIndex={near ? 0 : -1} aria-current={i === active || undefined} onClick={() => setPos(p => { let d = wrap(i - p); if (d > N / 2) d -= N; return Math.round(p + d) })}>
                  {item.section.en}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
      <div className="aw-slide">
        {/* key로 바뀔 때마다 새로 페이드 인. 장표 실제 비율대로(블루프린트처럼 긴 장표도) 카드 위에 바로 놓임 */}
        <img key={current.key} onLoad={matchCardColor} src={current.section.cover.src} srcSet={current.section.cover.srcSet} sizes="(max-width: 1024px) 92vw, 55vw" alt={`${current.chapter.title} · ${current.section.title} 대표 장표`} />
      </div>
    </div>
  )
}
