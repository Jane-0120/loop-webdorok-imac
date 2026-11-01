import { Link } from 'react-router-dom'
import { Wordmark } from '../components/Wordmark'
import { scrollToTarget } from '../lib/scroll'
import { PROCESS_URL } from '../data/links'
import TryCards from '../components/TryCards'
import './outro-footer.css'

const YEAR = 2026

export default function Outro() {
  const toTop = e => { e.preventDefault(); scrollToTarget(0) }
  return (
    <section className="closing" id="prototype" data-snap="end">
      <div className="closing-in">
        <h2>건강을 위한 공공서비스가 <br />우리의 일상에 더 오래 함께하도록</h2>

        <TryCards />

        <footer className="site-footer">
          <div className="site-footer-top">
            <div className="site-footer-brand">
              <Wordmark height={56} />
              <p>측정에서 끝나지 않는 건강의 선순환. <br />국민체력100 서비스 리디자인 프로젝트</p>
            </div>
            <nav className="site-footer-nav" aria-label="사이트 메뉴">
              <div>
                <p>Explore</p>
                <a href="#service">Service</a>
                <Link to={PROCESS_URL}>Process</Link>
                <Link to="/archive/result">Outcome</Link>
              </div>
              <div>
                <p>Project</p>
                <span>디자인씽킹스튜디오 {YEAR}</span>
                <span>2026.03 – 2026.10</span>
                <span>김제인 · 이서연</span>
              </div>
            </nav>
          </div>
          <div className="site-footer-bottom">
            <span>© {YEAR} lOOP. All rights reserved.</span>
            <span>이 프로젝트는 성신여자대학교 졸업전시 작품이며, <br className="br-m" />국민체력100 공식 서비스가 아닙니다.</span>
            <a href="#top" onClick={toTop}>맨 위로 ↑</a>
          </div>
        </footer>
      </div>
    </section>
  )
}
