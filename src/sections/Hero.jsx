import { useEffect, useRef, useState } from 'react'
import { scrollToTarget } from '../lib/scroll'
import './hero-scene.css'

const FILM = `${import.meta.env.BASE_URL}video/loop-brand-film.mp4`
// 배경 글로우: 영상 프레임을 아주 작게 그려 CSS blur로 퍼뜨림. 이전 프레임과 섞어 색이 천천히 바뀌게
const AMBIENT_W = 32
const AMBIENT_H = 18
const AMBIENT_EVERY = 120 // ms
const AMBIENT_MIX = .18

export default function Hero() {
  const video = useRef(null)
  const ambient = useRef(null)
  const horizon = useRef(null)
  const question = useRef(null)
  const [muted, setMuted] = useState(true)

  // 화면 밖이면 멈추고, 다시 보이면 이어서 재생
  useEffect(() => {
    const el = video.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {})
      else el.pause()
    }, { threshold: .15 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // 영상 색을 따라가는 배경
  useEffect(() => {
    const el = video.current
    const ctx = ambient.current?.getContext('2d')
    if (!el || !ctx) return
    let first = true
    const id = setInterval(() => {
      if (el.paused || el.readyState < 2) return
      ctx.globalAlpha = first ? 1 : AMBIENT_MIX
      ctx.drawImage(el, 0, 0, AMBIENT_W, AMBIENT_H)
      first = false
    }, AMBIENT_EVERY)
    return () => clearInterval(id)
  }, [])

  // 지평선 전환: 내려갈수록 흰 빛이 위로 차오름 (0 → 1)
  useEffect(() => {
    const el = horizon.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (r.height + window.innerHeight * .2)))
      el.style.setProperty('--horizon', p.toFixed(3))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    const bubble = question.current
    if (!bubble || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    bubble.classList.add('is-waiting')
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      bubble.classList.remove('is-waiting')
      bubble.classList.add('is-popped')
      observer.disconnect()
    }, { threshold: .7 })
    observer.observe(bubble)
    return () => {
      observer.disconnect()
      bubble.classList.remove('is-waiting', 'is-popped')
    }
  }, [])

  const toggleSound = () => {
    const el = video.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
    if (!el.muted) el.play().catch(() => {})
  }

  return (
    <section className="hero-scene hero-film" id="top">
      <div className="hero-film-stage" data-gnb-dark data-snap="top">
        <canvas className="hero-film-ambient" ref={ambient} width={AMBIENT_W} height={AMBIENT_H} aria-hidden="true" />
        <div className="hero-film-frame">
          <video
            ref={video}
            className="hero-film-video"
            src={FILM}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="lOOP 브랜드 필름"
          />
          <button type="button" className="hero-film-sound" onClick={toggleSound} aria-pressed={!muted} aria-label={muted ? '소리 켜기' : '소리 끄기'}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
              {muted
                ? <path d="m16 9 5 6m0-6-5 6" />
                : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
            </svg>
          </button>
        </div>
        <button type="button" className="hero-scroll-cue" onClick={() => { const next = question.current; if (next) scrollToTarget(next, { offset: window.innerHeight * .4 }) }}>
          <span>Scroll down</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14m-6-6 6 6 6-6" /></svg>
        </button>
      </div>
      <div className="hero-horizon" ref={horizon} data-gnb-dark="0.45">
        <div className="hero-horizon-glow" aria-hidden="true" />
        <div className="hero-bridge">
          <h2 className="hero-bridge-question" ref={question}><span className="hero-question-badge" aria-hidden="true">Q</span>국민체력100에서 체력 측정은 완료했는데, 오늘은 무엇부터 시작해야 할까요?</h2>
        </div>
      </div>
    </section>
  )
}
