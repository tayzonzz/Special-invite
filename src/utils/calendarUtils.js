export function generateICS(slot, eventDefaults) {
  const formatDate = (isoString) => {
    const d = new Date(isoString)
    const pad = (n) => String(n).padStart(2, '0')
    return (
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
      `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
    )
  }

  const uid = `perfect-run-${Date.now()}@theperfectrun.app`
  const now = formatDate(new Date().toISOString())
  const dtstart = formatDate(slot.isoStart)
  const dtend = formatDate(slot.isoEnd)

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Perfect Run//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${eventDefaults.title}`,
    `DESCRIPTION:${eventDefaults.description}`,
    `LOCATION:${eventDefaults.location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder - The Perfect Run is in 30 minutes!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return icsContent
}

export function downloadICS(slot, eventDefaults) {
  const content = generateICS(slot, eventDefaults)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'the-perfect-run.ics'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
