import { useEffect, useRef } from 'react'
import anime from 'animejs'

const SVG_PATHS = {
  flower: 'M12 2C12 2 14 6 12 8C10 6 12 2 12 2ZM12 22C12 22 10 18 12 16C14 18 12 22 12 22ZM2 12C2 12 6 10 8 12C6 14 2 12 2 12ZM22 12C22 12 18 14 16 12C18 10 22 12 22 12ZM5.6 5.6C5.6 5.6 8.5 7.5 7.5 9.5C5.5 8.5 5.6 5.6 5.6 5.6ZM18.4 18.4C18.4 18.4 15.5 16.5 16.5 14.5C18.5 15.5 18.4 18.4 18.4 18.4ZM5.6 18.4C5.6 18.4 7.5 15.5 9.5 16.5C8.5 18.5 5.6 18.4 5.6 18.4ZM18.4 5.6C18.4 5.6 16.5 8.5 14.5 7.5C15.5 5.5 18.4 5.6 18.4 5.6Z',
  star: 'M12 2L14.4 9.2H22L16 13.5L18.4 20.8L12 16.5L5.6 20.8L8 13.5L2 9.2H9.6L12 2Z',
  shoe: 'M2 14C2 14 6 12 8 13L14 13C16 13 18 14 18 14L20 15C21 15 22 14 22 14L22 16C22 16 20 17 18 17L4 17C3 17 2 16 2 16L2 14ZM6 13L8 9L10 11L12 9L14 12L14 13',
  heart: 'M12 21C12 21 3 14 3 8C3 5.2 5.2 3 8 3C9.8 3 11.4 3.9 12 5.2C12.6 3.9 14.2 3 16 3C18.8 3 21 5.2 21 8C21 14 12 21 12 21Z',
}

const COLORS = ['#FF8B94', '#A2C2E8', '#FFD700', '#98E8C0', '#FFB3BA', '#7AAAD4', '#FF6B7A', '#C8DCEF']

function createParticleEl(svgPath, color, size) {
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('width', size)
  svg.setAttribute('height', size)
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.style.position = 'fixed'
  svg.style.pointerEvents = 'none'
  svg.style.zIndex = '9999'

  const path = document.createElementNS(ns, 'path')
  path.setAttribute('d', svgPath)
  path.setAttribute('fill', color)
  path.setAttribute('stroke', 'none')
  svg.appendChild(path)

  return svg
}

export default function ParticleExplosion({ trigger, onComplete }) {
  const hasRun = useRef(false)

  useEffect(() => {
    if (!trigger || hasRun.current) return
    hasRun.current = true

    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const count = 60
    const particles = []
    const container = document.body

    for (let i = 0; i < count; i++) {
      const pathKeys = Object.keys(SVG_PATHS)
      const pathKey = pathKeys[Math.floor(Math.random() * pathKeys.length)]
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const size = 16 + Math.random() * 24

      const el = createParticleEl(SVG_PATHS[pathKey], color, size)
      el.style.left = `${cx}px`
      el.style.top = `${cy}px`
      el.style.opacity = '1'
      el.style.transform = 'translate(-50%, -50%) scale(0)'
      container.appendChild(el)
      particles.push(el)
    }

    const tl = anime.timeline({
      complete: () => {
        particles.forEach((p) => {
          if (p.parentNode) p.parentNode.removeChild(p)
        })
        if (onComplete) onComplete()
      },
    })

    particles.forEach((el, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3
      const dist = 150 + Math.random() * 300
      const tx = Math.cos(angle) * dist
      const ty = Math.sin(angle) * dist

      tl.add(
        {
          targets: el,
          translateX: tx,
          translateY: ty,
          scale: [0, 1 + Math.random() * 0.5, 0],
          opacity: [1, 1, 0],
          rotate: Math.random() * 720 - 360,
          duration: 900 + Math.random() * 600,
          easing: 'easeOutExpo',
        },
        i * 8,
      )
    })

    // Radial ring burst
    for (let ring = 0; ring < 3; ring++) {
      const ns = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(ns, 'svg')
      const size = (ring + 1) * 200
      svg.setAttribute('width', size)
      svg.setAttribute('height', size)
      svg.setAttribute('viewBox', `0 0 ${size} ${size}`)
      svg.style.position = 'fixed'
      svg.style.left = `${cx - size / 2}px`
      svg.style.top = `${cy - size / 2}px`
      svg.style.pointerEvents = 'none'
      svg.style.zIndex = '9998'

      const circle = document.createElementNS(ns, 'circle')
      circle.setAttribute('cx', size / 2)
      circle.setAttribute('cy', size / 2)
      circle.setAttribute('r', size / 2 - 2)
      circle.setAttribute('fill', 'none')
      circle.setAttribute('stroke', COLORS[ring % COLORS.length])
      circle.setAttribute('stroke-width', '2')
      circle.setAttribute('opacity', '0.6')
      svg.appendChild(circle)
      document.body.appendChild(svg)

      anime({
        targets: svg,
        scale: [0, 2],
        opacity: [0.8, 0],
        duration: 800 + ring * 200,
        easing: 'easeOutExpo',
        delay: ring * 100,
        complete: () => {
          if (svg.parentNode) svg.parentNode.removeChild(svg)
        },
      })
    }
  }, [trigger, onComplete])

  return null
}
