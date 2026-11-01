import { writeFile, mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { resolve } from 'node:path'
import { WORDMARK_PATH, SYMBOL_PATH } from '../src/data/logo.js'
// Fontconfig 캐시를 쓰기 가능한 임시 폴더에 격리합니다.
const fontCache = await mkdtemp(join(tmpdir(), 'loop-og-fonts-'))
const fontConfig = join(fontCache, 'fonts.conf')
await writeFile(fontConfig, `<fontconfig><dir>${resolve('node_modules/wanted-sans/fonts/ttf')}</dir><cachedir>${fontCache}</cachedir></fontconfig>`)
process.env.FONTCONFIG_FILE = fontConfig
const { default: sharp } = await import('sharp')
const fontfile = resolve('node_modules/wanted-sans/fonts/ttf/WantedSans-SemiBold.ttf')
const svg = (body, width, height) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${body}</svg>`)
const text = await sharp({text: {text:'<span foreground="#1E1E1E">측정에서 끝나지 않는\n건강의 선순환</span>', font:'Wanted Sans SemiBold 58', fontfile, rgba:true, spacing:12}}).png().toBuffer()
const logo = svg(`<svg x="0" y="0" width="190" height="100" viewBox="0 0 271 142"><path d="${WORDMARK_PATH}" fill="#495AEE"/></svg>`,190,100)
const overlay = svg('<defs><linearGradient id="fade"><stop stop-color="white" stop-opacity=".97"/><stop offset="1" stop-color="white" stop-opacity=".05"/></linearGradient></defs><rect width="1200" height="630" fill="url(#fade)"/>',1200,630)
await sharp('public/img/hero-ribbon.webp').resize(1200,630,{fit:'cover'}).composite([{input:overlay},{input:logo,left:80,top:100},{input:text,left:80,top:282}]).png().toFile('public/og-v2.png')
await writeFile('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 117 71"><path d="${SYMBOL_PATH}" fill="#495AEE"/></svg>\n`)
console.log('Generated public/og-v2.png (1200×630) and favicon.svg')
