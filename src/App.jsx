import { useState, useCallback } from 'react'
import InvitePhase from './components/InvitePhase'
import BookingPhase from './components/BookingPhase'
import SuccessPhase from './components/SuccessPhase'
import { APP_CONFIG } from './config/scheduleConfig'
import { downloadICS } from './utils/calendarUtils'
import emailjs from '@emailjs/browser'

const PHASES = { INVITE: 'invite', BOOKING: 'booking', SUCCESS: 'success' }

export default function App() {
  const [phase, setPhase] = useState(PHASES.INVITE)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const handleYes = useCallback(() => {
    setPhase(PHASES.BOOKING)
  }, [])

  const handleConfirm = useCallback(async (slot) => {
    setSelectedSlot(slot)

    // 1. Download .ics calendar file
    try {
      downloadICS(slot, APP_CONFIG.eventDefaults)
    } catch (err) {
      console.warn('ICS download failed:', err)
    }

    // 2. Send EmailJS notification (fire-and-forget)
    const { serviceId, templateId, publicKey } = APP_CONFIG.emailJS
    if (serviceId !== 'YOUR_EMAILJS_SERVICE_ID') {
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            selected_time: slot.displayTime,
            slot_title: slot.title,
            slot_start: slot.isoStart,
            slot_end: slot.isoEnd,
          },
          publicKey,
        )
      } catch (err) {
        console.warn('EmailJS send failed (check config):', err)
      }
    }

    setPhase(PHASES.SUCCESS)
  }, [])

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {phase === PHASES.INVITE && <InvitePhase onYes={handleYes} />}
      {phase === PHASES.BOOKING && <BookingPhase onConfirm={handleConfirm} />}
      {phase === PHASES.SUCCESS && <SuccessPhase selectedSlot={selectedSlot} />}
    </div>
  )
}
