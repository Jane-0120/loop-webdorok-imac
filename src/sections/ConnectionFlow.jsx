import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { img } from '../data/screens'
import { prefersReducedMotion } from '../lib/useScrollProgress'
import './loop-cards.css'

const STEPS = [
  { title: '처방사 대시보드', text: 'AI 처방을 검토하고 센터 운영을 관리해요', src: img('loop/center.jpg'), alt: '태블릿으로 보는 처방사 대시보드', to: '/archive/result?section=dashboard', id: 'prescriber' },
  { title: '앱으로 매일 운동', text: '나에게 맞춘 운동 플랜을 실천해요', src: img('loop/app.jpg'), alt: '주간 운동 현황과 AR 코칭 앱 화면', to: '/archive/result?section=mobile', id: 'app' },
  { title: '집에서 AIoT 코칭', text: '자세 인식과 음성으로 운동을 안내해요', src: img('loop/aiot.jpg'), alt: '가정용 AIoT 코칭 기기', to: '/archive/result?section=aiot', id: 'aiot' },
  { title: '스테이션에서 재측정', text: '간편 예약으로 변화를 확인해요', src: img('loop/station.jpg'), alt: '근처 측정 스테이션 예약 앱 화면과 LOOP 밴드', to: '/archive/result?section=mobile', id: 'report' },
]
const AUTO_MS = 3800

export default function ConnectionFlow() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const stage = useRef(null)

  // 화면에 보일 때만 자동으로 넘김
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .35 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (paused || !visible || prefersReducedMotion()) return
    const id = setTimeout(() => setActive(i => (i + 1) % STEPS.length), AUTO_MS)
    return () => clearTimeout(id)
  }, [active, paused, visible])

  return (
    <section className="chapter care-flow" id="service" data-snap><span className="section-anchor" id="ecosystem" />
      <div className="care-layout">
      <header className="care-heading"><p className="kicker">ONE CONNECTED LOOP</p><h2>센터의 측정이,<br />집에서의 실천으로</h2><p>앱과 처방사 대시보드, AIoT 기기, 측정 스테이션이<br />측정 이후 12주를 함께 이어가요</p></header>
      <div
        className="loop-cards" ref={stage} style={{ '--loop-auto': `${AUTO_MS}ms` }} aria-roledescription="carousel" aria-label="하나로 이어지는 lOOP 서비스"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      >
        <div className="loop-cards-stage">
          {STEPS.map((step, i) => {
            // 활성 카드 기준 위치: 0 가운데, -1 왼쪽, 1 오른쪽, 2 뒤로 숨김
            let pos = (i - active + STEPS.length) % STEPS.length
            if (pos === STEPS.length - 1) pos = -1
            const isActive = pos === 0
            return (
              <Link
                key={step.id} id={step.id} to={step.to} className="loop-card" data-pos={pos}
                aria-roledescription="slide" aria-label={step.title} aria-hidden={Math.abs(pos) > 1 || undefined}
                tabIndex={isActive ? 0 : -1}
                onClick={e => { if (!isActive) { e.preventDefault(); setActive(i) } }}
              >
                <img src={step.src} alt={step.alt} loading="lazy" draggable="false" />
                <div className="loop-card-copy">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                <span className="loop-card-go" aria-hidden="true">↗</span>
              </Link>
            )
          })}
        </div>
        <div className="loop-cards-dots" role="tablist" aria-label="카드 선택">
          {STEPS.map((step, i) => (
            <button key={step.id} type="button" role="tab" aria-selected={i === active} aria-label={step.title} onClick={() => setActive(i)}>
              {i === active && !paused && visible && <i key={active} />}
            </button>
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}
