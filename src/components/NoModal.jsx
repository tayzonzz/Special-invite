import { useEffect, useRef } from 'react'
import anime from 'animejs'

const PEONY_SVG = (
  <svg viewBox="0 0 120 120" width="120" height="120" className="mx-auto">
    {/* Petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <ellipse
        key={i}
        cx={60 + Math.cos((angle * Math.PI) / 180) * 22}
        cy={60 + Math.sin((angle * Math.PI) / 180) * 22}
        rx="16"
        ry="24"
        fill={i % 2 === 0 ? '#FF8B94' : '#FFB3BA'}
        opacity="0.9"
        transform={`rotate(${angle}, ${60 + Math.cos((angle * Math.PI) / 180) * 22}, ${60 + Math.sin((angle * Math.PI) / 180) * 22})`}
      />
    ))}
    {/* Inner petals */}
    {[22, 67, 112, 157, 202, 247].map((angle, i) => (
      <ellipse
        key={`i${i}`}
        cx={60 + Math.cos((angle * Math.PI) / 180) * 13}
        cy={60 + Math.sin((angle * Math.PI) / 180) * 13}
        rx="11"
        ry="16"
        fill={i % 2 === 0 ? '#FF6B7A' : '#FF8B94'}
        opacity="0.95"
        transform={`rotate(${angle}, ${60 + Math.cos((angle * Math.PI) / 180) * 13}, ${60 + Math.sin((angle * Math.PI) / 180) * 13})`}
      />
    ))}
    {/* Center */}
    <circle cx="60" cy="60" r="12" fill="#FFD4D7" />
    <circle cx="60" cy="60" r="7" fill="#FF8B94" />
    {/* Stamens */}
    {[0, 60, 120, 180, 240, 300].map((a, i) => (
      <circle
        key={`s${i}`}
        cx={60 + Math.cos((a * Math.PI) / 180) * 4}
        cy={60 + Math.sin((a * Math.PI) / 180) * 4}
        r="2"
        fill="#FFD700"
      />
    ))}
  </svg>
)

export default function NoModal({ visible, onClose }) {
  const modalRef = useRef()
  const contentRef = useRef()

  useEffect(() => {
    if (visible && contentRef.current) {
      anime({
        targets: contentRef.current,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 600,
        easing: 'spring(1, 80, 10, 0)',
      })

      // Animate the flower
      anime({
        targets: '.peony-modal-flower',
        rotate: ['-10deg', '10deg'],
        duration: 1200,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine',
      })
    }
  }, [visible])

  const handleClose = () => {
    if (contentRef.current) {
      anime({
        targets: contentRef.current,
        scale: [1, 0],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInBack',
        complete: onClose,
      })
    } else {
      onClose()
    }
  }

  if (!visible) return null

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(244, 247, 245, 0.85)', backdropFilter: 'blur(12px)' }}
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="glass-strong rounded-3xl p-8 max-w-sm w-[90%] text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ opacity: 0 }}
      >
        {/* Error badge */}
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-500 text-xs font-semibold font-display tracking-wider uppercase">
            System Error 404
          </span>
        </div>

        <div className="peony-modal-flower mb-4">{PEONY_SVG}</div>

        <h3 className="font-display font-bold text-xl text-slate-800 mb-2 leading-tight">
          Selection Unavailable
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-1">
          This option has been permanently disabled by the universe.
        </p>
        <p className="text-tulip font-semibold text-sm mb-6">
          Enjoy this peony instead 🌸
        </p>

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mb-6">
          {['#FF8B94', '#A2C2E8', '#FFD700', '#98E8C0'].map((c, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ background: c, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3 rounded-2xl font-display font-semibold text-white text-sm transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #FF8B94, #FF6B7A)',
            boxShadow: '0 4px 20px rgba(255, 139, 148, 0.4)',
          }}
        >
          Maybe YES is better 😉
        </button>
      </div>
    </div>
  )
}
