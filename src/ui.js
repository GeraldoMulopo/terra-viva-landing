import { products, paletteColors, WA_NUMBER } from './data/products.js'

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initUi() {
  revealOnScroll()
  initTagline()
  initCarousel()
  initModals()
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
  const behavior = () => (reduced ? 'auto' : 'smooth')
  const step = () =>
    track.querySelector('.carousel-card')?.getBoundingClientRect().width ?? 320
  const originals = [...track.children]
  const count = originals.length
  if (count > 0) {
    for (const card of originals) {
      const clone = card.cloneNode(true)
      clone.setAttribute('aria-hidden', 'true')
      clone.tabIndex = -1
      track.append(clone)
    }
  }
  const span = () => step() + 20
  const advance = (dir) => {
    const scrollLeft = track.scrollLeft
    if (dir > 0) {
      const nextPos = scrollLeft + span()
      if (nextPos >= count * span()) track.scrollTo({ left: nextPos - count * span(), behavior: 'auto' })
      else track.scrollBy({ left: span(), behavior: behavior() })
    } else {
      const nextPos = scrollLeft - span()
      if (nextPos < 0) track.scrollTo({ left: nextPos + count * span(), behavior: 'auto' })
      else track.scrollBy({ left: -span(), behavior: behavior() })
    }
  }
  prev.addEventListener('click', () => advance(-1))
  next.addEventListener('click', () => advance(1))
  if (reduced) return
  let timer = 0
  let modalActive = false
  const play = () => {
    if (modalActive) return
    if (!timer) timer = window.setInterval(() => advance(1), 6000)
  }
  const pause = () => {
    window.clearInterval(timer)
    timer = 0
  }
  root.addEventListener('mouseenter', pause)
  root.addEventListener('mouseleave', play)
  root.addEventListener('focusin', () => {
    if (root.contains(document.activeElement)) pause()
  })
  root.addEventListener('focusout', (e) => {
    if (!e.relatedTarget || !root.contains(e.relatedTarget)) play()
  })
  window.addEventListener('orderblock', () => {
    modalActive = true
    pause()
  })
  window.addEventListener('orderunblock', () => {
    modalActive = false
    play()
  })
  play()
}

function openDialog(dialog) {
  if (!dialog || typeof dialog.showModal !== 'function' || dialog.open) return
  dialog.showModal()
  document.documentElement.classList.add('modal-open')
  window.dispatchEvent(new Event('orderblock'))
}
function closeDialog(dialog) {
  if (!dialog || !dialog.open) return
  dialog.close()
  if (!document.querySelector('dialog[open]')) {
    document.documentElement.classList.remove('modal-open')
    window.dispatchEvent(new Event('orderunblock'))
  }
}

function renderOrderList() {
  const list = document.querySelector('[data-order-list]')
  if (!list || list.children.length) return
  const rows = products
    .map((product, i) => {
      const [accentColor, , pale] = paletteColors(product.palette)
      return `
      <div class="order-row" style="--accent:${accentColor};--pale:${pale}">
        <label class="order-row-check">
          <input type="checkbox" data-check="${i}" />
          <span class="order-row-media">
            <img src="${product.image}" alt="Embalagem de ${product.name} Terra Viva" width="200" />
          </span>
          <span class="order-row-info">
            <strong>${product.name}</strong>
            <small>${product.weight}</small>
          </span>
        </label>
        <div class="order-qty">
          <button type="button" class="qty-btn" data-minus="${i}" aria-label="Menos ${product.name}" disabled>−</button>
          <span class="qty-value" data-qty="${i}">1</span>
          <button type="button" class="qty-btn" data-plus="${i}" aria-label="Mais ${product.name}" disabled>+</button>
        </div>
      </div>
    `
    })
    .join('')
  list.innerHTML = rows
}

function initOrderModal() {
  const dialog = document.querySelector('[data-modal="order"]')
  const openBtn = document.querySelector('[data-open-order]')
  const form = dialog?.querySelector('[data-order-form]')
  const submit = dialog?.querySelector('[data-order-submit]')
  const status = dialog?.querySelector('[data-order-status]')
  if (!dialog || !openBtn || !form || !submit) return
  renderOrderList()

  const checks = () => [...dialog.querySelectorAll('[data-check]')]
  const qtyFor = (i) => {
    const el = dialog.querySelector(`[data-qty="${i}"]`)
    return el ? Number(el.textContent) || 1 : 1
  }
  const sync = () => {
    const picked = checks().filter((c) => c.checked)
    checks().forEach((c, i) => {
      const row = c.closest('.order-row')
      row.querySelectorAll('.qty-btn').forEach((b) => (b.disabled = !c.checked))
    })
    submit.disabled = picked.length === 0
    if (status) {
      status.textContent =
        picked.length === 0
          ? 'Nenhuma farinha escolhida.'
          : `${picked.length} ${picked.length === 1 ? 'farinha escolhida' : 'farinhas escolhidas'}.`
    }
  }
  checks().forEach((c) => c.addEventListener('change', sync))
  dialog.querySelectorAll('[data-plus]').forEach((b) =>
    b.addEventListener('click', () => {
      const i = Number(b.dataset.plus)
      const el = dialog.querySelector(`[data-qty="${i}"]`)
      el.textContent = Math.min(20, qtyFor(i) + 1)
    })
  )
  dialog.querySelectorAll('[data-minus]').forEach((b) =>
    b.addEventListener('click', () => {
      const i = Number(b.dataset.minus)
      const el = dialog.querySelector(`[data-qty="${i}"]`)
      el.textContent = Math.max(1, qtyFor(i) - 1)
    })
  )
  openBtn.addEventListener('click', () => openDialog(dialog))
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDialog(dialog)
  })
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const picked = checks()
      .filter((c) => c.checked)
      .map((c, order) => ({ order, product: products[Number(c.dataset.check)], qty: qtyFor(Number(c.dataset.check)) }))
      .sort((a, b) => a.order - b.order)
    if (picked.length === 0) return
    const lines = ['Olá, quero encomendar:']
    for (const item of picked) {
      lines.push(`- ${item.qty}x ${item.product.name} (${item.product.weight})`)
    }
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.rel = 'noopener'
    a.click()
    closeDialog(dialog)
  })
  sync()
}

function initDetailModal() {
  const dialog = document.querySelector('[data-modal="detail"]')
  const nameEl = dialog?.querySelector('[data-detail-name]')
  const body = dialog?.querySelector('[data-detail-body]')
  if (!dialog || !nameEl || !body) return
  const open = (id) => {
    const product = products.find((p) => p.id === id)
    if (!product) return
    const [accentColor, , pale] = paletteColors(product.palette)
    nameEl.textContent = product.name
    body.innerHTML = `
      <div class="detail-media" style="--accent:${accentColor};--pale:${pale}">
        <img src="${product.image}" alt="Embalagem de ${product.name} Terra Viva" width="1000" />
      </div>
      <p class="product-tagline">${product.tagline}</p>
      <span class="product-chip">${product.weight}</span>
      <p class="detail-use">${product.use}</p>
    `
    dialog.dataset.product = product.id
    openDialog(dialog)
  }
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.carousel-card')
    if (card && !card.classList.contains('is-clone')) open(card.dataset.id)
  })
  document.addEventListener('keydown', (e) => {
    const card = e.target.closest('.carousel-card')
    if (card && !card.classList.contains('is-clone') && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      open(card.dataset.id)
    }
  })
}

function initModals() {
  initOrderModal()
  initDetailModal()
  document.querySelectorAll('.modal-close').forEach((b) => {
    const dialog = b.closest('dialog')
    b.addEventListener('click', () => closeDialog(dialog))
  })
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('close', () => {
      if (!document.querySelector('dialog[open]')) {
        document.documentElement.classList.remove('modal-open')
        window.dispatchEvent(new Event('orderunblock'))
      }
    })
  })
}