import '../content/index'
import { offeneHinweise } from '../content/todo'

const offen = offeneHinweise()
const streng = process.env.STRICT_CONTENT === '1'

if (offen.length === 0) {
  console.log('Content-Check: keine offenen Stellen.')
  process.exit(0)
}

console.log(`\nContent-Check: ${offen.length} offene Stelle(n):`)
for (const hinweis of offen) console.log(`  · ${hinweis}`)

if (streng) {
  console.error(
    '\nSTRICT_CONTENT=1 ist gesetzt: Der Build wird abgebrochen, ' +
      'damit keine Platzhalter oeffentlich gehen.\n',
  )
  process.exit(1)
}

console.log('\nDer Build laeuft weiter. Die Marker sind auf der Seite sichtbar.')
console.log('Vor dem Livegang STRICT_CONTENT=1 setzen.\n')
