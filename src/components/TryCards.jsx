import { SERVICE_DEMO_URL, TYPE_TEST_URL } from '../data/links'
import qrPrototype from '../assets/qr/prototype.svg'
import qrTypeTest from '../assets/qr/type-test.svg'
import './try-cards.css'

// 서비스 프로토타입 · 체력 유형 테스트 카드 (홈 푸터 · Outcome 하단 공용). 파란 바탕 위에서 쓰는 디자인
const TRIES = [
  { title: '서비스 프로토타입', text: '측정 결과 확인부터 오늘의 루틴까지, lOOP 앱의 주요 흐름을 직접 눌러보세요.', href: SERVICE_DEMO_URL, qr: qrPrototype },
  { title: '체력 유형 테스트', text: '몇 가지 질문으로 나의 체력 유형을 알아보고, 나에게 맞는 운동을 추천받아 보세요.', href: TYPE_TEST_URL, qr: qrTypeTest },
]

export default function TryCards() {
  return (
    <div className="try-cards">
      {TRIES.map(item => (
        <a key={item.title} className="try-card" href={item.href} target="_blank" rel="noopener">
          <div className="try-card-copy">
            <b>{item.title} <span aria-hidden="true">↗</span></b>
            <p>{item.text}</p>
            <span className="try-card-url">{item.href.replace(/^https:\/\//, '').replace(/\/$/, '')}</span>
          </div>
          <img className="try-card-qr" src={item.qr} alt={`${item.title} QR 코드`} width="88" height="88" />
        </a>
      ))}
    </div>
  )
}
