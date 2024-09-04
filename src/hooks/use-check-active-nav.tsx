import { useLocation } from 'react-router-dom'

export default function useCheckActiveNav() {
  const { pathname } = useLocation()

  const checkActiveNav = (nav: string) => {
    const cleanNav = nav.replace(/^\//, '')
    const cleanPath = pathname.replace(/^\//, '')

    if (cleanNav === '/' && cleanPath === '') return true

    return cleanPath.startsWith(cleanNav)
  }

  return { checkActiveNav }
}
