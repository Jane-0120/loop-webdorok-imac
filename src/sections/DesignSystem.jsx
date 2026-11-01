import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './design-system-film.css'

const FILM = `${import.meta.env.BASE_URL}video/loop-brand-identity.mp4`

export default function DesignSystem() {
  const video = useRef(null)
  // 화면 밖이면 멈추고, 다시 보이면 이어서 재생
  useEffect(() => {
    const el = video.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {})
      else el.pause()
    }, { threshold: .2 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return <section className="chapter design-system" id="design-system" data-snap>
    {/* ONE CONNECTED LOOP와 같은 레이아웃: 왼쪽 글 · 오른쪽 영상 */}
    <div className="ds-layout">
      <div className="ds-copy">
        <header className="chapter-heading"><p className="kicker">DESIGN SYSTEM</p><h2>건강의 순환을 담은 <br />디자인 시스템</h2><p>측정에서 실천으로 이어지는 건강의 흐름을 <br />하나의 시각 언어로 연결했어요.</p></header>
        <Link className="text-action ds-source-link" to="/process?part=make">브랜드와 디자인 시스템 ↗</Link>
      </div>
      <div className="ds-film">
        <video ref={video} src={FILM} muted loop playsInline preload="metadata" aria-label="lOOP 브랜드 아이덴티티 영상" />
      </div>
    </div>
  </section>
}
