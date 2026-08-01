import { Hero } from '@/components/hero/Hero'
import { Leistungen } from '@/components/sections/Leistungen'
import { OeffnungszeitenAnfahrt } from '@/components/sections/OeffnungszeitenAnfahrt'
import { Team } from '@/components/sections/Team'
import { UeberDenSalon } from '@/components/sections/UeberDenSalon'

export default function Startseite() {
  return (
    <>
      <Hero />
      <Leistungen />
      <UeberDenSalon />
      <Team />
      <OeffnungszeitenAnfahrt />
    </>
  )
}
