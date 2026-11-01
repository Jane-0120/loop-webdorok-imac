import { useEffect } from 'react'
import { scrollToTarget } from './scroll'

/** 섹션 경계 근처에서 멈추면 가까운 지점으로 맞춤. 지점은 [data-snap] 요소 (top: 화면 맨 위, end: 페이지 끝) */
export default function useSectionSnap(root) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer
    let intent = false
    let snapping = false
    const onInput = event => {
      if (event.target.closest?.('.phone, input, textarea, [data-lenis-prevent]')) {
        intent = false
        clearTimeout(timer)
        return
      }
      intent = true
    }
    const settle = () => {
      if (!intent || snapping || !root.current) return
      intent = false
      const header = document.querySelector('.gnb')?.offsetHeight || 0
      const viewport = window.innerHeight - header
      // 스냅 지점은 data-snap이 붙은 요소만: Hero 영상 · PROCESS · DESIGN SYSTEM · ONE CONNECTED LOOP · 맨 아래(푸터)
      // Hero 아래 그라디언트 구간은 지점이 없어서 자유롭게 스크롤됨
      const points = [...root.current.querySelectorAll('[data-snap]')].flatMap(el => {
        const rect = el.getBoundingClientRect()
        if (el.dataset.snap === 'end') return [Math.max(0, document.documentElement.scrollHeight - window.innerHeight)]
        // data-snap-gap: 멈췄을 때 GNB 아래로 남길 여백(px)
        const gap = Number(el.dataset.snapGap) || 0
        const start = Math.max(0, rect.top + window.scrollY - (el.dataset.snap === 'top' ? 0 : header) - gap)
        // 화면보다 긴 섹션은 위·아래 끝 어느 쪽에도 멈출 수 있게
        return rect.height > viewport + 100
          ? [start, Math.max(start, rect.bottom + window.scrollY - window.innerHeight)]
          : [start]
      })
      const nearest = points.reduce((best, point) => Math.abs(point - window.scrollY) < Math.abs(best - window.scrollY) ? point : best, Infinity)
      const distance = Math.abs(nearest - window.scrollY)
      if (distance < 8 || distance > (window.innerWidth >= 1200 ? Math.min(380, window.innerHeight * .36) : Math.min(240, window.innerHeight * .28))) return
      snapping = true
      scrollToTarget(nearest)
      timer = setTimeout(() => { snapping = false }, 900)
    }
    const onScroll = () => {
      if (snapping || !intent) return
      clearTimeout(timer)
      timer = setTimeout(settle, 140)
    }
    window.addEventListener('wheel', onInput, { passive: true })
    window.addEventListener('touchstart', onInput, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('wheel', onInput)
      window.removeEventListener('touchstart', onInput)
      window.removeEventListener('scroll', onScroll)
    }
  }, [root])
}
