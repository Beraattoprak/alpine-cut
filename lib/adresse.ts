import { salon } from '@/content'

/**
 * Eine einzige Quelle für alles, was aus der Adresse abgeleitet wird.
 * Die Adresse selbst steht in content/salon.ts und wird hier nur formatiert —
 * nirgends im Code darf sie ein zweites Mal getippt werden.
 */
export const adresseEinzeilig = `${salon.strasse}, ${salon.plz} ${salon.ort}, Österreich`

const kodiert = encodeURIComponent(adresseEinzeilig)

/** Eingebettete Karte. Wird erst nach ausdrücklicher Zustimmung geladen. */
export const kartenEinbettungUrl = `https://www.google.com/maps?q=${kodiert}&output=embed`

/** Öffnet Google Maps in einem neuen Tab, überträgt vorher nichts. */
export const routenUrl = `https://www.google.com/maps/dir/?api=1&destination=${kodiert}`
