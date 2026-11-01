import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { scrollToTarget } from './scroll'

const IDLE_MS = 198_000 // 3분 18초 = 브랜드 필름(1분 6초) 3번 — 영상이 끝나는 시점에 맞춤
const EVENTS = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll']

/** 3분 18초 동안 조작이 없으면 홈 Hero(영상)로 돌아가고 영상을 처음부터 재생 (전시용).
 *  페이지를 실제로 다시 불러오면 소리 재생 허용이 풀려서, 화면만 처음 상태로 되돌림 */
export default function useIdleReset() {
  const navigate = useNavigate()
  useEffect(() => {
    let timer
    const reset = () => {
      navigate('/')
      requestAnimationFrame(() => {
        scrollToTarget(0, { immediate: true })
        window.dispatchEvent(new Event('loop:idle-reset'))
      })
    }
    const arm = () => { clearTimeout(timer); timer = setTimeout(reset, IDLE_MS) }
    EVENTS.forEach(e => window.addEventListener(e, arm, { passive: true }))
    arm()
    return () => { clearTimeout(timer); EVENTS.forEach(e => window.removeEventListener(e, arm)) }
  }, [navigate])
}
