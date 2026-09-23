# Terra Viva — Landing page (design)

Data: 2026-09-23

## 1. Objetivo

Landing page para **conhecer a Terra Viva** e **encomendar farinhas**.
Uma oferta, um público, uma ação primária: **encomendar via WhatsApp** (`+244 975 627 885`).

- A página apresenta a empresa (essência, slogan, origem angolana).
- O catálogo mostra as farinhas num **carrossel de imagens** (scroll-snap), sem 3D/WebGL.
- Cada farinha tem o botão **Encomendar** que abre o WhatsApp com a mensagem pré-preenchida.
- Botão "Encomendar" também no topo (hero) e no CTA final.
- Contactos: WhatsApp `+244 975 627 885`, Instagram `@terraviva.ao`,
  Facebook `facebook.com/768613552982425`, YouTube `@terraviva.angola`.

## 2. Público e voz

- Público: consumidores em Angola que querem uma alimentação mais natural e prática.
  Perfil IG confirma: adultos/jovens que cuidam da alimentação, quem procura opções
  sem glúten, famílias (papas, lanches), fitness/bem-estar e quem valoriza marcas
  locais angolanas.
- Linguagem da marca no IG (biografia): "Natural · Saudável · Real". Usada apenas como
  descritores na secção "A marca" — nunca como slogan (slogan oficial do kit de
  identidade: "Nutre o que te move").
- Tratamento: **"tu"** (coerente com os taglines das embalagens).
- Tom: humano, acolhedor, inspirador, próximo, prático. Não institucional, não técnico,
  não publicitário decorado.
- Eixo central: slogan **"Nutre o que te move"** (trabalho, estudos, treino, família, sonhos).
- Regras do briefing (mandam):
  - Não vender a farinha — mostrar o que se consegue fazer com ela, o produto aparece
    naturalmente através da vida.
  - Sem números inventados, sem clichés de IA ("elevate", "seamless"...), sem pontos de exclamação.
  - Frases curtas, voz ativa, específicas.
  - Sem hífen quebrado no fim de linha; sem palavras órfãs (`text-wrap: balance/pretty`).

## 3. Estrutura da página

1. **Nav** — logo "terra viva" + botão "Encomendar" (pill flutuante).
2. **Hero** — headline `Farinhas para a vida que fazes todos os dias.` + sub
   `Raízes e tubérculos de Angola, transformados em farinhas simples de entrar na tua
   rotina.` + CTA WhatsApp (com ícone) + visual (grupo de farinhas `Todas_Farinhas.png`).
3. **Tagline reveal** — "Nutre o que te move" como declaração de página inteira; palavras
   ativam-se uma a uma ao entrar no viewport (IntersectionObserver por palavra).
4. **A marca** — essência + história. Descritores da biografia IG:
   "natural · saudável · real". História da fundadora: Elizabeth Miguel começou a
   Terra Viva aos 19 anos, como projeto escolar, com 6 mil Kz, e foi construindo a
   marca com aprendizagem e persistência (documentado no IG/YouTube — **exige
   autorização da fundadora antes de publicar**). Feitas em Angola a partir de
   raízes, tubérculos e frutos. Sem pressão, real e possível. Visual: imagem do Mix
   sobre fundo creme (recorte fotográfico simples).
5. **Catálogo (carrossel)** — 5 farinhas, scroll-snap horizontal. Cada ficha:
   imagem transparente do doypack sobre fundo creme, nome, tagline real, peso,
   botão **Encomendar** (WhatsApp pré-preenchido).
6. **Como encomendar** — fluxo mínimo de 3 passos: escolhe a farinha → clica em
   **Encomendar** (abre o WhatsApp com a mensagem já preenchida) → confirmas como
   receber. Sem perguntas no site.
7. **FAQ mínimo** — 3 perguntas de resposta curta (entrega, pagamento, como usar/
   conservar). A regra central: clicar em "Encomendar" leva direto à mensagem
   pré-preenchida no WhatsApp, sem fricção.
8. **CTA final** — repete o botão WhatsApp.
9. **Rodapé** — contacto (WhatsApp `+244 975 627 885`) e redes sociais:
   Instagram (`https://www.instagram.com/terraviva.ao`), Facebook
   (`https://www.facebook.com/768613552982425`), YouTube
   (`https://youtube.com/@terraviva.angola`), copyright, privacidade/termos.

Layout de secções variado (sem repetir o mesmo tipo de layout em mais de uma secção):
hero split, tagline full-width typográfico, "a marca" texto+imagem, carrossel, 3 passos,
FAQ acordeão, CTA centrado.

## 4. Sistema visual

### Cores
- Fundo global: creme `#F5F2EB` (fundo comum da embalagem). Página **só em modo claro**
  (identidade da marca é chapada/prelo; "casual chic").
- Texto primário: `#332E29` (castanho-quente escuro).
- Texto secundário/neutro: tons quentes derivados (ex. `#6E675F`).
- Acento único (CTAs, interações): verde-oliva `#4A5D4E`.
- Paletas por produto (kit de identidade):
  - Banana Verde: `#4A5D4E` `#768A7A` `#A3B5A7`
  - Batata Doce: `#AC6A43` `#CE8E64` `#EFCEB8`
  - Beterraba: `#6B2D43` `#9E5E72` `#D2A3B0`
  - Inhame: `#7A6A5E` `#9E8F84` `#D5CFC9`
  - Mix Raízes: `#5C4E43` `#8A7869` `#C4B5A5`
  - (futuro) Sorgo: `#9A583C` `#C18760` `#E3BA9B`

### Tipografia
- Montserrat (Light/Regular) — títulos, nomes de produto.
- Inter (Regular/Light) — texto corrido.
- Auto-alojadas via `@fontsource` (nunca Google Fonts link em produção).

### Estilo
- Minimalista "casual chic": muito respiro, cor da terra, ondas orgânicas sutis
  (eco ao "grafismo de ondas" das embalagens) como decoração.
- Sem gradients em fundos. Sem bordas num só lado. Sem sombras pretas (sombras tingidas).
- Hero: texto do cabeçalho com gradiente vertical `#332E29 → #8a857c` (variação quente
  da regra light-theme); max-width 680px com quebras significativas.
- Cantos: escala única (ex. 16px cards / pill buttons), fórmula de raio aninhado.
- Ícones: Phosphor (`@phosphor-icons/web`), uma família só.

## 5. Dados do catálogo

| Produto | Peso | Tagline (da embalagem) | Paleta |
|---|---|---|---|
| Farinha de Banana Verde | 250g | "para uma rotina mais leve e nutritiva" | olive |
| Farinha de Batata Doce | 250g | "nutrição que te acompanha todos os dias" | cobre |
| Farinha de Beterraba | 81g | "o teu dia pede escolhas que nutrem" | bordeaux |
| Farinha de Inhame | 250g | "uma forma mais simples de nutrir o dia" | taupe |
| Mix de Farinha Raízes que Nutrem | 250g | "mistura. prepara. nutre" | terra |
| (futuro) Farinha de Sorgo | 250g | "mais nutrição, mais possibilidades" | argila |

WhatsApp: `https://wa.me/244975627885`
Genérico: `?text=Olá, quero encomendar farinhas Terra Viva.`
Por produto: `?text=Olá, quero encomendar 1x <Produto> (<peso>).`

### Botão "Encomendar" (CTA)
- Rótulo único em toda a página: `Encomendar` (sem "no WhatsApp").
- O canal WhatsApp é sinalizado pelo **glifo do WhatsApp dentro do botão** (ícone) + o
  número visível junto ao botão primário (ex. legenda `via WhatsApp · +244 975 627 885`).
- **Animação de affordance**: no hero e no CTA final, o glifo de WhatsApp do botão faz um
  pequeno movimento (nudge/bounce) periódico e discreto a indicar "é aqui que encomendas",
  pausado com `prefers-reduced-motion`. Hover: o glifo desliza/balança ligeiramente.

Nota: os 5 PNG transparentes em `site/public/` são as imagens dos cards.
`Todas_Farinhas.png` (grupo) usado no hero.

## 6. Stack técnica

- **Vite + Tailwind v4** (plugin `@tailwindcss/vite`) + **vanilla JS** (sem React).
- Build estático; deploy em qualquer host (Netlify/Vercel/partilhado).
- Dependências mínimas: `@tailwindcss/vite`, `@fontsource/montserrat`,
  `@fontsource/inter`, `@phosphor-icons/web`.
- Estrutura do projeto em `site/` (Vite). Assets copiados para `site/public/`.

## 7. Motion

- Reveals com IntersectionObserver (fade + subir; `translate-y` + `opacity`), 800ms+,
  easing `cubic-bezier(0.32,0.72,0,1)`.
- Carrossel: CSS `scroll-snap` com botões de seta (rolagem programática suave).
- Hover: elevação leve (sombra tingida + leve translate). `:active` scale 0.98.
- Tagline reveal: palavra a palavra ao cruzar a linha de gatilho.
- **Nunca** `window.addEventListener('scroll')`. Tudo com IntersectionObserver / IO por
  palavra / scroll-snap. `prefers-reduced-motion` respeitado (colapsa para estático).

## 8. Acessibilidade

- HTML semântico (`nav`, `main`, `section`, `footer`), skip link, focus rings visíveis.
- Alt text em todas as imagens com significado.
- Contraste WCAG AA (4.5:1 corpo). Estado completo: hover/active/focus; erros inline.
- Carrossel navegável por setas e teclado.

## 9. SEO / AEO

- Página indexável (empresa + catálogo evergreen): `<title>`, meta description,
  `og:image`, favicon, `sitemap.xml`/`robots.txt` se houver domínio.
- **Favicon**: `Icone_Folha.png` (ícone de folha, transparente) como `rel="icon"`.
- FAQ schema (JSON-LD) com perguntas reais.

## 10. Conteúdo: regras de escrita (briefing)

- Mostrar vida com a farinha, não listar benefícios.
- Nos CTAs: verbo + o que se obtém, mas com rótulo curto. `Encomendar` + glifo de
  WhatsApp e animação de affordance a comunicar o canal e a ação.
- FAQ e "Como encomendar" escritos em linguagem do cliente, diretos.

## 11. Fora de escopo (v1)

- 3D/WebGL (decisão do utilizador: carrossel de imagens; 3D pode ser fase 2).
- Pagamento online, formulários, backend, login.
- Multi-página.
- Farinha de Sorgo (adicionada quando houver imagem própria).

## 12. Flags / a confirmar

- Peso da Beterraba: 81g (confirmado pelo cliente).
- Copy final sujeita a revisão com o cliente.
- Nenhum dado de prova inventado: sem depoimentos/números fabricados.
- FAQ mínimo (3 perguntas curtas); respostas de entrega/pagamento a validar com a
  marca (se necessário, ajustadas durante o build).
- História da fundadora (Elizabeth Miguel, 19 anos, projeto escolar, 6 mil Kz):
  texto só entra em produção com autorização expressa da fundadora.
- Descritores "Natural · Saudável · Real" vêm da biografia do Instagram; texto
  sujeito a confirmação.