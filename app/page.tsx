import { Hero } from '@/components/hero/Hero'
import { Laufband } from '@/components/Laufband'
import { Arbeiten } from '@/components/sections/Arbeiten'
import { Leistungen } from '@/components/sections/Leistungen'
import { OeffnungszeitenAnfahrt } from '@/components/sections/OeffnungszeitenAnfahrt'
import { UeberDenSalon } from '@/components/sections/UeberDenSalon'

export default function Startseite() {
  return (
    <>
      <Hero />
      <Laufband />
      <Arbeiten />
      <Leistungen />
      <UeberDenSalon />
      <OeffnungszeitenAnfahrt />
    </>
  )
}
