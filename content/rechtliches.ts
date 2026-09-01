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
    titel: 'Welche Daten diese Seite verarbeitet',
    absaetze: [
      'Diese Seite enthält kein Kontakt- oder Terminformular. Wir erheben keine Daten, die Sie selbst eingeben, und speichern nichts über Ihren Besuch hinaus.',
      'Wer Kontakt aufnehmen möchte, ruft an oder kommt vorbei. Für Anrufe gelten die üblichen Verbindungsdaten Ihres Telefonanbieters; darauf haben wir keinen Einfluss.',
    ],
  },
  {
    titel: 'Hosting',
    absaetze: [
      'Die Seite wird von Vercel Inc. gehostet. Beim Aufruf verarbeitet Vercel technisch notwendige Server-Logs, insbesondere IP-Adresse, Zeitpunkt, abgerufene Seite und Browserkennung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO, unser berechtigtes Interesse an einem sicheren und störungsfreien Betrieb.',
      'Dabei werden Daten auch in die USA übermittelt. Grundlage sind die Standardvertragsklauseln der Europäischen Kommission.',
    ],
  },
  {
    titel: 'Cookies und Reichweitenmessung',
    absaetze: [
      'Diese Seite setzt keine Cookies zu Analyse- oder Werbezwecken. Es findet keine Reichweitenmessung und kein Tracking statt. Deshalb gibt es auch kein Einwilligungsbanner.',
      'Der Kartendienst ist bewusst nicht eingebettet. Der Link „Route planen" öffnet Google Maps erst, wenn Sie ihn anklicken — vorher werden keine Daten an Google übertragen.',
      'Der Link zu Instagram öffnet die Seite ebenfalls erst beim Anklicken. Es ist kein Instagram-Inhalt eingebettet, es wird also nichts an Meta übertragen, solange Sie den Link nicht nutzen.',
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
