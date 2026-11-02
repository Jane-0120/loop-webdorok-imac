import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// 구형 브라우저용 CSS 대체값: svh·dvh → vh.
// 원래 선언 앞에 넣으므로 최신 브라우저는 원래 값을 그대로 쓴다.
// 커스텀 속성·overflow clip은 src/styles/legacy-fallbacks.css에서 따로 처리
const cssFallbacks = {
  postcssPlugin: 'loop-css-fallbacks',
  Declaration(decl) {
    if (decl.prop.startsWith('--') || decl.loopFallback || !/\d[sd]vh\b/.test(decl.value)) return
    decl.loopFallback = true
    decl.cloneBefore({ value: decl.value.replace(/(\d)[sd]vh\b/g, '$1vh') }).loopFallback = true
  },
}

// GitHub Pages: 상대 경로로 빌드
export default defineConfig({
  plugins: [
    react(),
    // macOS 12 초기 Safari(15)까지는 일반 빌드로, 그보다 오래된 브라우저는 legacy 빌드로
    legacy({
      targets: ['safari >= 12', 'chrome >= 70', 'firefox >= 68'],
      modernTargets: ['safari >= 15', 'chrome >= 87', 'firefox >= 90'],
      modernPolyfills: true,
    }),
  ],
  base: './',
  css: { postcss: { plugins: [cssFallbacks] } },
  build: { cssTarget: ['safari15', 'chrome87', 'firefox90'] },
})
