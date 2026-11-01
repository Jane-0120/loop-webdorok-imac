import { useLayoutEffect } from 'react'
import { introDone } from '../sections/Intro'
import { scrollToTarget } from '../lib/scroll'
import IMAGES from '../data/outcome.json'
import TryCards from '../components/TryCards'
import './outcome.css'

const BASE = import.meta.env.BASE_URL

/** #/archive/result — 결과물: 긴 이미지 37장(2배 원본 → 960/1920/3840 WebP)을 순서대로, 사이트 좌우 여백에 맞춰 이어 붙임 (public/outcome/01~37) */
export default function Outcome() {
  useLayoutEffect(() => {
    introDone()
    document.title = '결과물 · lOOP'
    scrollToTarget(0, { immediate: true })
  }, [])
  return (
    <main className="oc">
      <div className="oc-stack">
        {IMAGES.map(([n, w, h], i) => (
          <img
            key={n} src={`${BASE}outcome/${n}.webp`} srcSet={`${BASE}outcome/${n}@960.webp 960w, ${BASE}outcome/${n}.webp 1920w, ${BASE}outcome/${n}@2x.webp 3840w`}
            sizes="(max-width: 1024px) calc(100vw - 48px), min(88vw, 1792px)" width={w} height={h} alt={`lOOP 결과물 ${i + 1}`}
            loading={i < 2 ? 'eager' : 'lazy'} decoding="async"
          />
        ))}
      </div>
      <section className="oc-try" aria-label="직접 체험해 보기"><TryCards /></section>
    </main>
  )
}
