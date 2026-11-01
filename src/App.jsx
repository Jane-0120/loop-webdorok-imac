import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Gnb from './components/Gnb'
import Landing from './pages/Landing'
import Archive, { Process } from './pages/Archive'
import { startLenis } from './lib/scroll'

/**
 * HashRouter: #/archive/:chapter 만 라우트.
 * 그 밖의 해시(#top, #service 등 랜딩 앵커)는 전부 랜딩으로 → 랜딩이 해당 id로 스크롤
 */
export default function App() {
  useEffect(() => startLenis(), [])

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
