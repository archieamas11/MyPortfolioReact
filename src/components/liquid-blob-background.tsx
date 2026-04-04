export function LiquidBlobBackground() {
  return (
    <div aria-hidden className="liquid-blob-stage pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="liquid-blob liquid-blob--1 absolute">
        <div className="liquid-blob-core" />
      </div>
      <div className="liquid-blob liquid-blob--2 absolute">
        <div className="liquid-blob-core" />
      </div>
      <div className="liquid-blob-vignette absolute inset-0" />
    </div>
  )
}
