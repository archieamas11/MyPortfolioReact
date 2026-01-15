interface Animation {
  name: string
  css: string
}

const getPositionCoords = () => ({ cx: '24', cy: '4' })

const generateSVG = () => {
  const { cx, cy } = getPositionCoords()
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="${cx}" cy="${cy}" r="18" fill="white" filter="url(%23blur)"/></svg>`
}

const getTransformOrigin = () => '60% 10%'

export const createAnimation = (): Animation => {
  const svg = generateSVG()
  const transformOrigin = getTransformOrigin()
  const maskPosition = '60% 5%'

  return {
    name: 'theme-transition',
    css: `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-new(root) {
        mask: url('${svg}') ${maskPosition} / 0 no-repeat;
        mask-origin: content-box;
        animation-name: scale-reveal;
        transform-origin: ${transformOrigin};
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      @keyframes scale-reveal {
        to {
          mask-size: 350vmax;
        }
      }
    `,
  }
}
