import { useState } from 'react'

export default function Play() {
  const [minutes, setMinutes] = useState(320)
  const [choice, setChoice] = useState(null)
  const hours = Math.floor(minutes / 60), remainder = minutes % 60
  const duration = minutes < 360 ? 10 : minutes >= 450 ? 25 : 20
  const selected = choice ?? duration
  const status = minutes < 360 ? '회복 지연 · 강도 하향' : minutes >= 450 ? '회복 양호 · 강도 상향' : '보통 · 계획대로'
  const dots = Array.from({ length: 36 }, (_, i) => {
    const angle = i / 36 * Math.PI * 2 - Math.PI / 2
    return [100 + Math.cos(angle) * 80, 100 + Math.sin(angle) * 80]
  })
  return (
    <section className="chapter sleep-experience" id="play">
      <div className="sleep-copy"><p className="kicker">YOUR EVERYDAY</p><h2>매일 같은 운동보다,<br />오늘의 나에게 맞는 운동</h2><p>수면과 컨디션에 맞춰 루틴 강도를 조절합니다.<br />수면 시간을 바꾸면 추천 시간이 달라져요.</p><div className="sleep-control"><label htmlFor="sleep-hours">어젯밤 수면 시간 <output htmlFor="sleep-hours">{hours}시간 {remainder ? `${remainder}분` : ''}</output></label><div className="ds-rail" style={{ '--p': (minutes - 240) / 300 }}><div className="ds-dots" aria-hidden="true" /><div className="ds-knob" aria-hidden="true">{hours}:{String(remainder).padStart(2, '0')}</div><input id="sleep-hours" type="range" min="240" max="540" step="10" value={minutes} onChange={e => { setMinutes(Number(e.target.value)); setChoice(null) }} aria-valuetext={`${hours}시간 ${remainder}분`} /></div><div className="range-endpoints"><span>4시간</span><span>9시간</span></div></div><p className="example-note">프로토타입 예시 · 실제 운동 처방은 전문가의 검토와 함께합니다.</p></div>
      <div className="sleep-result" aria-live="polite" aria-atomic="true"><span className="kicker">오늘의 걷기 루틴</span><div className="sleep-dial"><svg viewBox="0 0 200 200" aria-hidden="true">{dots.map(([x,y], i) => <circle key={i} cx={x} cy={y} r="2.5" className="is-filled" />)}</svg><div><span className="sleep-dial-label">선택한 걷기 시간</span><b>{selected}<span>분</span></b></div></div><p className="sleep-status">수면 기준 추천 · {duration}분 걷기</p><p className="sleep-reason">{status}</p><p className="sleep-result-note">버튼을 누르면 위의 걷기 시간이 바뀌어요</p><div className="sleep-scale">{[10,20,25].map(value => <button type="button" key={value} aria-pressed={selected === value} onClick={() => { setChoice(value) }}>{value}분</button>)}</div></div>
    </section>
  )
}
