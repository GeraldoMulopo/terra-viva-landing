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