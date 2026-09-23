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