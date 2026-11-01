import { useEffect } from 'react'
import { prefersReducedMotion } from './useScrollProgress'

// 스크롤해서 화면에 들어오면 아래에서 위로 부드럽게 떠오름. 같은 묶음 안에서는 한 줄씩 차례로
const LANDING_TEXT = [
  '.research-copy > *', '.research-cta',
  '#design-system .chapter-heading > *', '.ds-source-link',
  '.care-heading > *', '.loop-cards',
  '.closing h2',
].join(', ')

export function useReveal(ref, selector, deps = []) {
  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return
    const targets = [...root.querySelectorAll(selector)]
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('motion-entered')
        observer.unobserve(entry.target)
      }
    }, { threshold: .15, rootMargin: '0px 0px -8% 0px' })
    targets.forEach(el => {
      // 같은 부모 안 순서대로 90ms씩 늦게
      const order = [...el.parentElement.children].filter(c => targets.includes(c)).indexOf(el)
      el.classList.add('motion-reveal')
      el.style.setProperty('--reveal-delay', `${Math.max(0, order) * 90}ms`)
      observer.observe(el)
    })
    return () => { observer.disconnect(); targets.forEach(el => { el.classList.remove('motion-reveal', 'motion-entered'); el.style.removeProperty('--reveal-delay') }) }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

export default function useLandingMotion(ref) {
  useReveal(ref, LANDING_TEXT, [ref])
}
