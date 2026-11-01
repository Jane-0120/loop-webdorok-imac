import { useState } from 'react'
import Phone from '../components/Phone'
import { screen } from '../data/screens'

const STATIONS = [
  { i: 30, n: '01', when: 'D-0', en: 'MEASURE', ko: '측정', code: 'm0', label: 'M-01 측정 홈',
    title: '측정 결과를,\n내가 이해하는 말로', body: '예약부터 실시간 측정 기록까지 앱으로 연결하고, 측정 결과를 체력 유형과 쉬운 일상의 언어로 풀어줍니다.', chips: ['무인 측정', '일상 언어 해석', '체력 유형'] },
  { i: 90, n: '02', when: 'D-1', en: 'MOVE', ko: '실천', code: 'r00', label: 'R-01 루틴 홈',
    title: '맞춤 운동을,\n일상의 습관으로', body: '개인의 체력과 생활 패턴에 맞는 운동을 제안합니다. 집과 주변 공공 운동시설에서, 5분 첫 행동부터 12주 루틴을 이어갑니다.', chips: ['5분 첫 행동', '12주 미션', '공공 운동 코스'] },
  { i: 150, n: '03', when: '6주차', en: 'GROW', ko: '성장', code: 'ai', label: 'AI-01 AI 코치',
    title: '잠시 멈춰도,\n다시 시작할 수 있게', body: '그날의 컨디션에 맞춰 운동을 조절하고, 작은 행동으로 다시 시작하도록 돕습니다. 궁금한 점은 AI 코치에게 물어보세요.', chips: ['강도 사다리', 'LOOP band', 'AI 코치'] },
  { i: 210, n: '04', when: '12주차', en: 'REPORT', ko: '리포트', code: 'h4', label: 'HR-06 무브바디',
    title: '재측정으로,\n변화를 확인합니다', body: '12주 동안의 실천과 움직임의 변화를 리포트로 확인합니다. 다시 측정하고, 달라진 체력에 맞춰 다음 루틴을 이어갑니다.', chips: ['무브바디', '변화 리포트', '재측정 D-90'] },
]

export default function Loop() {
  const [active, setActive] = useState(0)
  const st = STATIONS[active]
  const onKeys = event => {
    const next = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? (active + 1) % 4 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? (active + 3) % 4 : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : null
    if (next === null) return
    event.preventDefault(); setActive(next)
    document.getElementById(`journey-tab-${next}`)?.focus()
  }
  return (
    <section className="chapter journey" id="service">
      <header className="chapter-heading"><p className="kicker">THE SERVICE</p><h2>한 번의 측정에서,<br />12주의 변화까지.</h2><p>측정 · 실천 · 성장 · 리포트.<br />단계를 선택해 일상의 흐름을 살펴보세요.</p></header>
      <div className="journey-layout">
        <div className="journey-index" role="tablist" aria-label="서비스 과정" onKeyDown={onKeys}>
          {STATIONS.map((item, i) => <button type="button" role="tab" id={`journey-tab-${i}`} key={item.n} aria-selected={active === i} aria-controls="journey-panel" tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)}><span>{item.n}</span><b>{item.ko}</b><i aria-hidden="true">↗</i></button>)}
        </div>
        <div className="journey-picture"><span className="journey-watermark" aria-hidden="true">{st.n}</span><div className="journey-device" key={st.code}><Phone src={screen(st.code)} code={st.label} width="100cqw" /></div><span className="picture-caption">{st.en} / {st.when}</span></div>
        <div className="journey-description" role="tabpanel" id="journey-panel" aria-labelledby={`journey-tab-${active}`}><p className="kicker">{st.when}</p><h3>{st.title.split('\n').join(' ')}</h3><p>{st.body}</p><ul>{st.chips.map(chip => <li key={chip}>{chip}</li>)}</ul></div>
      </div>
    </section>
  )
}
