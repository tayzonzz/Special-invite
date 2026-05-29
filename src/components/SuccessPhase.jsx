import { useEffect, useRef } from 'react'
import anime from 'animejs'

function PuppyIllustration() {
  return (
    <svg viewBox="0 0 200 220" width="200" height="220" className="mx-auto">
      {/* Body */}
      <ellipse cx="100" cy="150" rx="42" ry="48" fill="#C8A882" />
      {/* Head */}
      <circle cx="100" cy="90" r="36" fill="#C8A882" />
      {/* Ears */}
      <ellipse cx="70" cy="72" rx="14" ry="20" fill="#B8946E" transform="rotate(-15,70,72)" />
      <ellipse cx="130" cy="72" rx="14" ry="20" fill="#B8946E" transform="rotate(15,130,72)" />
      {/* Inner ears */}
      <ellipse cx="70" cy="73" rx="8" ry="13" fill="#D4936E" transform="rotate(-15,70,73)" />
      <ellipse cx="130" cy="73" rx="8" ry="13" fill="#D4936E" transform="rotate(15,130,73)" />
      {/* Eyes */}
      <circle cx="88" cy="85" r="7" fill="#3D2B1F" />
      <circle cx="112" cy="85" r="7" fill="#3D2B1F" />
      <circle cx="90" cy="83" r="2.5" fill="white" />
      <circle cx="114" cy="83" r="2.5" fill="white" />
      {/* Nose */}
      <ellipse cx="100" cy="97" rx="7" ry="5" fill="#5D3A2A" />
      {/* Mouth */}
      <path d="M93 102 Q100 108 107 102" stroke="#5D3A2A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Tongue */}
      <ellipse cx="100" cy="108" rx="5" ry="4" fill="#FF8B94" />
      {/* Tactical cap */}
      <rect x="70" y="60" width="60" height="18" rx="6" fill="#2D4A3E" />
      <rect x="62" y="72" width="76" height="8" rx="4" fill="#1E3329" />
      <rect x="120" y="64" width="20" height="14" rx="3" fill="#3D6B57" />
      {/* Cap patch - flower */}
      <circle cx="85" cy="67" r="5" fill="#A2C2E8" />
      <circle cx="85" cy="67" r="2" fill="#7AAAD4" />
      {/* Running uniform - top */}
      <rect x="72" y="134" width="56" height="38" rx="8" fill="#A2C2E8" />
      {/* Uniform number */}
      <text x="100" y="158" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Space Grotesk, sans-serif">01</text>
      {/* Uniform accent stripes */}
      <rect x="72" y="138" width="56" height="4" rx="0" fill="#7AAAD4" opacity="0.5" />
      {/* Arms */}
      <ellipse cx="63" cy="155" rx="10" ry="20" fill="#C8A882" transform="rotate(-20,63,155)" />
      <ellipse cx="137" cy="155" rx="10" ry="20" fill="#C8A882" transform="rotate(20,137,155)" />
      {/* Paws */}
      <circle cx="56" cy="170" r="9" fill="#B8946E" />
      <circle cx="144" cy="170" r="9" fill="#B8946E" />
      {/* Legs */}
      <rect x="80" y="188" width="16" height="22" rx="8" fill="#C8A882" />
      <rect x="104" y="188" width="16" height="22" rx="8" fill="#C8A882" />
      {/* Running shoes */}
      <ellipse cx="88" cy="212" rx="14" ry="7" fill="#FF8B94" />
      <ellipse cx="112" cy="212" rx="14" ry="7" fill="#FF8B94" />
      {/* Banner held by paws */}
      <rect x="32" y="158" width="136" height="28" rx="6" fill="white" stroke="#A2C2E8" strokeWidth="2" />
      <text x="100" y="177" textAnchor="middle" fill="#3D6B57" fontSize="9.5" fontWeight="bold" fontFamily="Space Grotesk, sans-serif">
        It&apos;s an official date! 🎉
      </text>
      {/* Banner poles */}
      <rect x="34" y="148" width="3" height="18" rx="1.5" fill="#C8A882" />
      <rect x="163" y="148" width="3" height="18" rx="1.5" fill="#C8A882" />
      {/* Tail */}
      <path d="M138 188 Q158 175 152 158" stroke="#C8A882" strokeWidth="12" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function FloralDecor({ className }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      {/* Hydrangea cluster */}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
        <circle
          key={i}
          cx={40 + Math.cos((angle * Math.PI) / 180) * 20}
          cy={40 + Math.sin((angle * Math.PI) / 180) * 20}
          r="10"
          fill={i % 3 === 0 ? '#A2C2E8' : i % 3 === 1 ? '#C8DCEF' : '#7AAAD4'}
          opacity="0.8"
        />
      ))}
      <circle cx="40" cy="40" r="10" fill="#B8D0E8" />
    </svg>
  )
}

export default function SuccessPhase({ selectedSlot }) {
  const containerRef = useRef()
  const puppyRef = useRef()
  const confettiRef = useRef()
  const textRef = useRef()
  const cardsRef = useRef()

  useEffect(() => {
    // Entrance sequence
    const tl = anime.timeline({ easing: 'easeOutExpo' })

    tl.add({
      targets: containerRef.current,
      opacity: [0, 1],
      duration: 500,
    })
    .add({
      targets: puppyRef.current,
      scale: [0, 1.1, 0.95, 1],
      opacity: [0, 1],
      duration: 800,
      easing: 'spring(1, 80, 10, 0)',
    }, '-=200')
    .add({
      targets: textRef.current,
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 600,
    }, '-=400')
    .add({
      targets: '.success-card',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 500,
      delay: anime.stagger(120),
    }, '-=300')

    // Continuous puppy bounce
    anime({
      targets: puppyRef.current,
      translateY: [0, -8, 0],
      duration: 2000,
      loop: true,
      easing: 'easeInOutSine',
      delay: 1000,
    })

    // Confetti burst
    const confettiEl = confettiRef.current
    if (confettiEl) {
      for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div')
        const colors = ['#FF8B94', '#A2C2E8', '#FFD700', '#98E8C0', '#FFB3BA']
        dot.style.cssText = `
          position: absolute;
          width: ${4 + Math.random() * 6}px;
          height: ${4 + Math.random() * 6}px;
          border-radius: 50%;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          left: 50%;
          top: 0;
          pointer-events: none;
        `
        confettiEl.appendChild(dot)
        anime({
          targets: dot,
          translateX: (Math.random() - 0.5) * 300,
          translateY: -50 - Math.random() * 200,
          opacity: [1, 0],
          duration: 1500 + Math.random() * 1000,
          easing: 'easeOutExpo',
          delay: Math.random() * 500,
          complete: () => dot.remove(),
        })
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto hide-scrollbar"
      style={{
        opacity: 0,
        background: 'linear-gradient(160deg, #F4F7F5 0%, #EDF2F7 60%, #F0ECF7 100%)',
      }}
    >
      {/* Confetti source */}
      <div ref={confettiRef} className="fixed top-1/4 left-1/2 pointer-events-none z-50" />

      <div className="max-w-lg mx-auto px-5 py-10 text-center">
        {/* Floral decorations */}
        <div className="flex justify-center gap-4 mb-2 opacity-50">
          <FloralDecor className="w-10 h-10 animate-float" />
          <FloralDecor className="w-8 h-8 animate-float" style={{ animationDelay: '0.4s' }} />
          <FloralDecor className="w-10 h-10 animate-float" style={{ animationDelay: '0.8s' }} />
        </div>

        {/* Success badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(162,194,232,0.2), rgba(255,139,148,0.15))',
            border: '1.5px solid rgba(162,194,232,0.4)',
          }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold font-display text-slate-600 tracking-widest uppercase">
            Date Confirmed
          </span>
        </div>

        {/* Puppy illustration */}
        <div ref={puppyRef} style={{ opacity: 0 }} className="mb-6">
          <PuppyIllustration />
        </div>

        {/* Success text */}
        <div ref={textRef} style={{ opacity: 0 }}>
          <h2 className="font-display font-bold text-slate-800 mb-3 leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
            We&apos;re officially{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF8B94, #A2C2E8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              running!
            </span>
          </h2>
          <p className="text-slate-500 font-body text-base mb-8 leading-relaxed">
            I&apos;ll see you at the starting line. Wear your best gear! 👟
          </p>
        </div>

        {/* Info cards */}
        <div className="space-y-3 mb-8">
          {/* Calendar card */}
          <div
            className="success-card rounded-2xl p-4 text-left flex items-center gap-4"
            style={{
              opacity: 0,
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.7)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(162,194,232,0.3), rgba(162,194,232,0.1))' }}>
              📅
            </div>
            <div>
              <p className="font-display font-semibold text-slate-800 text-sm">Calendar Invite Downloaded</p>
              <p className="text-slate-400 text-xs font-body mt-0.5">
                {selectedSlot?.displayTime || 'Your date is locked in!'}
              </p>
            </div>
            <div className="ml-auto">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="rgba(76,175,80,0.15)" stroke="rgba(76,175,80,0.4)" strokeWidth="1.5"/>
                <path d="M6 10L9 13L14 7" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Email card */}
          <div
            className="success-card rounded-2xl p-4 text-left flex items-center gap-4"
            style={{
              opacity: 0,
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.7)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(255,139,148,0.3), rgba(255,139,148,0.1))' }}>
              💌
            </div>
            <div>
              <p className="font-display font-semibold text-slate-800 text-sm">Notification Sent</p>
              <p className="text-slate-400 text-xs font-body mt-0.5">Confirmation delivered to the organizer</p>
            </div>
            <div className="ml-auto">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="rgba(76,175,80,0.15)" stroke="rgba(76,175,80,0.4)" strokeWidth="1.5"/>
                <path d="M6 10L9 13L14 7" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Details card */}
          <div
            className="success-card rounded-2xl p-4 text-left"
            style={{
              opacity: 0,
              background: 'linear-gradient(135deg, rgba(162,194,232,0.1), rgba(255,139,148,0.08))',
              border: '1.5px solid rgba(162,194,232,0.3)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🏃‍♂️</span>
              <p className="font-display font-semibold text-slate-700 text-sm">The Perfect Run Details</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">📍</span>
                <span className="text-slate-500 text-xs font-body">To Be Confirmed (Picked up by yours truly)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">👟</span>
                <span className="text-slate-500 text-xs font-body">Dress code: Your favorite running gear</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">💐</span>
                <span className="text-slate-500 text-xs font-body">Flowers may or may not be present</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer emoji row */}
        <div className="flex justify-center gap-3 text-2xl">
          {['🌸', '👟', '💨', '🌺', '🏆'].map((e, i) => (
            <span
              key={i}
              className="animate-float select-none"
              style={{ animationDelay: `${i * 0.25}s`, display: 'inline-block' }}
            >
              {e}
            </span>
          ))}
        </div>

        <p className="text-slate-300 text-xs font-body mt-6">
          The Perfect Run · v1.0 · Made with 💙
        </p>
      </div>
    </div>
  )
}
