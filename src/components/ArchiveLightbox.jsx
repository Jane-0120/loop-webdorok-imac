import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { pauseScroll } from '../lib/scroll'
import './lightbox.css'

/** loop: 끝에서 처음으로 순환(S07 4장). noun·label은 aria 문구용 */
export default function ArchiveLightbox({ slides, index, onIndex, onClose, loop = false, noun = '장표', label = '아카이브 장표 크게 보기' }) {
  const dialog = useRef(null)
  const slide = slides[index]
  useLayoutEffect(() => {
    const el = dialog.current
    const opener = document.activeElement
    const overflow = document.documentElement.style.overflow
    const resume = pauseScroll()
    document.documentElement.style.overflow = 'hidden'
    // Safari 15.4 미만은 dialog API가 없음 — 여기서 에러가 나면 사이트 전체가 흰 화면이 됨
    if (el.showModal) el.showModal()
    else el.setAttribute('open', '')
    return () => {
      el.close?.()
      document.documentElement.style.overflow = overflow
      resume()
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true })
    }
  }, [])
  const n = slides.length
  const go = (step) => onIndex(loop ? (index + step + n) % n : Math.min(n - 1, Math.max(0, index + step)))
  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(1) }
  }
  return createPortal(
    <dialog ref={dialog} className="ar-lightbox" aria-label={label} data-lenis-prevent
      onCancel={(event) => { event.preventDefault(); onClose() }} onKeyDown={onKeyDown}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="ar-lightbox-toolbar">
        <p className="t14 medium" aria-live="polite">{slide.alt} · {index + 1} / {n}</p>
        <div className="ar-lightbox-actions">
          <button type="button" aria-label={`이전 ${noun}`} disabled={!loop && index === 0} onClick={() => go(-1)}>←</button>
          <button type="button" aria-label={`다음 ${noun}`} disabled={!loop && index === n - 1} onClick={() => go(1)}>→</button>
          <button type="button" onClick={onClose} autoFocus>닫기</button>
        </div>
      </div>
      <img key={slide.id} className="ar-lightbox-image" src={slide.src} alt={slide.alt} />
      <p className="ar-lightbox-hint t14 medium">← → 이동 · ESC 닫기 · 모바일에서는 두 손가락으로 확대</p>
    </dialog>, document.body)
}
