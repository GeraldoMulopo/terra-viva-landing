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
    use: 'Usa em papas, panquecas e nas receitas do dia a dia.',
  },
  {
    id: 'batata-doce',
    name: 'Farinha de Batata Doce',
    weight: '250g',
    tagline: 'nutrição que te acompanha todos os dias',
    image: '/images/Farinha_Batata_Doce.png',
    palette: 'cobre',
    use: 'Usa em papas, bolos e sobremesas.',
  },
  {
    id: 'beterraba',
    name: 'Farinha de Beterraba',
    weight: '81g',
    tagline: 'o teu dia pede escolhas que nutrem',
    image: '/images/Farinha_Beterraba.png',
    palette: 'bordeaux',
    use: 'Adiciona a bolos e papas.',
  },
  {
    id: 'inhame',
    name: 'Farinha de Inhame',
    weight: '250g',
    tagline: 'uma forma mais simples de nutrir o dia',
    image: '/images/Farinha_Inhame.png',
    palette: 'taupe',
    use: 'Usa em papas e pratos salgados.',
  },
  {
    id: 'mix',
    name: 'Mix de Farinha Raízes que Nutrem',
    weight: '250g',
    tagline: 'mistura. prepara. nutre',
    image: '/images/Mix_Raizes_Que_Nutrem.png',
    palette: 'terra',
    use: 'Usa em papas e nas tuas receitas.',
  },
]

const palettes = {
  olive: ['#4A5D4E', '#768A7A', '#A3B5A7'],
  cobre: ['#AC6A43', '#CE8E64', '#EFCEB8'],
  bordeaux: ['#6B2D43', '#9E5E72', '#D2A3B0'],
  taupe: ['#7A6A5E', '#9E8F84', '#D5CFC9'],
  terra: ['#5C4E43', '#8A7869', '#C4B5A5'],
}

export function paletteColors(palette) {
  return palettes[palette] ?? palettes.olive
}