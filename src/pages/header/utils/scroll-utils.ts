import { SCROLL_TOP_OFFSET } from '../constants'

export const scrollToElement = (href: string): void => {
  if (href === '#hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const targetElement = document.querySelector(href)
  if (targetElement) {
    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - SCROLL_TOP_OFFSET
    window.scrollTo({ top: offsetTop, behavior: 'smooth' })
  }
}
