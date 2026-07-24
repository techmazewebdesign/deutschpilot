-- ============================================================
-- DeutschPilot – Writing & Speaking Practice Depth Pack 1 (A1–B2)
-- Adds lessons 4–6 to each Writing course (…0009/0012/0013/0014)
-- and each Speaking course (…0010/0015/0016/0017).
-- Additive only, safe to re-run (ON CONFLICT DO NOTHING).
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- WRITING LESSONS (A1 …0009, A2 …0012, B1 …0013, B2 …0014)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0009-000000000004','00000000-0000-0000-0000-000000000009',
   'Mein Lieblingsessen','mein-lieblingsessen-schreiben',
   '<h2>Schreibaufgabe: Mein Lieblingsessen</h2><p>Schreibe 3-4 Sätze über dein Lieblingsessen. Was ist es? Wann isst du es? Kannst du es kochen?</p>',
   4, NULL, NOW()),
  ('00000000-0000-0000-0009-000000000005','00000000-0000-0000-0000-000000000009',
   'Eine Einladung schreiben','eine-einladung-schreiben',
   '<h2>Schreibaufgabe: Eine Einladung</h2><p>Schreibe eine kurze Einladung (3-4 Sätze) an einen Freund: Lade ihn zu deinem Geburtstag ein. Wann? Wo? Was macht ihr?</p>',
   5, NULL, NOW()),
  ('00000000-0000-0000-0009-000000000006','00000000-0000-0000-0000-000000000009',
   'Mein Wochenende','mein-wochenende-schreiben',
   '<h2>Schreibaufgabe: Mein Wochenende</h2><p>Schreibe 4-5 Sätze: Was hast du am letzten Wochenende gemacht? Benutze das Perfekt, wenn du kannst.</p>',
   6, NULL, NOW()),

  ('00000000-0000-0000-0012-000000000004','00000000-0000-0000-0000-000000000012',
   'Eine E-Mail an den Vermieter','email-vermieter-schreiben',
   '<h2>Schreibaufgabe: E-Mail an den Vermieter</h2><p>Deine Heizung ist kaputt. Schreibe eine kurze, höfliche E-Mail (4-5 Sätze) an deinen Vermieter: Was ist das Problem? Seit wann? Was soll er tun?</p>',
   4, NULL, NOW()),
  ('00000000-0000-0000-0012-000000000005','00000000-0000-0000-0000-000000000012',
   'Einen Termin verschieben','termin-verschieben-schreiben',
   '<h2>Schreibaufgabe: Einen Termin verschieben</h2><p>Du kannst am Freitag nicht zum Zahnarzt kommen. Schreibe eine kurze Nachricht (3-4 Sätze): Entschuldige dich und schlage einen neuen Termin vor.</p>',
   5, NULL, NOW()),
  ('00000000-0000-0000-0012-000000000006','00000000-0000-0000-0000-000000000012',
   'Meine Stadt empfehlen','meine-stadt-empfehlen-schreiben',
   '<h2>Schreibaufgabe: Meine Stadt empfehlen</h2><p>Ein Freund besucht deine Stadt zum ersten Mal. Schreibe 4-5 Sätze: Was soll er sehen? Wo kann er gut essen? Was ist besonders?</p>',
   6, NULL, NOW()),

  ('00000000-0000-0000-0013-000000000004','00000000-0000-0000-0000-000000000013',
   'Eine Beschwerde schreiben','beschwerde-schreiben',
   '<h2>Schreibaufgabe: Eine Beschwerde</h2><p>Du hast online Schuhe bestellt, aber die falsche Größe bekommen. Schreibe eine höfliche Beschwerde (5-6 Sätze): Beschreibe das Problem und sage, was du erwartest (Umtausch oder Geld zurück).</p>',
   4, NULL, NOW()),
  ('00000000-0000-0000-0013-000000000005','00000000-0000-0000-0000-000000000013',
   'Vor- und Nachteile der Stadt','stadt-vor-nachteile-schreiben',
   '<h2>Schreibaufgabe: Leben in der Stadt</h2><p>Schreibe 5-6 Sätze über das Leben in einer Großstadt: Nenne mindestens zwei Vorteile und zwei Nachteile und deine eigene Meinung.</p>',
   5, NULL, NOW()),
  ('00000000-0000-0000-0013-000000000006','00000000-0000-0000-0000-000000000013',
   'Ein Erlebnis erzählen','erlebnis-erzaehlen-schreiben',
   '<h2>Schreibaufgabe: Ein besonderes Erlebnis</h2><p>Erzähle in 5-6 Sätzen von einem besonderen Erlebnis (eine Reise, ein Fest, eine Überraschung). Benutze Vergangenheitsformen und mindestens einen Nebensatz mit "als" oder "weil".</p>',
   6, NULL, NOW()),

  ('00000000-0000-0000-0014-000000000004','00000000-0000-0000-0000-000000000014',
   'Bewerbung: Motivationsabsatz','bewerbung-motivation-schreiben',
   '<h2>Schreibaufgabe: Motivationsabsatz einer Bewerbung</h2><p>Schreibe den Kernabsatz eines Bewerbungsschreibens (6-8 Sätze): Warum passt du auf die Stelle? Nenne Erfahrung, Stärken und Motivation — formell und präzise.</p>',
   4, NULL, NOW()),
  ('00000000-0000-0000-0014-000000000005','00000000-0000-0000-0000-000000000014',
   'Stellungnahme: Homeoffice-Pflicht?','stellungnahme-homeoffice-schreiben',
   '<h2>Schreibaufgabe: Stellungnahme</h2><p>"Firmen sollten ihren Mitarbeitenden Homeoffice erlauben müssen." Schreibe eine Stellungnahme (6-8 Sätze): These, zwei Argumente, ein Gegenargument mit Entkräftung, Fazit.</p>',
   5, NULL, NOW()),
  ('00000000-0000-0000-0014-000000000006','00000000-0000-0000-0000-000000000014',
   'Eine Grafik beschreiben','grafik-beschreiben-schreiben',
   '<h2>Schreibaufgabe: Grafikbeschreibung</h2><p>Stell dir eine Grafik vor: Die Zahl der Radfahrer in deiner Stadt ist von 2015 bis 2025 um 60 % gestiegen, die der Autofahrer leicht gesunken. Beschreibe diese Entwicklung in 6-8 Sätzen und nenne mögliche Gründe.</p>',
   6, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- WRITING EXERCISES (writing_prompt)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0009-0004-000000000001','00000000-0000-0000-0009-000000000004',
   'Schreibe 3-4 Sätze über dein Lieblingsessen.','writing_prompt',NULL,
   'Mein Lieblingsessen ist Pizza. Ich esse sie am liebsten am Freitagabend. Manchmal koche ich sie selbst, mit Tomaten und viel Käse.',
   'Benutze "Mein Lieblingsessen ist...", "Ich esse gern..." und das Verb "kochen".',NOW()),
  ('00000000-0000-0009-0005-000000000001','00000000-0000-0000-0009-000000000005',
   'Schreibe eine kurze Geburtstagseinladung (3-4 Sätze).','writing_prompt',NULL,
   'Hallo Tom! Ich habe am Samstag Geburtstag und mache eine Party. Wir grillen bei mir im Garten, ab 18 Uhr. Kommst du?',
   'Eine Einladung braucht: Anlass, Tag/Uhrzeit, Ort und eine Frage am Ende.',NOW()),
  ('00000000-0000-0009-0006-000000000001','00000000-0000-0000-0009-000000000006',
   'Was hast du am letzten Wochenende gemacht? (4-5 Sätze)','writing_prompt',NULL,
   'Am Samstag habe ich lange geschlafen. Danach habe ich Freunde getroffen und wir haben Fußball gespielt. Am Sonntag habe ich für meine Familie gekocht. Es war ein schönes Wochenende.',
   'Benutze das Perfekt: ich habe geschlafen, ich habe gespielt, ich bin gegangen.',NOW()),

  ('00000000-0000-0012-0004-000000000001','00000000-0000-0000-0012-000000000004',
   'Schreibe eine höfliche E-Mail an deinen Vermieter: Die Heizung ist kaputt. (4-5 Sätze)','writing_prompt',NULL,
   'Sehr geehrter Herr Müller, seit gestern funktioniert die Heizung in meiner Wohnung nicht mehr. Es ist sehr kalt, besonders am Abend. Könnten Sie bitte einen Techniker schicken? Vielen Dank im Voraus. Mit freundlichen Grüßen, Ali Khan',
   'Formell schreiben: "Sehr geehrte/r...", das Problem + seit wann, eine höfliche Bitte mit "Könnten Sie...".',NOW()),
  ('00000000-0000-0012-0005-000000000001','00000000-0000-0000-0012-000000000005',
   'Verschiebe deinen Zahnarzttermin höflich. (3-4 Sätze)','writing_prompt',NULL,
   'Guten Tag, leider kann ich meinen Termin am Freitag um 10 Uhr nicht wahrnehmen. Es tut mir sehr leid. Wäre stattdessen Montag oder Dienstag nächster Woche möglich? Vielen Dank und freundliche Grüße.',
   'Wichtig: absagen + entschuldigen + neuen Vorschlag machen ("Wäre ... möglich?").',NOW()),
  ('00000000-0000-0012-0006-000000000001','00000000-0000-0000-0012-000000000006',
   'Empfiehl deine Stadt einem Besucher. (4-5 Sätze)','writing_prompt',NULL,
   'Du musst unbedingt die Altstadt sehen — sie ist sehr schön. Im Zentrum gibt es einen großen Markt, dort kannst du gut und günstig essen. Abends empfehle ich dir den Park am Fluss. Vergiss deine Kamera nicht!',
   'Benutze Empfehlungen: "Du musst... sehen", "Ich empfehle dir...", "Dort kannst du...".',NOW()),

  ('00000000-0000-0013-0004-000000000001','00000000-0000-0000-0013-000000000004',
   'Schreibe eine höfliche Beschwerde über eine falsche Lieferung. (5-6 Sätze)','writing_prompt',NULL,
   'Sehr geehrte Damen und Herren, am 15. Juli habe ich bei Ihnen Schuhe in Größe 42 bestellt. Leider haben Sie mir Größe 39 geschickt. Ich bitte Sie daher, mir die richtige Größe zuzusenden oder den Kaufpreis zu erstatten. Die falschen Schuhe sende ich gern zurück. Mit freundlichen Grüßen',
   'Struktur: Was wurde bestellt? Was ist das Problem? Was erwartest du? Höflich, aber klar.',NOW()),
  ('00000000-0000-0013-0005-000000000001','00000000-0000-0000-0013-000000000005',
   'Leben in der Großstadt: 2 Vorteile, 2 Nachteile, deine Meinung. (5-6 Sätze)','writing_prompt',NULL,
   'Das Leben in der Großstadt hat viele Vorteile: Man findet leichter Arbeit, und das Kulturangebot ist groß. Andererseits sind die Mieten hoch, und es ist oft laut. Trotzdem würde ich in der Stadt wohnen, weil mir Flexibilität wichtiger ist als Ruhe.',
   'Benutze Konnektoren: "einerseits/andererseits", "trotzdem", "weil".',NOW()),
  ('00000000-0000-0013-0006-000000000001','00000000-0000-0000-0013-000000000006',
   'Erzähle von einem besonderen Erlebnis. (5-6 Sätze, Vergangenheit)','writing_prompt',NULL,
   'Als ich letzten Sommer in den Bergen wandern war, habe ich mich verlaufen. Zuerst hatte ich Angst, weil mein Handy keinen Empfang hatte. Nach zwei Stunden habe ich zum Glück eine Hütte gefunden, wo mir ein Wanderer den Weg gezeigt hat. Diesen Tag werde ich nie vergessen.',
   'Mindestens ein Nebensatz mit "als" oder "weil"; Perfekt und Präteritum mischen ist erlaubt.',NOW()),

  ('00000000-0000-0014-0004-000000000001','00000000-0000-0000-0014-000000000004',
   'Schreibe den Motivationsabsatz einer Bewerbung. (6-8 Sätze, formell)','writing_prompt',NULL,
   'Die ausgeschriebene Stelle spricht mich an, weil sie meine Erfahrung im Projektmanagement mit meinem Interesse an nachhaltigen Technologien verbindet. In den vergangenen drei Jahren habe ich Teams von bis zu acht Personen geleitet und Projekte termingerecht umgesetzt. Besonders schätzen Kolleginnen und Kollegen meine strukturierte Arbeitsweise sowie meine Kommunikationsstärke. Ich bin überzeugt, dass ich diese Fähigkeiten gewinnbringend in Ihr Team einbringen kann.',
   'Formell, konkret, ohne Floskeln: Erfahrung + belegbare Stärke + Bezug zur Stelle.',NOW()),
  ('00000000-0000-0014-0005-000000000001','00000000-0000-0000-0014-000000000005',
   'Stellungnahme: Sollten Firmen Homeoffice erlauben müssen? (6-8 Sätze)','writing_prompt',NULL,
   'Meiner Ansicht nach sollten Unternehmen verpflichtet werden, Homeoffice zu ermöglichen, wo die Tätigkeit es erlaubt. Erstens steigert flexibles Arbeiten nachweislich die Zufriedenheit, zweitens entlastet es Verkehr und Umwelt. Kritiker wenden ein, dass der Teamzusammenhalt leidet; dem lässt sich jedoch mit festen Präsenztagen begegnen. Insgesamt überwiegen die Vorteile deutlich, weshalb eine gesetzliche Regelung sinnvoll wäre.',
   'Struktur: These → Argumente ("erstens/zweitens") → Gegenargument + Entkräftung ("jedoch") → Fazit.',NOW()),
  ('00000000-0000-0014-0006-000000000001','00000000-0000-0000-0014-000000000006',
   'Beschreibe die Entwicklung (Radfahrer +60 %, Autofahrer leicht gesunken) und nenne Gründe. (6-8 Sätze)','writing_prompt',NULL,
   'Die Grafik zeigt die Entwicklung des Verkehrs zwischen 2015 und 2025. Während die Zahl der Radfahrenden um 60 Prozent zunahm, ging die der Autofahrenden leicht zurück. Dieser Anstieg lässt sich vor allem auf den Ausbau der Radwege und das gestiegene Umweltbewusstsein zurückführen. Auch die hohen Kraftstoffpreise dürften eine Rolle gespielt haben. Setzt sich der Trend fort, wird das Fahrrad in Zukunft eine noch größere Bedeutung im Stadtverkehr haben.',
   'Grafiksprache: "Die Grafik zeigt...", "Während... zunahm, ging... zurück", "lässt sich auf... zurückführen".',NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- SPEAKING LESSONS (A1 …0010, A2 …0015, B1 …0016, B2 …0017)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0010-000000000004','00000000-0000-0000-0000-000000000010',
   'Im Supermarkt fragen','im-supermarkt-fragen-sprechen',
   '<h2>Sprechübung: Im Supermarkt</h2><p>Übe, nach Produkten zu fragen. Sprich laut und deutlich.</p>',4, NULL, NOW()),
  ('00000000-0000-0000-0010-000000000005','00000000-0000-0000-0000-000000000010',
   'Uhrzeit und Termine','uhrzeit-termine-sprechen',
   '<h2>Sprechübung: Uhrzeit</h2><p>Übe, nach der Uhrzeit zu fragen und Termine zu nennen.</p>',5, NULL, NOW()),
  ('00000000-0000-0000-0010-000000000006','00000000-0000-0000-0000-000000000010',
   'Im Café bezahlen','im-cafe-bezahlen-sprechen',
   '<h2>Sprechübung: Bezahlen</h2><p>Übe, im Café um die Rechnung zu bitten.</p>',6, NULL, NOW()),

  ('00000000-0000-0000-0015-000000000004','00000000-0000-0000-0000-000000000015',
   'Beim Arzt','beim-arzt-sprechen',
   '<h2>Sprechübung: Beim Arzt</h2><p>Übe, Beschwerden zu beschreiben.</p>',4, NULL, NOW()),
  ('00000000-0000-0000-0015-000000000005','00000000-0000-0000-0000-000000000015',
   'Über den Urlaub sprechen','urlaub-sprechen',
   '<h2>Sprechübung: Urlaub</h2><p>Übe, im Perfekt über den Urlaub zu erzählen.</p>',5, NULL, NOW()),
  ('00000000-0000-0000-0015-000000000006','00000000-0000-0000-0000-000000000015',
   'Etwas reklamieren','reklamieren-sprechen',
   '<h2>Sprechübung: Reklamation</h2><p>Übe, höflich zu reklamieren.</p>',6, NULL, NOW()),

  ('00000000-0000-0000-0016-000000000004','00000000-0000-0000-0000-000000000016',
   'Zustimmen und widersprechen','zustimmen-widersprechen-sprechen',
   '<h2>Sprechübung: Diskussion</h2><p>Übe, höflich zuzustimmen und zu widersprechen.</p>',4, NULL, NOW()),
  ('00000000-0000-0000-0016-000000000005','00000000-0000-0000-0000-000000000016',
   'Etwas vorschlagen','vorschlagen-sprechen',
   '<h2>Sprechübung: Vorschläge</h2><p>Übe, im Team einen Vorschlag zu machen.</p>',5, NULL, NOW()),
  ('00000000-0000-0000-0016-000000000006','00000000-0000-0000-0000-000000000016',
   'Nach dem Weg im Gebäude fragen','weg-im-gebaeude-sprechen',
   '<h2>Sprechübung: Orientierung</h2><p>Übe, in einem Amt oder Bürogebäude nach dem Weg zu fragen.</p>',6, NULL, NOW()),

  ('00000000-0000-0000-0017-000000000004','00000000-0000-0000-0000-000000000017',
   'Ein Meeting eröffnen','meeting-eroeffnen-sprechen',
   '<h2>Sprechübung: Meeting</h2><p>Übe, ein Arbeitstreffen professionell zu eröffnen.</p>',4, NULL, NOW()),
  ('00000000-0000-0000-0017-000000000005','00000000-0000-0000-0000-000000000017',
   'Höflich nachfragen','hoeflich-nachfragen-sprechen',
   '<h2>Sprechübung: Nachfragen</h2><p>Übe, bei Unklarheiten professionell nachzufragen.</p>',5, NULL, NOW()),
  ('00000000-0000-0000-0017-000000000006','00000000-0000-0000-0000-000000000017',
   'Ergebnisse zusammenfassen','ergebnisse-zusammenfassen-sprechen',
   '<h2>Sprechübung: Zusammenfassung</h2><p>Übe, am Ende einer Besprechung Ergebnisse zusammenzufassen.</p>',6, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- SPEAKING EXERCISES (speaking_prompt)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0010-0004-000000000001','00000000-0000-0000-0010-000000000004',
   'Sag laut: ''Entschuldigung, wo finde ich die Milch?''','speaking_prompt',NULL,
   'Entschuldigung, wo finde ich die Milch?',
   'Betone: ent-SCHUL-digung, wo FIN-de ich die MILCH?',NOW()),
  ('00000000-0000-0010-0005-000000000001','00000000-0000-0000-0010-000000000005',
   'Sag laut: ''Wie spät ist es? Mein Termin ist um halb drei.''','speaking_prompt',NULL,
   'Wie spät ist es? Mein Termin ist um halb drei.',
   'Denk daran: "halb drei" = 14:30, nicht 15:30!',NOW()),
  ('00000000-0000-0010-0006-000000000001','00000000-0000-0000-0010-000000000006',
   'Sag laut: ''Die Rechnung, bitte. Kann ich mit Karte zahlen?''','speaking_prompt',NULL,
   'Die Rechnung, bitte. Kann ich mit Karte zahlen?',
   'Zwei kurze Sätze — mach eine kleine Pause dazwischen.',NOW()),

  ('00000000-0000-0015-0004-000000000001','00000000-0000-0000-0015-000000000004',
   'Sag laut: ''Ich habe seit drei Tagen Halsschmerzen und fühle mich sehr müde.''','speaking_prompt',NULL,
   'Ich habe seit drei Tagen Halsschmerzen und fühle mich sehr müde.',
   'Übe das schwierige Wort: HALS-schmer-zen.',NOW()),
  ('00000000-0000-0015-0005-000000000001','00000000-0000-0000-0015-000000000005',
   'Sag laut: ''Letzten Sommer bin ich ans Meer gefahren und habe jeden Tag geschwommen.''','speaking_prompt',NULL,
   'Letzten Sommer bin ich ans Meer gefahren und habe jeden Tag geschwommen.',
   'Perfekt mit "sein" (bin gefahren) und "haben" (habe geschwommen) im selben Satz.',NOW()),
  ('00000000-0000-0015-0006-000000000001','00000000-0000-0000-0015-000000000006',
   'Sag laut: ''Entschuldigung, dieses Gerät funktioniert nicht. Ich möchte es umtauschen.''','speaking_prompt',NULL,
   'Entschuldigung, dieses Gerät funktioniert nicht. Ich möchte es umtauschen.',
   'Freundlich, aber bestimmt sprechen — das ist der Ton einer guten Reklamation.',NOW()),

  ('00000000-0000-0016-0004-000000000001','00000000-0000-0000-0016-000000000004',
   'Sag laut: ''Da stimme ich Ihnen grundsätzlich zu, aber ich sehe einen wichtigen Punkt anders.''','speaking_prompt',NULL,
   'Da stimme ich Ihnen grundsätzlich zu, aber ich sehe einen wichtigen Punkt anders.',
   'Die Betonung auf "grundsätzlich" und "anders" macht den Satz diplomatisch.',NOW()),
  ('00000000-0000-0016-0005-000000000001','00000000-0000-0000-0016-000000000005',
   'Sag laut: ''Ich schlage vor, dass wir uns nächste Woche noch einmal zusammensetzen.''','speaking_prompt',NULL,
   'Ich schlage vor, dass wir uns nächste Woche noch einmal zusammensetzen.',
   'Nebensatz mit "dass" — das Verb "zusammensetzen" steht ganz am Ende.',NOW()),
  ('00000000-0000-0016-0006-000000000001','00000000-0000-0000-0016-000000000006',
   'Sag laut: ''Entschuldigung, ich suche das Bürgeramt. In welchem Stock finde ich Zimmer 214?''','speaking_prompt',NULL,
   'Entschuldigung, ich suche das Bürgeramt. In welchem Stock finde ich Zimmer 214?',
   'Übe die Zahl: zwei-hundert-vier-zehn.',NOW()),

  ('00000000-0000-0017-0004-000000000001','00000000-0000-0000-0017-000000000004',
   'Sag laut: ''Schön, dass Sie alle da sind. Lassen Sie uns mit dem ersten Tagesordnungspunkt beginnen.''','speaking_prompt',NULL,
   'Schön, dass Sie alle da sind. Lassen Sie uns mit dem ersten Tagesordnungspunkt beginnen.',
   'Übe das lange Wort ruhig: Tages-ordnungs-punkt.',NOW()),
  ('00000000-0000-0017-0005-000000000001','00000000-0000-0000-0017-000000000005',
   'Sag laut: ''Habe ich Sie richtig verstanden, dass die Frist auf Ende des Monats verschoben wird?''','speaking_prompt',NULL,
   'Habe ich Sie richtig verstanden, dass die Frist auf Ende des Monats verschoben wird?',
   'Diese Rückfrage-Formel rettet jedes Meeting — sprich sie, bis sie automatisch kommt.',NOW()),
  ('00000000-0000-0017-0006-000000000001','00000000-0000-0000-0017-000000000006',
   'Sag laut: ''Zusammenfassend halten wir fest: Wir starten am Montag, und Frau Weber übernimmt die Koordination.''','speaking_prompt',NULL,
   'Zusammenfassend halten wir fest: Wir starten am Montag, und Frau Weber übernimmt die Koordination.',
   '"Zusammenfassend halten wir fest" ist die Standard-Formel für Meeting-Zusammenfassungen.',NOW())
ON CONFLICT (id) DO NOTHING;
