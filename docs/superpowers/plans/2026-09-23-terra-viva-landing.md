# Terra Viva — Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page landing site where visitors learn about the Terra Viva brand, browse the flour catalog in a scroll-snap carousel, and order via a prefilled WhatsApp message by clicking "Encomendar".

**Architecture:** Static Vite + Tailwind v4 site with vanilla JS. Catalog cards and WhatsApp links are generated from a single `products.js` data module (DRY). Motion uses only IntersectionObserver (never `window` scroll listeners). Brand icons are inlined SVGs from `simple-icons`. Content is hand-written PT copy per the spec.

**Tech Stack:** Vite, Tailwind CSS v4 (`@tailwindcss/vite`), vanilla JS, `@fontsource/montserrat`, `@fontsource/inter`, `@phosphor-icons/web`, `simple-icons`.

## Global Constraints

Copied verbatim from the spec (any task that violates these is wrong):

- One offer, one audience, one primary action: **encomendar via WhatsApp** (`+244 975 627 885`).
- Contact URLs (exact, clean — no query params): WhatsApp `https://wa.me/244975627885`, Instagram `https://www.instagram.com/terraviva.ao`, Facebook `https://www.facebook.com/768613552982425`, YouTube `https://youtube.com/@terraviva.angola`.
- WhatsApp prefilled: generic `?text=Olá, quero encomendar farinhas Terra Viva.`; per product `?text=Olá, quero encomendar 1x <Produto> (<peso>).`
- CTA label is exactly **`Encomendar`** everywhere (never "Encomendar no WhatsApp"). The WhatsApp channel is signalled by the WhatsApp glyph inside the button + caption `via WhatsApp · +244 975 627 885` next to the primary button.
- Slogan is **"Nutre o que te move"** (from the identity kit) — used only as the full-page tagline reveal. "Natural · Saudável · Real" is an eyebrow descriptor in the "A marca" section only, never a slogan.
- Hero H1 (exact): `Farinhas para a vida que fazes todos os dias.` Hero sub (exact): `Raízes e tubérculos de Angola, transformados em farinhas simples de entrar na tua rotina.`
- Copy rules: treat the reader as **tu**; short sentences; active voice; **no exclamation marks**; no invented claims/numbers; no AI clichés ("elevate", "seamless"…). Header text uses `text-wrap: balance`; running text `text-wrap: pretty`.
- Colors: global background creme `#F5F2EB`, text `#332E29`, neutral `#6E675F`, single CTA accent olive `#4A5D4E`. Product palettes: Banana Verde `#4A5D4E/#768A7A/#A3B5A7`, Batata Doce `#AC6A43/#CE8E64/#EFCEB8`, Beterraba `#6B2D43/#9E5E72/#D2A3B0`, Inhame `#7A6A5E/#9E8F84/#D5CFC9`, Mix Raízes `#5C4E43/#8A7869/#C4B5A5`.
- Light mode only. No background gradients. No black shadows (tinted shadows only). No borders on a single side.
- Fonts: Montserrat (Light/Regular) for titles/product names, Inter (Light/Regular) for body, self-hosted via `@fontsource` (never Google Fonts link).
- Motion: reveals via IntersectionObserver (fade + translate-y, 800ms+, `cubic-bezier(0.32,0.72,0,1)`); carousel CSS `scroll-snap`; tagline word-by-word reveal; CTA glyph nudge animation (periodic, paused on `prefers-reduced-motion`, hover pauses it). **Never** `window.addEventListener('scroll')`.
- Accessibility: semantic HTML, skip link, visible focus rings, alt text, WCAG AA contrast for body text, carousel navigable by arrows and keyboard.
- SEO: `<title>`, meta description, `og:*`, favicon = `Icone_Folha.png`, FAQ JSON-LD schema.
- Catalog data (exact per-product taglines from packaging, weights confirmed): Banana Verde 250g / Batata Doce 250g / **Beterraba 81g** / Inhame 250g / Mix de Farinha Raízes que Nutrem 250g. Sorgo is **out of scope** for v1.
- Founder story (Elizabeth Miguel, 19, school project, 6 mil Kz) is **gated**: only goes live with the founder's express authorization. Build it; flag it before publish.
- The 5 transparent product PNGs go in `site/public/images/`; `Todas_Farinhas.png` (group) is the hero visual; `Icone_Folha.png` is the favicon at `site/public/`.
- Commit discipline: frequent, small commits (`git init` in `site/` — confirm with the user before the first commit; story can run commit-by-commit after that).

---

## File Structure

```
site/
  package.json                 # deps + scripts
  vite.config.js               # @tailwindcss/vite plugin
  .gitignore                   # node_modules, dist
  index.html                   # full page markup + meta + JSON-LD (section shell; catalog track empty)
  public/
    Icone_Folha.png            # favicon
    images/                    # 6 copied PNGs (5 products + group hero)
  src/
    styles.css                 # @theme tokens, base, components (cards, carousel, nav, FAQ, waves, nudge, reveal)
    main.js                    # entry: imports + catalog render + CTA wiring + initUi()
    data/products.js           # WA number, generic link, product array, orderLink()
    icons.js                   # brandIcon() inline SVG from simple-icons
    ui.js                      # reveals, tagline words, carousel arrows (IntersectionObserver only)
```

Responsibilities: `products.js` is the single source for products and WhatsApp links. `icons.js` owns brand-glyph SVG injection. `ui.js` owns all motion/interaction. `index.html` is static semantic markup (no JS-rendered text). `styles.css` owns tokens + component classes; one-off layout uses Tailwind utilities inline in `index.html`.

Interface contracts (defined once, used by later tasks):

- `products.js` exports: `WA_NUMBER` (`'244975627885'`), `WA_GENERIC` (`https://wa.me/244975627885?text=Ol%C3%A1%2C...`), `products` (array of `{ id, name, weight, tagline, image, palette }` with `palette` in `['olive','cobre','bordeaux','taupe','terra']` — same order as the spec), `orderLink(product) -> string`.
- `icons.js` exports: `brandIcon(name, className) -> string` where `name` in `['whatsapp','instagram','facebook','youtube']`; returns an inline `<svg>` with `aria-hidden="true"`.
- `ui.js` exports: `initUi()` — no args, once on load. Wires `[data-reveal]`, `[data-tagline]`, `[data-carousel]`.
- `main.js` renders `<article class="product-card carousel-card">` into `[data-carousel-track]`, sets `style.setProperty('--accent'|'--soft'|'--pale', …)` on each card, fills `[data-wa-icon]` spans, sets `href` on `[data-wa-generic]` anchors, then calls `initUi()`.

---

### Task 1: Scaffold the Vite + Tailwind v4 project, copy assets

**Files:**
- Create: `site/package.json`
- Create: `site/vite.config.js`
- Create: `site/.gitignore`
- Create: `site/index.html` (minimal placeholder)
- Create: `site/src/main.js` (minimal placeholder)
- Create: `site/src/styles.css` (minimal placeholder)
- Assets: copy 6 PNGs into `site/public/`

**Interfaces:**
- Consumes: nothing.
- Produces: a runnable Vite + Tailwind v4 project with all assets present; scripts `dev`, `build`, `preview`.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "terra-viva-landing",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@fontsource/inter": "^5.2.5",
    "@fontsource/montserrat": "^5.2.5",
    "@phosphor-icons/web": "^2.1.1",
    "simple-icons": "^15.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.0",
    "tailwindcss": "^4.1.0",
    "vite": "^6.3.0"
  }
}
```

- [ ] **Step 2: Write `vite.config.js`**

```js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

- [ ] **Step 3: Write `.gitignore`**

```
node_modules
dist
.DS_Store
```

- [ ] **Step 4: Write minimal placeholder `index.html`**

```html
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Terra Viva</title>
    <link rel="icon" type="image/png" href="/Icone_Folha.png" />
  </head>
  <body>
    <h1>Terra Viva</h1>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 5: Write minimal placeholder `src/main.js` and `src/styles.css`**

`src/main.js`:

```js
import './styles.css'
```

`src/styles.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 6: Copy brand assets**

Create dirs and copy the 6 PNGs from the project root into the build:

```bash
mkdir -p site/public/images site/src site/docs/superpowers/plans
cp "/home/geraldo/Projetos/TERRA VIVA/Todas_Farinhas.png" site/public/images/
cp "/home/geraldo/Projetos/TERRA VIVA/Farinha_Banana_Verde.png" site/public/images/
cp "/home/geraldo/Projetos/TERRA VIVA/Farinha_Batata_Doce.png" site/public/images/
cp "/home/geraldo/Projetos/TERRA VIVA/Farinha_Beterraba.png" site/public/images/
cp "/home/geraldo/Projetos/TERRA VIVA/Farinha_Inhame.png" site/public/images/
cp "/home/geraldo/Projetos/TERRA VIVA/Mix_Raizes_Que_Nutrem.png" site/public/images/
cp "/home/geraldo/Projetos/TERRA VIVA/Icone_Folha.png" site/public/
```

Note: `Todas_Farinhas.png` (group shot) is the hero visual; the 5 single product PNGs are the catalog cards; `Icone_Folha.png` is the favicon.

- [ ] **Step 7: Install dependencies**

Run in `site/`:

```bash
npm install
```

Expected: install completes without errors; `node_modules` exists.

- [ ] **Step 8: Verify build**

Run in `site/`:

```bash
npm run build
```

Expected: build succeeds; `site/dist/index.html` and hashed `site/dist/assets/*.css|*.js` are produced.

- [ ] **Step 9: Initialize git (confirm first)**

```bash
git init
git add package.json vite.config.js .gitignore index.html public src
git commit -m "chore: scaffold vite + tailwind v4 site, copy brand assets"
```

Expected: repo in `site/` with one commit. (User approval gate: confirm git init + first commit with the user before running this step.)

---

### Task 2: Design tokens and base styles

**Files:**
- Modify: `site/src/styles.css` (replace placeholder with full tokens + base + motion primitives)

**Interfaces:**
- Consumes: Task 1 scaffold.
- Produces: Tailwind color/font/radius tokens (utilities `bg-cream`, `text-ink`, `text-ink-soft`, `text-olive`, `bg-olive`, `font-display`, `font-body`, `rounded-card`), base element styles, `[data-reveal]`/`[data-word]` transition primitives, `.cta-nudge` keyframes, `:focus-visible`, reduced-motion collapse, `.skip-link`.

- [ ] **Step 1: Replace `src/styles.css` with the full token and base layer**

```css
@import "tailwindcss";

@theme {
  --color-cream: #F5F2EB;
  --color-ink: #332E29;
  --color-ink-soft: #6E675F;
  --color-olive: #4A5D4E;
  --color-olive-soft: #768A7A;
  --color-olive-pale: #A3B5A7;
  --color-cobre: #AC6A43;
  --color-cobre-soft: #CE8E64;
  --color-cobre-pale: #EFCEB8;
  --color-bordeaux: #6B2D43;
  --color-bordeaux-soft: #9E5E72;
  --color-bordeaux-pale: #D2A3B0;
  --color-taupe: #7A6A5E;
  --color-taupe-soft: #9E8F84;
  --color-taupe-pale: #D5CFC9;
  --color-terra: #5C4E43;
  --color-terra-soft: #8A7869;
  --color-terra-pale: #C4B5A5;

  --font-display: "Montserrat", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;

  --radius-card: 16px;
  --ease-organic: cubic-bezier(0.32, 0.72, 0, 1);
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--color-cream);
    color: var(--color-ink);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  h1, h2, h3 {
    font-family: var(--font-display);
    font-weight: 300;
    text-wrap: balance;
  }

  p, li {
    text-wrap: pretty;
  }

  ::selection {
    background-color: var(--color-olive);
    color: var(--color-cream);
  }

  :focus-visible {
    outline: 2px solid var(--color-olive);
    outline-offset: 3px;
  }
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: var(--color-olive);
  color: var(--color-cream);
  font-family: var(--font-body);
}
.skip-link:focus {
  left: 16px;
  top: 16px;
}

[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s var(--ease-organic), transform 0.8s var(--ease-organic);
}
[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

@keyframes nudge {
  0%, 84%, 100% { transform: translateX(0); }
  90% { transform: translateX(4px); }
  95% { transform: translateX(-2px); }
}
.cta-nudge {
  display: inline-block;
  animation: nudge 4s ease-in-out infinite;
}
.cta-nudge:hover {
  animation-play-state: paused;
}

.hero-title {
  background-image: linear-gradient(180deg, #332E29 0%, #8a857c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.wa-note {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--color-ink-soft);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Verify build**

Run in `site/`:

```bash
npm run build
```

Expected: builds clean. (Tokens are only consumed by classes added in later tasks, so no visual check here.)

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "feat: brand design tokens, base styles, motion primitives"
```

---

### Task 3: Product data and brand icons

**Files:**
- Create: `site/src/data/products.js`
- Create: `site/src/icons.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `WA_GENERIC`, `products`, `orderLink(product)`, `brandIcon(name, className)` (exact shapes in File Structure above). Later tasks import these by name.

- [ ] **Step 1: Create `src/data/products.js`**

```js
export const WA_NUMBER = '244975627885'

const genericText = 'Olá, quero encomendar farinhas Terra Viva.'
export const WA_GENERIC = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(genericText)}`

export const products = [
  {
    id: 'banana-verde',
    name: 'Farinha de Banana Verde',
    weight: '250g',
    tagline: 'para uma rotina mais leve e nutritiva',
    image: '/images/Farinha_Banana_Verde.png',
    palette: 'olive',
  },
  {
    id: 'batata-doce',
    name: 'Farinha de Batata Doce',
    weight: '250g',
    tagline: 'nutrição que te acompanha todos os dias',
    image: '/images/Farinha_Batata_Doce.png',
    palette: 'cobre',
  },
  {
    id: 'beterraba',
    name: 'Farinha de Beterraba',
    weight: '81g',
    tagline: 'o teu dia pede escolhas que nutrem',
    image: '/images/Farinha_Beterraba.png',
    palette: 'bordeaux',
  },
  {
    id: 'inhame',
    name: 'Farinha de Inhame',
    weight: '250g',
    tagline: 'uma forma mais simples de nutrir o dia',
    image: '/images/Farinha_Inhame.png',
    palette: 'taupe',
  },
  {
    id: 'mix',
    name: 'Mix de Farinha Raízes que Nutrem',
    weight: '250g',
    tagline: 'mistura. prepara. nutre',
    image: '/images/Mix_Raizes_Que_Nutrem.png',
    palette: 'terra',
  },
]

const palettes = {
  olive: ['#4A5D4E', '#768A7A', '#A3B5A7'],
  cobre: ['#AC6A43', '#CE8E64', '#EFCEB8'],
  bordeaux: ['#6B2D43', '#9E5E72', '#D2A3B0'],
  taupe: ['#7A6A5E', '#9E8F84', '#D5CFC9'],
  terra: ['#5C4E43', '#8A7869', '#C4B5A5'],
}

export function orderLink(product) {
  const text = `Olá, quero encomendar 1x ${product.name} (${product.weight}).`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
}

export function paletteColors(palette) {
  return palettes[palette] ?? palettes.olive
}
```

Note: `paletteColors()` returns `[accent, soft, pale]` for the card — task 7 sets these as `--accent`, `--soft`, `--pale`.

- [ ] **Step 2: Create `src/icons.js`**

```js
import {
  siWhatsapp,
  siInstagram,
  siFacebook,
  siYoutube,
} from 'simple-icons'

const icons = {
  whatsapp: siWhatsapp,
  instagram: siInstagram,
  facebook: siFacebook,
  youtube: siYoutube,
}

export function brandIcon(name, className = '') {
  const icon = icons[name]
  if (!icon) return ''
  return `<svg class="${className}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true" focusable="false"><path d="${icon.path}"/></svg>`
}
```

Expected: `brandIcon('whatsapp', 'ic')` returns an inline SVG string whose `<path>` is the WhatsApp glyph.

- [ ] **Step 3: Verify module loads without errors**

Run in `site/`:

```bash
npm run build
```

Expected: build succeeds. (These modules are not imported yet, so this only proves they are valid ES modules.)

- [ ] **Step 4: Commit**

```bash
git add src/data/products.js src/icons.js
git commit -m "feat: catalog data with prefilled WhatsApp links, brand icons"
```

---

### Task 4: Page head, nav pill, hero, tagline reveal

**Files:**
- Modify: `site/index.html` (replace placeholder with head + nav + main sections 1-3)

**Interfaces:**
- Consumes: Task 1 scaffold; `WA_GENERIC` fill happens in Task 7 via `data-wa-generic`; word reveal handled in Task 8 via `data-tagline`/`data-word`.
- Produces: semantic scaffold for `[data-wa-icon]`, `[data-wa-generic]`, `[data-tagline]`, `[data-word]`, `.wa-btn`, `.hero-*`, `.nav-pill`, `.skip-link`, plus full SEO `<head>` (title, description, OG, favicon, FAQ JSON-LD).

- [ ] **Step 1: Replace `site/index.html`**

```html
<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Terra Viva — Farinhas naturais de Angola | Encomendar via WhatsApp</title>
    <meta
      name="description"
      content="Farinhas de banana verde, batata-doce, beterraba, inhame e mix de raízes. Feitas em Angola, simples de entrar na tua rotina. Encomenda pelo WhatsApp."
    />
    <meta name="theme-color" content="#F5F2EB" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_AO" />
    <meta property="og:site_name" content="Terra Viva" />
    <meta property="og:title" content="Terra Viva — Farinhas naturais de Angola" />
    <meta
      property="og:description"
      content="Farinhas de raízes e tubérculos de Angola. Encomenda pelo WhatsApp +244 975 627 885."
    />
    <meta property="og:image" content="/images/Todas_Farinhas.png" />
    <link rel="icon" type="image/png" href="/Icone_Folha.png" />
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Como encomendo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Escolhe a farinha e toca em Encomendar. O WhatsApp abre com a mensagem pronta — é só enviar."
          }
        },
        {
          "@type": "Question",
          "name": "Como funciona a entrega?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Combina a zona e o valor da entrega diretamente no WhatsApp, antes de confirmar a encomenda."
          }
        },
        {
          "@type": "Question",
          "name": "Como posso usar as farinhas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No pequeno-almoço, em papas, batidos, panquecas e receitas. Sempre que quiseres uma refeição simples e nutritiva."
          }
        }
      ]
    }
    </script>
  </head>
  <body>
    <a class="skip-link" href="#main">Saltar para o conteúdo</a>

    <header class="site-header">
      <nav class="nav-pill" aria-label="Principal">
        <a class="nav-logo" href="#inicio">terra&nbsp;viva</a>
        <a class="wa-btn" href="#" data-wa-generic>
          <span data-wa-icon class="wa-glyph cta-nudge"></span>
          <span>Encomendar</span>
        </a>
      </nav>
    </header>

    <main id="main">
      <section id="inicio" class="hero" aria-labelledby="hero-titulo">
        <div class="hero-copy">
          <h1 class="hero-title" id="hero-titulo">Farinhas para a vida que fazes todos os dias.</h1>
          <p class="hero-sub">Raízes e tubérculos de Angola, transformados em farinhas simples de entrar na tua rotina.</p>
          <div class="hero-cta">
            <a class="wa-btn wa-btn--lg" href="#" data-wa-generic>
              <span data-wa-icon class="wa-glyph cta-nudge"></span>
              <span>Encomendar</span>
            </a>
            <span class="wa-note">via WhatsApp · +244 975 627 885</span>
          </div>
        </div>
        <div class="hero-visual">
          <img
            src="/images/Todas_Farinhas.png"
            alt="Embalagens das farinhas Terra Viva, do mix de raízes às farinhas individuais"
            width="1200"
          />
        </div>
      </section>

      <section class="tagline" data-tagline aria-label="Nutre o que te move">
        <h2 class="tagline-line">
          <span class="tagline-word" data-word>Nutre</span>
          <span class="tagline-word" data-word>o</span>
          <span class="tagline-word" data-word>que</span>
          <span class="tagline-word" data-word>te</span>
          <span class="tagline-word" data-word>move.</span>
        </h2>
        <p class="tagline-sub">Alimentos que nutrem corpo e vida.</p>
      </section>
    </main>

    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

Note: the tagline sub reads `` `Alimentos que nutrem corpo e vida.` `` — this is the brand's own Instagram bio line (spec obj. section 1), used as the sub-line under the slogan. Flag with the client; it is factual (their bio) and gated like the founder story.

- [ ] **Step 2: Verify build**

Run in `site/`:

```bash
npm run build
```

Expected: build succeeds; `dist/index.html` contains the head, nav, hero, and tagline markup.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: page head with SEO/FAQ schema, nav pill, hero, tagline reveal"
```

---

### Task 5: Hero, nav, tagline, and wave styles

**Files:**
- Modify: `site/src/styles.css` (append component styles for nav, hero, tagline, waves)

**Interfaces:**
- Consumes: Task 2 tokens.
- Produces: `.site-header`, `.nav-pill`, `.nav-logo`, `.wa-btn` (+ `--lg`), `.wa-glyph`, `.hero*`, `.tagline*`, `.wave`, grid layouts for task 6 sections.

- [ ] **Step 1: Append component styles for nav/hero/tagline to `src/styles.css`**

```css
.site-header {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 40;
  padding: 16px;
  pointer-events: none;
}
.nav-pill {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1200px;
  margin-inline: auto;
  padding: 8px 10px 8px 22px;
  border-radius: 999px;
  background-color: rgb(245 242 235 / 0.92);
  box-shadow: 0 4px 20px rgb(51 46 41 / 0.08);
  backdrop-filter: blur(8px);
}
.nav-logo {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  color: var(--color-ink);
  text-decoration: none;
}
.nav-logo:hover {
  color: var(--color-olive);
}

.wa-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background-color: var(--color-olive);
  color: #fff;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.95rem;
  padding: 10px 20px;
  text-decoration: none;
  box-shadow: 0 4px 16px rgb(51 46 41 / 0.15);
  transition: transform 0.2s var(--ease-organic), box-shadow 0.2s var(--ease-organic);
}
.wa-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgb(51 46 41 / 0.18);
}
.wa-btn:active {
  transform: scale(0.98);
}
.wa-btn--lg {
  font-size: 1.05rem;
  padding: 14px 28px;
}
.wa-glyph {
  width: 1.1em;
  height: 1.1em;
}
.wa-glyph svg {
  display: block;
  width: 100%;
  height: 100%;
}

.hero {
  display: grid;
  gap: 40px;
  align-items: center;
  max-width: 1200px;
  margin-inline: auto;
  padding: 140px 20px 64px;
}
.hero-copy {
  max-width: 680px;
}
.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  line-height: 1.08;
  margin: 0 0 20px;
}
.hero-sub {
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  line-height: 1.6;
  color: var(--color-ink-soft);
  margin: 0 0 28px;
}
.hero-cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
.hero-visual {
  text-align: center;
}
.hero-visual img {
  max-width: 100%;
  max-height: 440px;
  width: auto;
  height: auto;
}

.tagline {
  max-width: 1200px;
  margin-inline: auto;
  padding: 96px 20px;
  text-align: center;
  border-block: 1px solid rgb(51 46 41 / 0.1);
}
.tagline-line {
  font-size: clamp(1.8rem, 6vw, 4rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
}
.tagline-word {
  display: inline-block;
  margin-right: 0.28em;
  opacity: 0;
  transform: translateY(0.5em);
  transition: opacity 0.7s var(--ease-organic), transform 0.7s var(--ease-organic);
}
.tagline[data-visible] .tagline-word {
  opacity: 1;
  transform: none;
}
.tagline-sub {
  margin-top: 20px;
  color: var(--color-ink-soft);
  font-size: 1rem;
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: 1.1fr 0.9fr;
    padding-block: 160px 96px;
  }
}
```

- [ ] **Step 2: Verify build**

Run in `site/`:

```bash
npm run build
```

Expected: build succeeds. (Visual check deferred to Task 10 screenshots.)

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "feat: nav, hero, tagline, CTA button styles"
```

---

### Task 6: Brand section, catalog shell, how-to-order, FAQ, final CTA, footer

**Files:**
- Modify: `site/index.html` (extend `main` with sections 4–9)
- Modify: `site/src/styles.css` (append section/grid/FAQ/footer styles in a follow-up step of this task, keeping the task self-contained in review)

**Interfaces:**
- Consumes: Task 4 scaffold (continues `main`); catalog `[data-carousel]` container filled in Task 7.
- Produces: static markup + classes: `.marca`, `.eyebrow`, `.section-head`, `.catalogo`, `.carousel*`, `.passos`, `.passo*`, `.faq`/`.faq-item`, `.cta-final`, `.site-footer`, `.social`.

- [ ] **Step 1: Extend `main` with the remaining sections** (insert before the closing `</main>` and before the existing footer-less close)

Replace the block

```html
      </section>
    </main>
```

with

```html
      </section>

      <section id="marca" class="marca" aria-labelledby="marca-titulo" data-reveal>
        <div class="marca-copy">
          <p class="eyebrow">natural · saudável · real</p>
          <h2 id="marca-titulo">De um projeto escolar para a tua mesa.</h2>
          <p>
            A Terra Viva nasceu como projeto escolar, aos 19 anos, com 6 mil Kz na mão.
            Hoje é uma marca angolana de farinhas feitas a partir de raízes, tubérculos
            e frutos, simples de entrar na tua rotina.
          </p>
        </div>
        <div class="marca-visual">
          <img
            src="/images/Mix_Raizes_Que_Nutrem.png"
            alt="Embalagem do mix de farinhas de raízes Terra Viva"
            loading="lazy"
            width="1000"
          />
        </div>
      </section>

      <section id="catalogo" class="catalogo" aria-labelledby="catalogo-titulo" data-carousel>
        <div class="section-head">
          <h2 id="catalogo-titulo">As nossas farinhas</h2>
          <p>Escolhe a tua e toca em Encomendar.</p>
        </div>
        <div
          class="carousel-track"
          data-carousel-track
          tabindex="0"
          aria-label="Carrossel de farinhas Terra Viva"
        ></div>
        <div class="carousel-controls">
          <button type="button" class="carousel-btn" data-carousel-prev aria-label="Ver farinha anterior">
            <i class="ph ph-caret-left" aria-hidden="true"></i>
          </button>
          <button type="button" class="carousel-btn" data-carousel-next aria-label="Ver farinha seguinte">
            <i class="ph ph-caret-right" aria-hidden="true"></i>
          </button>
        </div>
      </section>

      <section id="como-encomendar" class="passos" aria-labelledby="passos-titulo" data-reveal>
        <div class="section-head">
          <h2 id="passos-titulo">Encomendar em três passos</h2>
        </div>
        <ol class="passos-grid">
          <li class="passo">
            <i class="ph ph-squares-four passo-icon" aria-hidden="true"></i>
            <h3>1. Escolhe a farinha</h3>
            <p>Vê o catálogo e escolhe a que queres experimentar.</p>
          </li>
          <li class="passo">
            <i class="ph ph-paper-plane-tilt passo-icon" aria-hidden="true"></i>
            <h3>2. Encomendar</h3>
            <p>O WhatsApp abre com a mensagem pronta. É só enviar.</p>
          </li>
          <li class="passo">
            <i class="ph ph-truck passo-icon" aria-hidden="true"></i>
            <h3>3. Combina a entrega</h3>
            <p>Combinas a zona e a forma de pagamento com a equipa.</p>
          </li>
        </ol>
      </section>

      <section id="faq" class="faq" aria-labelledby="faq-titulo" data-reveal>
        <div class="section-head">
          <h2 id="faq-titulo">Perguntas frequentes</h2>
        </div>
        <div class="faq-list">
          <details class="faq-item">
            <summary>Como encomendo?</summary>
            <p>Escolhe a farinha e toca em Encomendar. O WhatsApp abre com a mensagem pronta — é só enviar.</p>
          </details>
          <details class="faq-item">
            <summary>Como funciona a entrega?</summary>
            <p>Combina a zona e o valor da entrega diretamente no WhatsApp, antes de confirmar a encomenda.</p>
          </details>
          <details class="faq-item">
            <summary>Como posso usar as farinhas?</summary>
            <p>No pequeno-almoço, em papas, batidos, panquecas e receitas. Sempre que quiseres uma refeição simples e nutritiva.</p>
          </details>
        </div>
      </section>

      <section class="cta-final" aria-labelledby="cta-titulo" data-reveal>
        <h2 id="cta-titulo">Queres começar?</h2>
        <p>Escolhe uma farinha e envia a tua encomenda pelo WhatsApp.</p>
        <a class="wa-btn wa-btn--lg" href="#" data-wa-generic>
          <span data-wa-icon class="wa-glyph cta-nudge"></span>
          <span>Encomendar</span>
        </a>
        <span class="wa-note">via WhatsApp · +244 975 627 885</span>
      </section>
    </main>

    <footer class="site-footer">
      <p class="footer-brand">terra viva</p>
      <p class="footer-contact">
        <a class="footer-wa" href="#" data-wa-generic>WhatsApp +244 975 627 885</a>
      </p>
      <ul class="social" aria-label="Redes sociais da Terra Viva">
        <li>
          <a href="https://www.instagram.com/terraviva.ao" target="_blank" rel="noopener">
            <span data-wa-icon data-ic="instagram" aria-hidden="true"></span>
            <span class="visually-hidden">Instagram</span>
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/768613552982425" target="_blank" rel="noopener">
            <span data-wa-icon data-ic="facebook" aria-hidden="true"></span>
            <span class="visually-hidden">Facebook</span>
          </a>
        </li>
        <li>
          <a href="https://youtube.com/@terraviva.angola" target="_blank" rel="noopener">
            <span data-wa-icon data-ic="youtube" aria-hidden="true"></span>
            <span class="visually-hidden">YouTube</span>
          </a>
        </li>
      </ul>
      <p class="footer-legal">© 2026 Terra Viva · Todos os direitos reservados</p>
    </footer>
```

Note: the footer social links use `data-wa-icon data-ic="<name>"` so Task 7 renders the correct glyph per link. "Privacidade/Termos" links are intentionally omitted (no pages exist yet) — noted as a flag for a future phase.

- [ ] **Step 2: Append the section, carousel, FAQ, and footer styles to `src/styles.css`**

```css
.section-head {
  max-width: 680px;
  margin: 0 auto 40px;
  text-align: center;
}
.section-head h2 {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  margin: 0 0 8px;
}
.section-head p {
  color: var(--color-ink-soft);
  margin: 0;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-olive);
  margin: 0 0 16px;
}

.marca {
  display: grid;
  gap: 40px;
  align-items: center;
  max-width: 1200px;
  margin-inline: auto;
  padding: 96px 20px;
}
.marca-copy h2 {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  margin: 0 0 20px;
}
.marca-copy p:not(.eyebrow) {
  color: var(--color-ink-soft);
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 34em;
}
.marca-visual {
  text-align: center;
}
.marca-visual img {
  max-width: 100%;
  max-height: 380px;
  width: auto;
  height: auto;
}

.catalogo {
  max-width: 1200px;
  margin-inline: auto;
  padding: 40px 20px 96px;
}
.catalogo .section-head {
  margin-bottom: 32px;
}
.carousel-track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  padding-block: 8px;
  scroll-padding-inline: 20px;
}
.carousel-track::-webkit-scrollbar {
  display: none;
}
.carousel-track:focus-visible {
  outline: 2px solid var(--color-olive);
  outline-offset: 4px;
  border-radius: 0;
}
.carousel-card {
  scroll-snap-align: center;
  flex: 0 0 min(92%, 340px);
}
.carousel-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}
.carousel-btn {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgb(51 46 41 / 0.15);
  background-color: var(--color-cream);
  color: var(--color-ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s var(--ease-organic), color 0.2s var(--ease-organic);
}
.carousel-btn:hover {
  background-color: var(--color-olive);
  color: var(--color-cream);
}
.carousel-btn:active {
  transform: scale(0.96);
}
.carousel-btn .ph {
  font-size: 1.2rem;
}

.passos {
  max-width: 1200px;
  margin-inline: auto;
  padding: 96px 20px;
  background-color: rgb(255 255 255 / 0.35);
}
.passos-grid {
  list-style: none;
  display: grid;
  gap: 24px;
  padding: 0;
  margin: 0 auto;
  max-width: 900px;
}
.passo {
  background-color: var(--color-cream);
  border-radius: var(--radius-card);
  padding: 28px;
  box-shadow: 0 4px 20px rgb(51 46 41 / 0.06);
}
.passo-icon {
  font-size: 1.6rem;
  color: var(--color-olive);
}
.passo h3 {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.15rem;
  margin: 12px 0 6px;
}
.passo p {
  color: var(--color-ink-soft);
  margin: 0;
}

.faq {
  max-width: 760px;
  margin-inline: auto;
  padding: 96px 20px;
}
.faq-item {
  border-bottom: 1px solid rgb(51 46 41 / 0.12);
}
.faq-item summary {
  cursor: pointer;
  list-style: none;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.1rem;
  padding: 20px 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faq-item summary::-webkit-details-marker {
  display: none;
}
.faq-item summary::after {
  content: "+";
  font-size: 1.3rem;
  color: var(--color-olive);
  transition: transform 0.2s var(--ease-organic);
}
.faq-item[open] summary::after {
  content: "−";
}
.faq-item p {
  color: var(--color-ink-soft);
  margin: 0;
  padding: 0 4px 20px;
  max-width: 56ch;
}

.cta-final {
  text-align: center;
  max-width: 680px;
  margin-inline: auto;
  padding: 120px 20px;
}
.cta-final h2 {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  margin: 0 0 16px;
}
.cta-final > p {
  color: var(--color-ink-soft);
  font-size: 1.1rem;
  margin: 0 0 32px;
}
.cta-final .wa-note {
  display: block;
  margin-top: 16px;
}

.site-footer {
  border-top: 1px solid rgb(51 46 41 / 0.1);
  padding: 56px 20px 40px;
  text-align: center;
  color: var(--color-ink-soft);
  display: grid;
  gap: 12px;
  justify-items: center;
}
.footer-brand {
  font-family: var(--font-display);
  color: var(--color-ink);
  margin: 0;
}
.footer-contact {
  margin: 0;
}
.footer-wa {
  color: var(--color-olive);
  text-decoration: none;
}
.footer-wa:hover {
  text-decoration: underline;
}
.social {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 8px 0 0;
  padding: 0;
}
.social a {
  color: var(--color-ink-soft);
  text-decoration: none;
  display: inline-flex;
}
.social a:hover {
  color: var(--color-olive);
}
.social svg {
  width: 22px;
  height: 22px;
}
.footer-legal {
  margin: 8px 0 0;
  font-size: 0.85rem;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (min-width: 900px) {
  .marca {
    grid-template-columns: 1fr 1fr;
  }
  .passos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

- [ ] **Step 3: Verify build**

Run in `site/`:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add index.html src/styles.css
git commit -m "feat: brand section, catalog shell, how-to-order, FAQ, final CTA, footer"
```

---

### Task 7: Entry point — catalog rendering and CTA wiring

**Files:**
- Modify: `site/src/main.js` (replace placeholder with full entry)

**Interfaces:**
- Consumes: `products`, `WA_GENERIC`, `orderLink`, `paletteColors` from `data/products.js`; `brandIcon` from `icons.js`; `initUi` from `ui.js` (created in Task 8 — import here, wire last).
- Produces: rendered `.product-card` elements into `[data-carousel-track]`; `href` + icon fills on `[data-wa-generic]`, `[data-wa-icon]` (including `data-ic="<name>"` social variants); calls `initUi()`.

- [ ] **Step 1: Replace `src/main.js`**

```js
import './styles.css'
import '@fontsource/montserrat/latin-300.css'
import '@fontsource/montserrat/latin-400.css'
import '@fontsource/inter/latin-300.css'
import '@fontsource/inter/latin-400.css'
import '@phosphor-icons/web/regular'
import './data/products.js'

import { products, WA_GENERIC, orderLink, paletteColors } from './data/products.js'
import { brandIcon } from './icons.js'
import { initUi } from './ui.js'

const mediaMarkup = (product) => `
  <div class="product-card-media">
    <img
      src="${product.image}"
      alt="Embalagem de ${product.name} Terra Viva"
      loading="lazy"
      width="1000"
    />
  </div>
  <div class="product-card-body">
    <h3>${product.name}</h3>
    <p class="product-tagline">${product.tagline}</p>
    <span class="product-chip">${product.weight}</span>
    <a
      class="wa-btn product-order"
      href="${orderLink(product)}"
      target="_blank"
      rel="noopener"
    >
      <span class="wa-glyph">${brandIcon('whatsapp', '')}</span>
      <span>Encomendar</span>
    </a>
  </div>
`

function renderCatalog() {
  const track = document.querySelector('[data-carousel-track]')
  if (!track) return
  const fragment = document.createDocumentFragment()
  for (const product of products) {
    const card = document.createElement('article')
    card.className = 'product-card carousel-card'
    card.setAttribute('role', 'listitem')
    const [accent, soft, pale] = paletteColors(product.palette)
    card.style.setProperty('--accent', accent)
    card.style.setProperty('--soft', soft)
    card.style.setProperty('--pale', pale)
    card.innerHTML = mediaMarkup(product)
    fragment.append(card)
  }
  track.append(fragment)
}

function wireCtas() {
  document.querySelectorAll('[data-wa-generic]').forEach((a) => {
    a.href = WA_GENERIC
  })
  document.querySelectorAll('[data-wa-icon]').forEach((el) => {
    const name = el.dataset.ic || 'whatsapp'
    el.innerHTML = brandIcon(name, '')
  })
}

renderCatalog()
wireCtas()
initUi()
```

Note: Task 8 creates `src/ui.js`; if this task runs in isolation, temporarily stub `export function initUi() {}` in a stub `src/ui.js`, replace it in Task 8.

- [ ] **Step 2: Verify render in the browser**

Run in `site/`:

```bash
npm run dev
```

Open `http://localhost:5173`. You should see the hero, nav, tagline; the `As nossas farinhas` track is **empty until Task 7 includes card styles + a product-card class**, which live in Task 8. Expected at this checkpoint: page shows header/nav/hero/tagline/brand/FAQ/footer correctly; no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: catalog rendering from data, WhatsApp CTA wiring, icon injection"
```

---

### Task 8: Product cards, carousel, product data rendering, and UI wiring

**Files:**
- Create: `site/src/ui.js`
- Modify: `site/src/styles.css` (append `.product-card*` + `.product-chip` styles)

**Interfaces:**
- Consumes: Task 6 carousel markup (`data-carousel`, `data-carousel-track/-prev/-next`), Task 7 rendered cards.
- Produces: `initUi()` (reveals, tagline words, carousel arrows). Card styles `.product-card`, `.product-card-media`, `.product-card-body`, `.product-tagline`, `.product-chip`, `.product-order`, `.tagline[data-visible]` (uses Task 2/5 primitives).

- [ ] **Step 1: Create `src/ui.js`**

```js
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initUi() {
  revealOnScroll()
  initTagline()
  initCarousel()
}

function revealOnScroll() {
  const els = document.querySelectorAll('[data-reveal]')
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'))
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.15 }
  )
  els.forEach((el) => io.observe(el))
}

function initTagline() {
  const tag = document.querySelector('[data-tagline]')
  if (!tag) return
  const words = [...tag.querySelectorAll('[data-word]')]
  words.forEach((word, i) => {
    word.style.transitionDelay = `${i * 90}ms`
  })
  if (reduced || !('IntersectionObserver' in window)) {
    tag.setAttribute('data-visible', '')
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          tag.setAttribute('data-visible', '')
          io.disconnect()
        }
      }
    },
    { threshold: 0.4 }
  )
  io.observe(tag)
}

function initCarousel() {
  const root = document.querySelector('[data-carousel]')
  const track = root?.querySelector('[data-carousel-track]')
  const prev = root?.querySelector('[data-carousel-prev]')
  const next = root?.querySelector('[data-carousel-next]')
  if (!root || !track || !prev || !next) return
  const step = () =>
    track.querySelector('.carousel-card')?.getBoundingClientRect().width ?? 320
  prev.addEventListener('click', () =>
    track.scrollBy({ left: -(step() + 20), behavior: reduced ? 'auto' : 'smooth' })
  )
  next.addEventListener('click', () =>
    track.scrollBy({ left: step() + 20, behavior: reduced ? 'auto' : 'smooth' })
  )
}
```

- [ ] **Step 2: Append product card styles to `src/styles.css`**

```css
.product-card {
  background-color: #fffdf8;
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: 0 4px 20px rgb(51 46 41 / 0.06);
  transition: transform 0.2s var(--ease-organic), box-shadow 0.2s var(--ease-organic);
  display: flex;
  flex-direction: column;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgb(51 46 41 / 0.1);
}
.product-card:active {
  transform: scale(0.98);
}
.product-card-media {
  background-color: var(--pale);
  border-radius: 0 0 var(--radius-card) var(--radius-card);
  padding: 32px 24px;
  display: grid;
  place-items: center;
}
.product-card-media img {
  max-width: 100%;
  max-height: 240px;
  width: auto;
  height: auto;
  object-fit: contain;
}
.product-card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}
.product-card-body h3 {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.25rem;
  margin: 0;
  color: var(--accent);
}
.product-tagline {
  color: var(--color-ink-soft);
  font-size: 0.95rem;
  margin: 0;
}
.product-chip {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--accent);
  background-color: var(--pale);
  border-radius: 999px;
  padding: 4px 12px;
}
.product-order {
  margin-top: 8px;
  align-self: flex-start;
  background-color: var(--color-olive);
}
```

- [ ] **Step 3: Verify built output renders cards**

Run in `site/`:

```bash
npm run build && npm run dev
```

Open `http://localhost:5173`. Check:
1. `As nossas farinhas` shows 5 cards with per-product accent color on the name/chip and pale swatch behind the image.
2. Scroll arrows move the track one card at a time (smooth).
3. The tagline words animate into view once.
4. `[data-reveal]` sections (brand, steps, FAQ, final CTA) fade in.
5. No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/ui.js src/styles.css
git commit -m "feat: product cards with per-product palettes, carousel, scroll reveals"
```

---

### Task 9: Accessibility sweep — focus, labels, alt, contrast

**Files:**
- Modify: `site/index.html`, `site/src/main.js`, `site/src/styles.css` (small fixes)

**Interfaces:**
- Consumes: everything so far.
- Produces: keyboard-navigable carousel, named landmark regions, correct alt text, AA-contrast button text, visible focus ring on nav/hero/footer links, `aria-live` region for carousel state.

- [ ] **Step 1: Add `aria-live="polite"` and an `aria-describedby` to the carousel**

In `index.html`, change the catalog `<section …>` to:

```html
<section
  id="catalogo"
  class="catalogo"
  aria-labelledby="catalogo-titulo"
  data-carousel
>
  <div class="section-head" style="text-align:left">
    <h2 id="catalogo-titulo">As nossas farinhas</h2>
    <p>Escolhe a tua e toca em Encomendar. Usa as setas ou o teclado para navegar.</p>
  </div>
  <div
    class="carousel-track"
    data-carousel-track
    tabindex="0"
    role="list"
    aria-label="Carrossel de farinhas Terra Viva"
  ></div>
```

And update `renderCatalog()` in `main.js` to announce the focused card's name when focused:

```js
card.querySelector('.product-order')?.addEventListener('focus', () => {
  const note = document.querySelector('[data-live]')
  if (note) note.textContent = `${product.name}. Toca em Encomendar para abrir o WhatsApp.`
})
```

Add the live region right after the carousel controls in `index.html`:

```html
<p class="visually-hidden" data-live aria-live="polite"></p>
```

- [ ] **Step 2: Add `lang="pt"` body fallback and `aria-current` on active nav**

`index.html` already sets `lang="pt"` on `<html>`. Add `aria-current="page"` to the hero `#inicio` nav target by giving the logo link `aria-label="Terra Viva, início"`:

```html
<a class="nav-logo" href="#inicio" aria-label="Terra Viva, início">terra&nbsp;viva</a>
```

- [ ] **Step 3: Verify with an automated contrast + a11y spot check**

Run in `site/`:

```bash
npm run build
```

Then in the browser (Playwright) at `http://localhost:5173` run on load:

```js
const issues = []
document.querySelectorAll('a,button').forEach((el) => {
  const t = (el.getAttribute('aria-label') || el.textContent || '').trim()
  if (!t) issues.push(`no accessible name: ${el.outerHTML.slice(0, 80)}`)
})
console.log(issues.length ? issues : 'OK: all interactive elements have accessible names')
```

Expected: `OK: all interactive elements have accessible names`. Verify contrast ratio for `.wa-btn` (olive `#4A5D4E` on white) ≥ 4.5:1 (computed: ≈ 6.9:1) and body text `#332E29` on `#F5F2EB` (≈ 11:1).

- [ ] **Step 4: Commit**

```bash
git add index.html src/main.js src/styles.css
git commit -m "feat: carousel keyboard liveregion, accessible names, contrast check"
```

---

### Task 10: Visual QA at breakpoints + reduced-motion

**Files:**
- None (verification only, fix-up edits if needed)

**Interfaces:**
- Consumes: full page.

- [ ] **Step 1: Screenshot at 3 widths**

Run dev server, then capture the full page (Playwright) at `390x844`, `768x1024`, `1440x900` into `site/.qa/`.

Expected per width:
- Nav pill fully visible with `Encomendar`; hero fits without horizontal scroll; hero image scaled.
- Carousel cards show ≥ 2 cards on mobile with `snap-align: center`, arrows visible.
- Footer social icons render (concatenate brand SVGs — check none are empty).

- [ ] **Step 2: Simulate reduced motion**

Playwright `browser_emulate_media` with `reducedMotion: "reduce"`; check: no nudge animation on glyphs, no reveal transitions, carousel scroll is instant, `scroll-behavior: auto`.

- [ ] **Step 3: Console error check**

Open devtools console on load and after scrolling through the whole page. Expected: zero errors/warnings.

- [ ] **Step 4: Fix any visual regressions found** (edit `index.html`/`src/styles.css`), rebuild, re-screenshot.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: visual QA pass across breakpoints, reduced-motion verified"
```

---

### Task 11: Copy audit + founder-story gate + final build

**Files:**
- Modify: `site/index.html`, `site/src/data/products.js` (only if the copy audit changes text)

**Interfaces:**
- Consumes: the finished page.

- [ ] **Step 1: Copy audit against the spec & briefing rules**

Read the rendered page text and verify every line against section 2/10 of the spec: "tu" address, no exclamation marks, no invented claims, no exclamation endings, no hyphenated line breaks in `h1/h2/h3`, CTA label exactly `Encomendar`, hero H1 exact, tagline only `Nutre o que te move`, `Natural · Saudável · Real` only as eyebrow. List any fix needed and apply it.

- [ ] **Step 2: Founder-story + tagline-sub gate check**

Confirm with the user (this is a release gate, not a code change):
1. Founder story (`De um projeto escolar para a tua mesa`) — authorized by Elizabeth Miguel?
2. `Alimentos que nutrem corpo e vida.` tagline sub-line — confirmed?
If not yet authorized, keep built but exclude from the published build for v1 (delete or comment the two blocks + drop the matching FAQ schema Q if it references them) and file a follow-up note.

- [ ] **Step 3: Production build + smoke test**

```bash
npm run build
npm run preview &
```

Open the `preview` URL (default `http://localhost:4173`): full page renders, no 404s on any `/images/*.png` or `/Icone_Folha.png`, WhatsApp links open with correct prefilled text (`role="checkout"` external).

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: final copy audit and release gate"
```

---

## Self-Review

**1. Spec coverage:**

| Spec requirement | Where implemented |
|---|---|
| 1 winding-up WhatsApp CTA + contacts (IG/FB/YT) | Tasks 3, 4, 6, 7 |
| 2 tu-voice, IG-bio descriptors as eyebrow only | Task 4 (hero) + Task 6 (marca eyebrow) |
| 3 structure (nav/hero/tagline/marca/catalogo/passos/FAQ/CTA/footer) | Tasks 4, 6 |
| 4 colors + tokens + single olive accent for CTAs | Tasks 2, 5, 8 |
| 5 catalog data (weights incl. 81g Beterraba) + per-product palettes | Task 3, 8 |
| CTA "Encomendar" label + WhatsApp glyph + nudge | Tasks 4, 5, 7 (`.cta-nudge`) |
| 6 stack: Vite + Tailwind v4 + vanilla, @fontsource, Phosphor | Tasks 1, 7 (imports) |
| 7 motion: IO-only, scroll-snap, word reveal, reduced-motion | Tasks 2, 5, 8 |
| 8 a11y: skip link, focus, alt, carousel keyboard | Tasks 2, 9 |
| 9 SEO: title/meta/OG/favicon/FAQ JSON-LD | Task 4 |
| 10 copy rules | Task 11 (audit) |
| 11 out of scope (no Sorgo, no 3D, no payment) | respected — no code |
| 12 flags (81g set; founder story gated) | Task 3, Task 11 step 2 |

**2. Placeholder scan:** no TBD/TODO placeholders; the founder-story gate is a release decision, not a code placeholder. Footer legal links follow the spec note (see task 6). The `.product-card` background uses `#fffdf8` (clean card surface on cream).

**3. Type/name consistency:** `initUi` (defined Task 8, imported Task 7), `WA_GENERIC`/`orderLink`/`paletteColors` (defined Task 3, used Task 7), `brandIcon(name)` (Task 3, used Tasks 4/6/7), `data-carousel*` selectors (Task 6 markup ↔ Task 8 init + Task 7 render) — all matching. `data-wa-icon` with `data-ic` social variants wired in Task 7. `.cta-nudge` applied to nav+hero+final glyphs in Task 4 and reused by `renderCatalog` in Task 7.

**Known intentional deviations from the spec (flagged for the user):**
1. No "Privacidade/Termos" clickable links in footer — no such pages exist yet (would be dead links).
2. No `sitemap.xml`/`robots.txt` — no domain/hosting yet.
3. `og:image` and `theme-color` assume the site is served at the root of its domain.

Plan complete and saved to `site/docs/superpowers/plans/2026-09-23-terra-viva-landing.md`.