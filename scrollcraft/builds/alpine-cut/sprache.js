/* Deutsch / Englisch umschalten.
   ---------------------------------------------------------------------------
   Die Seite steht auf Deutsch im HTML. Ohne Skript bleibt sie deutsch und
   vollstaendig — das ist der Grund, warum hier nichts doppelt im Markup liegt
   und es keine zweite Datei gibt: eine Preisliste, die an zwei Stellen
   gepflegt werden muss, geht irgendwann auseinander.

   Beim Start wird jeder Textknoten einmal besucht und sein deutsches Original
   am Knoten hinterlegt. Umschalten heisst danach nur noch zuweisen.

   Was NICHT uebersetzt wird:
   - die Kundenstimmen selbst. Ein Zitat uebersetzt man nicht, sonst steht dort
     etwas, das der Mensch nie geschrieben hat. Sie tragen lang="de", damit ein
     Vorleser sie auch im englischen Modus deutsch spricht.
   - Impressum und Datenschutz. Die sind auf Deutsch rechtsverbindlich; die
     Verweise sagen im englischen Modus dazu, dass die Seiten deutsch sind.
   - Betraege, Eigennamen, Adresse.
*/
(function () {
  'use strict';

  var WOERTER = {
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
    'Alpine Cut · Friseur im Zillertal': 'Alpine Cut · Barber in the Zillertal',
  };

  var ATTRIBUTE = ['alt', 'aria-label', 'title'];
  var textknoten = [];
  var attributknoten = [];

  /* Zitate bleiben, wie sie geschrieben wurden. */
  function istZitat(el) {
    return !!(el && el.closest && el.closest('[data-nicht-uebersetzen]'));
  }

  function sammeln() {
    var lauf = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = lauf.nextNode())) {
      var roh = n.nodeValue;
      /* Ein Absatz steht im HTML ueber mehrere Zeilen. Fuer das Nachschlagen
         zaehlt der Text, nicht die Einrueckung; beim Zurueckschreiben bleibt
         der umgebende Leerraum erhalten, sonst rutscht die Zeile. */
      var text = roh.trim().replace(/\s+/g, ' ');
      if (!text || !WOERTER[text]) continue;
      var el = n.parentElement;
      if (!el || el.closest('script, style') || istZitat(el)) continue;
      var vorn = roh.match(/^\s*/)[0];
      var hinten = roh.match(/\s*$/)[0];
      textknoten.push({ knoten: n, de: roh, en: vorn + WOERTER[text] + hinten });
    }

    var alle = document.querySelectorAll('[alt], [aria-label], [title]');
    for (var i = 0; i < alle.length; i++) {
      if (istZitat(alle[i])) continue;
      for (var a = 0; a < ATTRIBUTE.length; a++) {
        var wert = alle[i].getAttribute(ATTRIBUTE[a]);
        var schluessel = wert && wert.trim().replace(/\s+/g, ' ');
        if (schluessel && WOERTER[schluessel]) {
          attributknoten.push({ el: alle[i], attr: ATTRIBUTE[a], de: wert, en: WOERTER[schluessel] });
        }
      }
    }
  }

  function setzen(sprache) {
    var en = sprache === 'en';
    for (var i = 0; i < textknoten.length; i++) {
      textknoten[i].knoten.nodeValue = en ? textknoten[i].en : textknoten[i].de;
    }
    for (var j = 0; j < attributknoten.length; j++) {
      attributknoten[j].el.setAttribute(attributknoten[j].attr, en ? attributknoten[j].en : attributknoten[j].de);
    }

    document.documentElement.lang = en ? 'en' : 'de';
    var titel = document.querySelector('title');
    if (titel && WOERTER[titel.dataset.de || '']) {
      titel.textContent = en ? WOERTER[titel.dataset.de] : titel.dataset.de;
    }

    var knoepfe = document.querySelectorAll('.sprache__knopf');
    for (var k = 0; k < knoepfe.length; k++) {
      knoepfe[k].setAttribute('aria-pressed', knoepfe[k].dataset.sprache === sprache ? 'true' : 'false');
    }

    try {
      localStorage.setItem('alpinecut:sprache', sprache);
    } catch (e) {
      /* Privates Fenster oder gesperrter Speicher: dann gilt die Wahl nur hier. */
    }
  }

  function anfang() {
    /* Eine getroffene Wahl schlaegt die Browsersprache. Wer noch nie gewaehlt
       hat und kein Deutsch spricht, bekommt Englisch — deswegen das Ganze. */
    var gewaehlt = null;
    try {
      gewaehlt = localStorage.getItem('alpinecut:sprache');
    } catch (e) {
      /* siehe oben */
    }
    if (gewaehlt === 'de' || gewaehlt === 'en') return gewaehlt;
    var browser = (navigator.language || 'de').toLowerCase();
    return browser.indexOf('de') === 0 ? 'de' : 'en';
  }

  function start() {
    var titel = document.querySelector('title');
    if (titel) titel.dataset.de = titel.textContent;
    sammeln();

    var knoepfe = document.querySelectorAll('.sprache__knopf');
    for (var i = 0; i < knoepfe.length; i++) {
      knoepfe[i].addEventListener('click', function () {
        setzen(this.dataset.sprache);
      });
    }
    setzen(anfang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
