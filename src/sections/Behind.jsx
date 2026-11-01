import { Link } from 'react-router-dom'
import ArchiveWheel from '../components/ArchiveWheel'
import { PROCESS_URL } from '../data/links'
import './research-split.css'

export default function Behind() {
  return (
    <section className="chapter archive-entry" id="behind" data-snap>
      <header className="research-head">
        <div className="research-copy">
          <p className="kicker">PROCESS</p>
          <h2>리서치에서 시작해, <br />서비스로 이어지기까지</h2>
          <p className="research-sub">8개월간의 조사와 기획, 디자인을 거쳐 <br />측정 이후의 공백을 일상의 실천으로 잇는 lOOP를 구체화했어요.</p>
        </div>
        <Link className="text-action research-cta" to={PROCESS_URL}>과정 보기 ↗</Link>
      </header>
      <ArchiveWheel />
    </section>
  )
}
