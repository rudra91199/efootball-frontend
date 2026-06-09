import { useEffect } from "react"

export default function useScrollReveal(className = "fade-in") {
  useEffect(() => {
    const elements = document.querySelectorAll(`.${className}`)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [className])
}
