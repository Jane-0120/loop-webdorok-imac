import { useEffect, useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Gnb from './components/Gnb'
import Landing from './pages/Landing'
import Archive, { Process } from './pages/Archive'
import { startLenis } from './lib/scroll'
import useIdleReset from './lib/useIdleReset'

/**
 * HashRouter: #/archive/:chapter 만 라우트.
 * 그 밖의 해시(#top, #service 등 랜딩 앵커)는 전부 랜딩으로 → 랜딩이 해당 id로 스크롤
 */
export default function App() {
  useEffect(() => startLenis(), [])
  useIdleReset()

  // 랜딩은 Hero와 같은 검정 캔버스, 아카이브는 흰 캔버스 + 기존 violet 브라우저 색
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    const light = /^\/(process|archive)/.test(pathname)
    document.documentElement.classList.toggle('page-light', light)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#495AEE' : '#04030F')
  }, [pathname])

  return (
    <>
      <Gnb />
      <Routes>
        <Route path="/process" element={<Process />} />
        <Route path="/archive/:chapter" element={<Archive />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  )
}
