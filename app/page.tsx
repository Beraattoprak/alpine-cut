import { Hero } from '@/components/hero/Hero'
import { Laufband } from '@/components/Laufband'
import { Anfahrt } from '@/components/anfahrt'
import { Einblick } from '@/components/sections/Einblick'
import { Leistungen } from '@/components/sections/Leistungen'
import { Oeffnungszeiten } from '@/components/sections/Oeffnungszeiten'
import { UeberDenSalon } from '@/components/sections/UeberDenSalon'

export default function Startseite() {
  return (
    <>
      <Hero />
      <Laufband />
      <Einblick />
      <Leistungen />
      <UeberDenSalon />
      <Oeffnungszeiten />
      <Anfahrt />
    </>
  )
}
