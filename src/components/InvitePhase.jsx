import { useRef, useEffect, useState, useCallback } from 'react'
import anime from 'animejs'
import FloralScene from './FloralScene'
import NoModal from './NoModal'
import ParticleExplosion from './ParticleExplosion'

export default function InvitePhase({ onYes }) {
  const mouse = useRef([0, 0])
  const noButtonRef = useRef()
  const yesButtonRef = useRef()
  const headerRef = useRef()
  const containerRef = useRef()

  const [modalVisible, setModalVisible] = useState(false)
  const [noScale, setNoScale] = useState(1)
  const [noAttempts, setNoAttempts] = useState(0)
  const [particleTrigger, setParticleTrigger] = useState(false)
  const [isExploding, setIsExploding] = useState(false)

  const noPositionRef = useRef({ x: 0, y: 0 })
  const isMovingRef = useRef(false)

  // Entrance animation
  useEffect(() => {
    anime({
      targets: headerRef.current,
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutExpo',
      delay: 300,
    })
    anime({
      targets: [yesButtonRef.current, noButtonRef.current],
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutExpo',
      delay: anime.stagger(150, { start: 600 }),
    })
  }, [])

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -((e.clientY / window.innerHeight) * 2 - 1)
      mouse.current = [nx, ny]
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const evadeNoButton = useCallback(() => {
    if (!noButtonRef.current || isMovingRef.current) return
    isMovingRef.current = true

    const btn = noButtonRef.current
    const rect = btn.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const margin = 80

    let newX, newY
    let attempts = 0

    do {
      newX = margin + Math.random() * (vw - margin * 2 - rect.width)
      newY = margin + Math.random() * (vh - margin * 2 - rect.height)
      attempts++
    } while (
      attempts < 20 &&
      Math.abs(newX - noPositionRef.current.x) < 100 &&
      Math.abs(newY - noPositionRef.current.y) < 100
    )

    noPositionRef.current = { x: newX, y: newY }

    anime({
      targets: btn,
      left: `${newX}px`,
      top: `${newY}px`,
      duration: 400,
      easing: 'spring(1, 90, 12, 0)',
      complete: () => {
        isMovingRef.current = false
      },
    })
  }, [])

  // Init NO button position
  useEffect(() => {
    if (!noButtonRef.current) return
    const btn = noButtonRef.current
    btn.style.position = 'fixed'
    const rect = btn.getBoundingClientRect()
    const baseX = window.innerWidth / 2 + 80
    const baseY = window.innerHeight / 2 + 80
    btn.style.left = `${baseX}px`
    btn.style.top = `${baseY}px`
    noPositionRef.current = { x: baseX, y: baseY }

    const handlePointerMove = (e) => {
      if (!noButtonRef.current) return
      const r = noButtonRef.current.getBoundingClientRect()
      const pad = 24
      if (
        e.clientX >= r.left - pad &&
        e.clientX <= r.right + pad &&
        e.clientY >= r.top - pad &&
        e.clientY <= r.bottom + pad
      ) {
        evadeNoButton()
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [evadeNoButton])

  const handleNoClick = () => {
    const attempts = noAttempts + 1
    setNoAttempts(attempts)
    setNoScale((prev) => Math.max(prev * 0.85, 0.3))
    setModalVisible(true)
    evadeNoButton()
  }

  const handleYesClick = () => {
    if (isExploding) return
    setIsExploding(true)

    // YES button springy scale
    anime({
      targets: yesButtonRef.current,
      scale: [1, 1.3, 0.9, 1.1, 1],
      duration: 500,
      easing: 'easeInOutElastic(1, 0.6)',
    })

    setParticleTrigger(true)
  }

  const handleParticleComplete = () => {
    // Fade out entire container
    anime({
      targets: containerRef.current,
      opacity: [1, 0],
      translateY: [0, -20],
      duration: 500,
      easing: 'easeInExpo',
      complete: onYes,
    })
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #F4F7F5 0%, #EDF2F7 50%, #F0F4F8 100%)' }}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <FloralScene mouse={mouse} />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(244,247,245,0.3) 0%, rgba(244,247,245,0.6) 60%, rgba(244,247,245,0.85) 100%)',
        }}
      />

      {/* Header content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        <div ref={headerRef} style={{ opacity: 0 }} className="text-center mb-12">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6 shadow-sm">
            <span className="text-base">💌</span>
            <span className="text-xs font-semibold text-slate-500 font-display tracking-widest uppercase">
              A Special Invitation
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display font-bold text-slate-800 leading-tight mb-4 select-none"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>
            Will you go on a{' '}
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #FF8B94, #A2C2E8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              run
            </span>{' '}
            with me?
          </h1>

          {/* Subtitle */}
          <p className="text-slate-500 font-body text-lg max-w-md mx-auto leading-relaxed">
            Scenic routes, good company, and maybe a post-run treat 🧁
          </p>

          {/* Decorative flowers row */}
          <div className="flex justify-center gap-3 mt-5 text-2xl select-none">
            {['🌸', '🌺', '💐', '🌸', '🌼'].map((f, i) => (
              <span
                key={i}
                className="animate-float"
                style={{ animationDelay: `${i * 0.3}s`, display: 'inline-block' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* YES Button — stationary center */}
        <button
          ref={yesButtonRef}
          onClick={handleYesClick}
          disabled={isExploding}
          style={{ opacity: 0 }}
          className="relative z-20 group cursor-pointer select-none"
        >
          <div
            className="px-12 py-5 rounded-2xl font-display font-bold text-white text-xl shadow-xl transition-all duration-200 group-hover:shadow-2xl group-hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #FF8B94 0%, #FF6B7A 50%, #E85D6B 100%)',
              boxShadow: '0 8px 32px rgba(255, 139, 148, 0.5), 0 2px 8px rgba(255, 107, 122, 0.3)',
            }}
          >
            <span className="flex items-center gap-3">
              <span>YES! 🏃‍♂️</span>
            </span>
          </div>
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, #FF8B94, #FF6B7A)',
              filter: 'blur(20px)',
              zIndex: -1,
            }}
          />
        </button>

        {/* Keyboard hint */}
        <p className="mt-8 text-slate-400 text-xs font-body select-none z-20 relative">
          There's also a "No" option floating around somewhere... 👀
        </p>
      </div>

      {/* NO Button — absolutely positioned, evasive */}
      <button
        ref={noButtonRef}
        onClick={handleNoClick}
        className="select-none cursor-pointer z-30"
        style={{
          transform: `scale(${noScale})`,
          transformOrigin: 'center',
          opacity: 0,
          transition: 'transform 0.3s ease',
        }}
      >
        <div
          className="px-8 py-4 rounded-2xl font-display font-semibold text-slate-500 text-base"
          style={{
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(200,200,200,0.5)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}
        >
          No {noAttempts > 0 && `(attempt ${noAttempts})`}
        </div>
      </button>

      {/* Modal */}
      <NoModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {/* Particle explosion */}
      <ParticleExplosion trigger={particleTrigger} onComplete={handleParticleComplete} />
    </div>
  )
}
