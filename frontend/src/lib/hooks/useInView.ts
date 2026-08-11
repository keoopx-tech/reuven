import { useEffect, useRef, useState } from 'react'

/**
 * Observa un elemento y marca `inView = true` la primera vez que entra en
 * el viewport. Se desconecta después (revelado único, no repite en cada scroll).
 */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(node)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px', ...options }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}
