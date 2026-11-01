import { useEffect, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Wordmark } from './Wordmark'
import Button from './Button'
import { PROTOTYPE_URL } from '../data/links'
import './gnb.css'

const NAV = [
  ['Service', '#service'], ['Process', '#/process'], ['Outcome', '#/archive/result'],
]

export default function Gnb() {
  const [solid, setSolid] = useState(false)
  const [lightBackground, setLightBackground] = useState(true)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  // 첫 페인트 전에 밝음/어두움을 정해 깜빡임 없게
  useLayoutEffect(() => {
    const onScroll = () => {
      const navHeight = document.querySelector('.gnb')?.offsetHeight || 76
      const line = navHeight / 2
      // 어두운 영역(Hero 영상 · 지평선 위쪽 · 파란 Outro) 위면 흰 글자
      const darkZone = [...document.querySelectorAll('[data-gnb-dark], .closing')].some(el => {
        const r = el.getBoundingClientRect()
        const share = parseFloat(el.dataset?.gnbDark) || 1
        return r.top <= line && r.top + r.height * share > line
      })
      setLightBackground(!darkZone)
      setSolid(window.scrollY > 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [pathname])
  // GNB는 항상 고정 (아카이브 목차 칩 sticky 위치 기준)
  useEffect(() => { document.documentElement.dataset.gnb = 'shown' }, [])
  return (
    <header className={`gnb ${solid ? 'is-solid' : ''} ${lightBackground ? 'on-light' : 'on-dark'}`}>
      <div className="gnb-in">
        <a href="#top" className="gnb-logo" aria-label="국민체력 loop 홈"><Wordmark height={30} /></a>
        <nav className={`gnb-nav ${open ? 'is-open' : ''}`} aria-label="주요 메뉴">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} aria-current={href === `#${pathname}` ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
        <div className="gnb-right">
          {PROTOTYPE_URL && <Button size="s" href={PROTOTYPE_URL} target="_blank" rel="noopener">프로토타입 체험</Button>}
          <button className="gnb-burger" aria-expanded={open} aria-label="메뉴" onClick={() => setOpen(v => !v)}>
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
