import { salon } from './salon'
import { type Offen, todo } from './todo'

export type Rechtsabschnitt = { titel: string; absaetze: Offen<string>[] }

const anschrift = `${salon.name}, ${salon.strasse}, ${salon.plz} ${salon.ort}, Österreich`

export const impressum: Rechtsabschnitt[] = [
  {
    titel: 'Medieninhaber und Betreiber',
    absaetze: [
      anschrift,
      `Telefon: ${salon.telefon}`,
      todo('Impressum: E-Mail-Adresse eintragen'),
      todo(
        'Impressum: Inhaber, Rechtsform und — falls vorhanden — Firmenbuchnummer und Firmenbuchgericht eintragen',
      ),
      todo('Impressum: UID-Nummer eintragen, falls umsatzsteuerpflichtig'),
    ],
  },
  {
    titel: 'Gewerbe und Aufsicht',
    absaetze: [
      todo(
        'Impressum: Gewerbewortlaut und zuständige Gewerbebehörde (voraussichtlich Bezirkshauptmannschaft Schwaz) bestätigen',
      ),
      'Mitglied der Wirtschaftskammer Tirol, Landesinnung der Friseure.',
      'Anwendbare Rechtsvorschrift: Gewerbeordnung 1994, abrufbar unter ris.bka.gv.at.',
    ],
  },
  {
    titel: 'Streitbeilegung',
    absaetze: [
      'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: ec.europa.eu/consumers/odr',
      'Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    ],
  },
  {
    titel: 'Haftung für Inhalte und Links',
    absaetze: [
      'Die Inhalte dieser Seite werden mit Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität übernehmen wir keine Gewähr.',
      'Für Inhalte externer Links ist ausschließlich deren Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.',
    ],
  },
]

export const datenschutz: Rechtsabschnitt[] = [
  {
    titel: 'Verantwortlicher',
    absaetze: [
      anschrift,
      `Telefon: ${salon.telefon}`,
      todo('Datenschutz: E-Mail-Adresse für Datenschutzanfragen eintragen'),
    ],
  },
  {
    titel: 'Terminanfragen über das Formular',
    absaetze: [
      'Wenn Sie das Formular absenden, verarbeiten wir Ihren Namen, Ihre Telefonnummer, die gewünschte Leistung und Ihren Wunschtermin.',
      'Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO — die Anfrage ist eine vorvertragliche Maßnahme — sowie Art. 6 Abs. 1 lit. f DSGVO, unser berechtigtes Interesse an der Bearbeitung von Terminwünschen.',
      'Die Angaben erreichen uns per E-Mail. Wir bewahren sie so lange auf, wie es für die Terminvereinbarung nötig ist, und löschen sie spätestens nach sechs Monaten, sofern keine gesetzliche Aufbewahrungspflicht besteht.',
      'Die Angabe der Daten ist freiwillig. Ohne Namen und Telefonnummer können wir den Termin allerdings nicht bestätigen.',
    ],
  },
  {
    titel: 'Auftragsverarbeiter',
    absaetze: [
      'Den Versand der Formular-E-Mails übernimmt Resend (Plus Five Five, Inc., San Francisco, USA). Dabei werden die von Ihnen eingegebenen Daten in die USA übermittelt. Grundlage sind die Standardvertragsklauseln der Europäischen Kommission.',
      'Die Seite wird von Vercel Inc. gehostet. Beim Aufruf verarbeitet Vercel technisch notwendige Server-Logs, insbesondere IP-Adresse, Zeitpunkt, abgerufene Seite und Browserkennung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO, unser berechtigtes Interesse an einem sicheren und störungsfreien Betrieb.',
    ],
  },
  {
    titel: 'Cookies und Reichweitenmessung',
    absaetze: [
      'Diese Seite setzt keine Cookies zu Analyse- oder Werbezwecken. Es findet keine Reichweitenmessung und kein Tracking statt. Deshalb gibt es auch kein Einwilligungsbanner.',
      'Der Kartendienst ist bewusst nicht eingebettet. Der Link „Route planen" öffnet Google Maps erst, wenn Sie ihn anklicken — vorher werden keine Daten an Google übertragen.',
      'Schriften werden von unserem eigenen Server ausgeliefert, nicht von einem Drittanbieter.',
    ],
  },
  {
    titel: 'Ihre Rechte',
    absaetze: [
      'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wenden Sie sich dafür an die oben genannten Kontaktdaten.',
      'Wenn Sie sich beschweren möchten, können Sie sich an die Österreichische Datenschutzbehörde wenden: Barichgasse 40–42, 1030 Wien, dsb.gv.at.',
    ],
  },
]
