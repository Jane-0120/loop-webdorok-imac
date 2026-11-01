import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { screen, img } from '../data/screens'
import ArchiveLightbox from '../components/ArchiveLightbox'

const PARTS = [
  { name: '처방사 대시보드', title: 'AI가 제안하고, 전문가가 확정합니다.', body: '측정 결과와 AI 초안을 함께 보고, 처방사가 운동 강도와 구성을 조정합니다.', src: screen('dash-home'), to: '/archive/result?section=dashboard', details: ['측정 결과와 회원 정보', 'AI 처방 검토 · 확정', '실천을 이어주는 상담'] },
  { name: 'AIoT 디바이스', title: '센터의 코칭을, 집에서도.', body: '처방사의 코칭 정보를 집으로 연결합니다. 자세와 동작을 확인하고, 음성으로 운동을 안내합니다.', src: img('aiot-front.webp'), to: '/archive/result?section=aiot', details: ['코칭 노트 동기화', '실시간 자세 코칭', '음성으로 동작 안내'] },
]
export default function Ecosystem() {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const active = pathname === '/aiot' ? 1 : pathname === '/prescriber' ? 0 : selected
  const item = PARTS[active]
  const choose = i => { setSelected(i); if (pathname === '/aiot' || pathname === '/prescriber') navigate('/ecosystem', { replace: true }) }
  return (
    <section className="chapter ecosystem" id="ecosystem">
      <span id="aiot" className="section-anchor" /><span id="prescriber" className="section-anchor" />
      <header className="chapter-heading"><p className="kicker">CONNECTED CARE</p><h2>센터에서 집까지.<br />코칭은 이어집니다.</h2><p>앱으로 시작한 실천을<br />전문가와 가정용 기기가 함께 돕습니다.</p></header>
      <div className="ecosystem-controls" aria-label="서비스 구성 선택">{PARTS.map((part, i) => <button type="button" key={part.name} aria-pressed={active === i} onClick={() => choose(i)}>{part.name}<span aria-hidden="true">↗</span></button>)}</div>
      <div className="ecosystem-stage" data-kind={active}>
        <button type="button" className="ecosystem-image" aria-label={`${item.name} 크게 보기`} onClick={() => setLightbox(active)}><img src={item.src} alt={item.name} loading="lazy" /></button>
        <div className="ecosystem-description"><p className="kicker">{item.name}</p><h3>{item.title}</h3><p>{item.body}</p><ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul><Link className="text-action" to={item.to}>전체 화면 보기 ↗</Link></div>
      </div>
      {lightbox !== null && <ArchiveLightbox slides={PARTS.map((part, i) => ({ id: String(i), src: part.src, alt: part.name }))} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} noun="화면" />}
    </section>
  )
}
