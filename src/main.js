import './styles.css'
import { brandIcon } from './icons.js'

document.querySelectorAll('[data-icon]').forEach((el) => {
  const icon = brandIcon(el.dataset.icon, '')
  if (icon && !el.hasChildNodes()) el.innerHTML = icon
})

const navToggle = document.querySelector('[data-nav-toggle]')
const navMenu = document.querySelector('[data-nav-menu]')
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true'
    navToggle.setAttribute('aria-expanded', String(!expanded))
    navMenu.hidden = expanded
  })
}