export const isHolidaySeason = (): boolean => {
  const now = new Date()
  const month = now.getMonth()
  const day = now.getDate()

  // November (after Halloween - Nov 1st onwards)
  if (month === 10) return true

  // December (all month)
  if (month === 11) return true

  // Early January (1st through 15th)
  if (month === 0 && day <= 15) return true

  return false
}
