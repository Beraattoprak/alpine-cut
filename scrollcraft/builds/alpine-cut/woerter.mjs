/**
 * Deutsch nach Englisch. Einzige Quelle fuer beide Sprachen.
 *
 * Gebraucht wird das beim Bauen: uebersetzen.mjs erzeugt daraus die
 * englische Seite. Zur Laufzeit wird nichts mehr getauscht — jede Sprache
 * hat ihre eigene Adresse, damit Suchmaschinen beide finden.
 *
 * Was NICHT uebersetzt wird:
 * - die Kundenstimmen. Ein Zitat uebersetzt man nicht, sonst steht dort
 *   etwas, das der Mensch nie geschrieben hat. Die Zeitangaben daneben schon,
 *   die sind kein Zitat.
 * - Impressum und Datenschutz: auf Deutsch rechtsverbindlich.
 * - Betraege, Eigennamen, Adresse.
 */
export const WOERTER = {
    /* --- Kopf und Fuss --- */
    'Vorbeikommen': 'Walk in',
    'Alpine Cut · Dorf-Platz 1 · 6263 Fügen': 'Alpine Cut · Dorf-Platz 1 · 6263 Fügen, Austria',
    'Impressum': 'Legal notice (German)',
    'Datenschutz': 'Privacy (German)',

    /* --- Ankunft --- */
    'Ihr Friseur im Zillertal': 'Your barber in the Zillertal',
    'Ohne Termin, einfach vorbeikommen': 'No appointment, just walk in',

    /* --- Der Ort --- */
    'Ihr Friseur im Zillertal.': 'Your barber in the Zillertal.',
    'Alpine Cut ist Ihr Friseurladen im Zillertal, mitten in Fügen zwischen den Bergen. Wir schneiden Damen und Herren, dazu Bart, Farbe und Pflege. Einen Termin brauchen Sie nicht, kommen Sie einfach vorbei.':
      'Alpine Cut is your barber shop in the Zillertal, in the middle of Fügen between the mountains. We cut women and men, and do beards, colour and care. You do not need an appointment, just come by.',

    'Unser Schwerpunkt sind Fades, vom weichen Übergang bis zum Skin Fade. Ein junges Team, das jeden Tag schneidet — und genau deshalb weiß, wo der Verlauf sitzen muss.':
    'Fades are what we do best, from a soft taper to a skin fade. A young team that cuts every day — which is exactly why we know where the blend belongs.',
  'Viele unserer Gäste sind auf Urlaub im Zillertal. Im Laden sprechen wir Deutsch, Englisch und Ungarisch. Sagen Sie einfach, was Sie möchten.':
    'Many of our guests are on holiday in the Zillertal. In the shop we speak German, English and Hungarian. Just tell us what you would like.',

  /* --- Preise --- */
    'Preise': 'Prices',
    'Für genauere Preisinfos einfach': 'For exact prices, just give us a',
    'anrufen': 'call',
    'Herren': 'Men',
    'Damen': 'Women',
    'Preise ansehen': 'See prices',
    'Karte zurücklegen': 'Put the card back',
    'Schnitt, Bart und Pflege': 'Cut, beard and care',
    'Maschinenhaarschnitt': 'Clipper cut',
    'Musterhaarschnitt': 'Hair pattern',
    'Bartrasur': 'Beard shave',
    'Maschinenbartrasur': 'Clipper beard trim',
    'Musterbartrasur': 'Beard pattern',
    'Waschen, Schneiden, Föhnen': 'Wash, cut, blow-dry',
    'Waschen und Föhnen': 'Wash and blow-dry',
    'Wachs': 'Wax',
    'Black Mask': 'Black mask',
    'Kopfmassage': 'Head massage',
    'Schnitt und Styling, nach Haarlänge': 'Cut and styling, by hair length',
    'Behandlung': 'Treatment',
    'Kurz': 'Short',
    'bis Ohr': 'to the ear',
    'Mittel': 'Medium',
    'bis Schulter': 'to the shoulder',
    'Lang': 'Long',
    'ab Schulter': 'past the shoulder',
    'Extra lang': 'Extra long',
    'bis Linie': 'to the line',
    'Waschen & Föhnen': 'Wash & blow-dry',
    'Waschen & Legen': 'Wash & set',
    'Waschen, Schneiden & Föhnen': 'Wash, cut & blow-dry',
    'Waschen & Schneiden': 'Wash & cut',

    /* --- Aus dem Stuhl --- */
    'Aus dem Stuhl': 'From the chair',
    'Ein Blick auf unsere Arbeit.': 'A look at our work.',
    'Crop mit Bart': 'Crop with beard',
    'Textur im Deckhaar': 'Textured top',
    'Lang, blondiert': 'Long, blonded',

    /* --- Unser Salon --- */
    'Unser Salon': 'Our salon',
    'Angenehme Atmosphäre für Ihren Aufenthalt.': 'A pleasant place to spend your time.',
    'Die Bedienplätze': 'The chairs',
    'Warten wie im Wohnzimmer': 'Waiting like at home',

    /* --- Kundenstimmen --- */
    'Was unsere Kunden sagen': 'What our customers say',
    'Nachzulesen im': 'Read them on our',
    'Google-Profil': 'Google profile',
    '(öffnet in einem neuen Tab)': '(opens in a new tab)',
    'vor 3 Tagen': '3 days ago',
    'vor 3 Wochen': '3 weeks ago',
    'vor einem Monat': 'a month ago',
    'vor 3 Monaten': '3 months ago',

    /* --- Vorbeikommen --- */
    'Einfach vorbeikommen': 'Just walk in',
    '6263 Fügen, Tirol': '6263 Fügen, Tyrol, Austria',
    'Montag 10 bis 18 Uhr': 'Monday 10am to 6pm',
    'Dienstag bis Freitag 9 bis 18 Uhr': 'Tuesday to Friday 9am to 6pm',
    'Samstag 9 bis 16 Uhr': 'Saturday 9am to 4pm',
    'Route planen': 'Get directions',

    /* --- Alternativtexte und Beschriftungen --- */
    'Der Salon von außen: Holzfassade am Dorf-Platz, das Alpine-Cut-Logo im Schaufenster.':
      'The salon from outside: wooden facade on Dorf-Platz, the Alpine Cut logo in the window.',
    'Herrenschnitt, hoher Fade an der Seite, längeres Deckhaar nach hinten frisiert.':
      "Men's cut, high fade at the side, longer top swept back.",
    'Herrenschnitt, texturierter Crop mit Bart, Übergang an der Schläfe.':
      "Men's cut, textured crop with beard, fade at the temple.",
    'Herrenschnitt, weicher Übergang im Nacken, welliges Deckhaar.':
      "Men's cut, soft taper at the neck, wavy top.",
    'Herrenschnitt von hinten, langes texturiertes Deckhaar, tiefer Übergang im Nacken.':
      "Men's cut from behind, long textured top, low taper at the neck.",
    'Damenschnitt, langes blondiertes Haar mit weichem Verlauf, von hinten.':
      "Women's cut, long blonded hair with a soft graduation, from behind.",
    'Drei Bedienplätze mit weiß-goldenen Stühlen unter wabenförmiger Deckenbeleuchtung.':
      'Three chairs in white and gold under honeycomb ceiling lights.',
    'Wartebereich mit schwarzen Chesterfield-Sofas und Messingfüßen am Schaufenster.':
      'Waiting area with black Chesterfield sofas on brass feet by the window.',
    'Herrenpreise': "Men's prices",
    'Damenpreise, waagrecht scrollbar': "Women's prices, scrolls sideways",
    'Vorherige Bewertungen': 'Previous reviews',
    'Weitere Bewertungen': 'More reviews',
    '5 von 5 Sternen': '5 out of 5 stars',
    'Auf Deutsch umschalten': 'Switch to German',
    'Switch to English': 'Switch to English',

    /* --- Kopfdaten der Seite --- */
  'Friseur in Fügen im Zillertal. Haarschnitt für Damen und Herren, Bart und Pflege — ohne Termin, einfach vorbeikommen. Dorf-Platz 1, 6263 Fügen in Tirol.':
    'Barber in Fügen in the Zillertal. Haircuts for women and men, beards and care — no appointment, just walk in. Dorf-Platz 1, 6263 Fügen, Tyrol, Austria.',
  'Das Logo von Alpine Cut: ein Berg über dem Schriftzug, die Schere als U in CUT.':
    'The Alpine Cut logo: a mountain above the wordmark, the scissors as the U in CUT.',
    'Alpine Cut · Friseur in Fügen im Zillertal': 'Alpine Cut · Barber in Fügen, Zillertal',
};
