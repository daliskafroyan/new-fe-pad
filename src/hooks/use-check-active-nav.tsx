import { useLocation } from 'react-router-dom'

export default function useCheckActiveNav() {
  const { pathname } = useLocation()

  const checkActiveNav = (nav: string) => {
    // Remove leading slash from nav and pathname
    const cleanNav = nav.replace(/^\//, '')
    const cleanPath = pathname.replace(/^\//, '')

    if (cleanNav === '/' && cleanPath === '') return true

    // Check if the cleaned nav matches the start of the cleaned path
    return cleanPath.startsWith(cleanNav)
  }

  return { checkActiveNav }
}
