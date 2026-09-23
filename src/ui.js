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