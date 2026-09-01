import { Hero } from '@/components/hero/Hero'
import { Laufband } from '@/components/Laufband'
import { Anfahrt } from '@/components/anfahrt'
import { Arbeiten } from '@/components/sections/Arbeiten'
import { Leistungen } from '@/components/sections/Leistungen'
import { Oeffnungszeiten } from '@/components/sections/Oeffnungszeiten'
import { UeberDenSalon } from '@/components/sections/UeberDenSalon'

export default function Startseite() {
  return (
    <>
      <Hero />
      <Laufband />
      <Arbeiten />
      <Leistungen />
      <UeberDenSalon />
      <Oeffnungszeiten />
      <Anfahrt />
    </>
  )
}
