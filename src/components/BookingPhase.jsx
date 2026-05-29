import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import { RECOMMENDED_SLOTS } from '../config/scheduleConfig'

function SlotCard({ slot, selected, onSelect, index }) {
  const cardRef = useRef()

  useEffect(() => {
    anime({
      targets: cardRef.current,
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutExpo',
      delay: 200 + index * 120,
    })
  }, [index])

  const handleClick = () => {
    anime({
      targets: cardRef.current,
      scale: [1, 1.06, 0.98, 1.03, 1],
      duration: 500,
      easing: 'spring(1, 80, 12, 0)',
    })
    onSelect(slot.id)
  }

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`relative cursor-pointer rounded-3xl p-5 transition-all duration-300 group select-none ${
        selected
          ? 'ring-2 ring-tulip shadow-xl'
          : 'hover:shadow-lg hover:-translate-y-0.5'
      }`}
      style={{
        opacity: 0,
        background: selected
          ? 'linear-gradient(135deg, rgba(255,139,148,0.08), rgba(162,194,232,0.12))'
          : 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: selected
          ? '2px solid rgba(255,139,148,0.4)'
          : '1.5px solid rgba(255,255,255,0.7)',
        boxShadow: selected
          ? '0 8px 32px rgba(255,139,148,0.2), 0 2px 8px rgba(0,0,0,0.04)'
          : '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      {/* Selected check */}
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #FF8B94, #FF6B7A)' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Emoji icon */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-300 ${
          selected ? 'scale-110' : 'group-hover:scale-105'
        }`}
          style={{
            background: selected
              ? 'linear-gradient(135deg, rgba(255,139,148,0.2), rgba(162,194,232,0.2))'
              : 'rgba(244,247,245,0.8)',
          }}>
          {slot.emoji}
        </div>

        <div className="flex-1 min-w-0">
          {/* Badge */}
          <span className={`inline-block text-xs font-semibold font-display px-2.5 py-0.5 rounded-full mb-2 ${slot.badgeColor}`}>
            {slot.badge}
          </span>

          <h3 className="font-display font-bold text-slate-800 text-base leading-tight mb-1">
            {slot.title}
          </h3>
          <p className="text-slate-400 text-sm font-body mb-2">{slot.subtitle}</p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#A2C2E8" strokeWidth="1.5"/>
                <path d="M8 4.5V8L10.5 10.5" stroke="#A2C2E8" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-slate-500 text-xs font-body">{slot.displayTime}</span>
            </div>
            <span className="text-slate-300 text-xs">·</span>
            <span className="text-slate-400 text-xs font-body">{slot.duration}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPhase({ onConfirm }) {
  const [selectedId, setSelectedId] = useState(null)
  const [customTime, setCustomTime] = useState('')
  const containerRef = useRef()
  const headerRef = useRef()
  const buttonRef = useRef()

  useEffect(() => {
    anime({
      targets: headerRef.current,
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 700,
      easing: 'easeOutExpo',
      delay: 100,
    })
  }, [])

  useEffect(() => {
    if (buttonRef.current) {
      if (selectedId || customTime) {
        anime({
          targets: buttonRef.current,
          scale: [0.95, 1.04, 1],
          opacity: [0.5, 1],
          duration: 400,
          easing: 'spring(1, 80, 12, 0)',
        })
      }
    }
  }, [selectedId, customTime])

  const handleConfirm = () => {
    if (!selectedId && !customTime) return

    let slot = RECOMMENDED_SLOTS.find((s) => s.id === selectedId)
    if (!slot && customTime) {
      slot = {
        id: 'custom',
        title: 'Custom Time',
        displayTime: customTime,
        isoStart: customTime,
        isoEnd: customTime,
      }
    }

    anime({
      targets: buttonRef.current,
      scale: [1, 1.08, 1],
      duration: 300,
      easing: 'easeInOutQuad',
    })

    anime({
      targets: containerRef.current,
      opacity: [1, 0],
      translateY: [0, -20],
      duration: 500,
      easing: 'easeInExpo',
      delay: 200,
      complete: () => onConfirm(slot),
    })
  }

  const isReady = selectedId || customTime.length > 0

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto hide-scrollbar py-8 px-4"
      style={{ background: 'linear-gradient(160deg, #F4F7F5 0%, #EDF2F7 100%)' }}
    >
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div ref={headerRef} style={{ opacity: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-5 shadow-sm">
            <span>🎯</span>
            <span className="text-xs font-semibold text-slate-500 font-display tracking-widest uppercase">
              Select Your Starting Block
            </span>
          </div>
          <h2 className="font-display font-bold text-slate-800 mb-3 leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 2.8rem)' }}>
            Awesome!{' '}
            <span style={{
              background: 'linear-gradient(135deg, #A2C2E8, #7AAAD4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              When works
            </span>{' '}
            for you?
          </h2>
          <p className="text-slate-500 font-body text-base">
            Pick a time slot and lock in our run date 🏃‍♂️
          </p>
        </div>

        {/* Slot cards */}
        <div className="space-y-3 mb-6">
          {RECOMMENDED_SLOTS.map((slot, i) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              selected={selectedId === slot.id}
              onSelect={(id) => {
                setSelectedId(id)
                setCustomTime('')
              }}
              index={i}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-xs font-body">or suggest your own</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Custom time input */}
        <div
          className="rounded-3xl p-4 mb-8"
          style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(16px)',
            border: customTime ? '2px solid rgba(162,194,232,0.5)' : '1.5px solid rgba(255,255,255,0.7)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          <label className="block text-xs font-semibold text-slate-400 font-display uppercase tracking-wider mb-2 px-1">
            Custom Date & Time
          </label>
          <input
            type="datetime-local"
            value={customTime}
            onChange={(e) => {
              setCustomTime(e.target.value)
              setSelectedId(null)
            }}
            className="w-full bg-transparent text-slate-700 font-body text-sm outline-none py-1 px-1 cursor-pointer"
            style={{ colorScheme: 'light' }}
          />
        </div>

        {/* Confirm button */}
        <div className="pb-8">
          <button
            ref={buttonRef}
            onClick={handleConfirm}
            disabled={!isReady}
            className="w-full py-5 rounded-2xl font-display font-bold text-white text-lg transition-all duration-200 relative overflow-hidden"
            style={{
              background: isReady
                ? 'linear-gradient(135deg, #A2C2E8 0%, #7AAAD4 50%, #5E93C2 100%)'
                : 'rgba(200,210,220,0.6)',
              boxShadow: isReady
                ? '0 8px 32px rgba(162,194,232,0.5), 0 2px 8px rgba(0,0,0,0.06)'
                : 'none',
              opacity: isReady ? 1 : 0.6,
              cursor: isReady ? 'pointer' : 'not-allowed',
              transform: 'scale(1)',
            }}
          >
            <span className="flex items-center justify-center gap-3">
              <span>Secure the Date</span>
              <span className="text-xl">🔒</span>
            </span>
            {/* Shine overlay */}
            {isReady && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)',
                  transform: 'skewX(-20deg) translateX(-100%)',
                  animation: 'shine 3s ease-in-out infinite',
                }}
              />
            )}
          </button>

          {!isReady && (
            <p className="text-center text-slate-400 text-sm mt-3 font-body">
              Select a time slot above to continue ☝️
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: skewX(-20deg) translateX(-200%); }
          100% { transform: skewX(-20deg) translateX(400%); }
        }
      `}</style>
    </div>
  )
}
