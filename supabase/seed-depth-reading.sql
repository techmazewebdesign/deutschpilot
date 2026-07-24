-- ============================================================
-- DeutschPilot – Reading Practice Depth Pack 1 (A1–B2)
-- Adds lessons 4–6 to each existing Reading Practice course
-- (courses ...0005/0006/0007/0008). Additive only, safe to
-- re-run (ON CONFLICT DO NOTHING). Run in Supabase SQL Editor.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- A1 READING (course ...0005) – lessons 4–6
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0005-000000000004',
   '00000000-0000-0000-0000-000000000005',
   'Im Supermarkt',
   'im-supermarkt-lesen',
   '<h2>Lesetext: Im Supermarkt</h2>
<p>Frau Berger geht am Freitag in den Supermarkt. Sie braucht Brot, Milch, Eier und Obst. Zuerst nimmt sie einen Einkaufswagen.</p>
<p>Das Brot findet sie gleich am Eingang. Die Milch steht im Kühlregal, neben dem Käse. Bei den Eiern muss sie suchen — sie sind heute in einem anderen Regal.</p>
<p>Am Ende kauft sie noch drei Äpfel und zwei Bananen. An der Kasse bezahlt sie 14 Euro 80 mit Karte. Die Kassiererin sagt: "Schönes Wochenende!"</p>',
   4, NULL, NOW()),
  ('00000000-0000-0000-0005-000000000005',
   '00000000-0000-0000-0000-000000000005',
   'Meine Wohnung',
   'meine-wohnung-lesen',
   '<h2>Lesetext: Meine Wohnung</h2>
<p>Ich wohne in einer kleinen Wohnung im dritten Stock. Die Wohnung hat zwei Zimmer, eine Küche und ein Bad.</p>
<p>Mein Lieblingszimmer ist das Wohnzimmer. Dort steht ein großes Sofa und ein kleiner Tisch. Am Fenster habe ich viele Pflanzen.</p>
<p>Die Küche ist klein, aber ich koche dort jeden Tag. Vom Balkon sehe ich einen Park. Die Miete kostet 650 Euro im Monat. Das ist viel, aber die Lage ist sehr gut.</p>',
   5, NULL, NOW()),
  ('00000000-0000-0000-0005-000000000006',
   '00000000-0000-0000-0000-000000000005',
   'Das Wetter heute',
   'das-wetter-heute-lesen',
   '<h2>Lesetext: Das Wetter heute</h2>
<p>Heute ist das Wetter sehr wechselhaft. Am Morgen scheint die Sonne und es ist warm — 22 Grad.</p>
<p>Am Mittag kommen dunkle Wolken. Um zwei Uhr regnet es stark. Viele Menschen haben keinen Regenschirm dabei und laufen schnell nach Hause.</p>
<p>Am Abend ist der Himmel wieder klar. Morgen soll es den ganzen Tag sonnig sein, sagt der Wetterbericht. Am Wochenende wird es aber wieder kalt.</p>',
   6, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- A2 READING (course ...0006) – lessons 4–6
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0006-000000000004',
   '00000000-0000-0000-0000-000000000006',
   'Ein neues Hobby',
   'ein-neues-hobby-lesen',
   '<h2>Lesetext: Ein neues Hobby</h2>
<p>Seit drei Monaten hat Daniel ein neues Hobby: Er fotografiert. Angefangen hat alles mit seinem Handy, aber letzten Monat hat er sich eine gebrauchte Kamera gekauft.</p>
<p>Jeden Sonntag steht er früh auf und fährt in die Natur. Am liebsten fotografiert er Vögel und alte Gebäude. Seine Fotos zeigt er in einem Online-Forum, wo andere Hobbyfotografen ihm Tipps geben.</p>
<p>"Durch das Fotografieren sehe ich meine Stadt mit ganz anderen Augen", sagt er. Nächstes Jahr möchte er einen Fotokurs an der Volkshochschule machen.</p>',
   4, NULL, NOW()),
  ('00000000-0000-0000-0006-000000000005',
   '00000000-0000-0000-0000-000000000006',
   'Der Umzug',
   'der-umzug-lesen',
   '<h2>Lesetext: Der Umzug</h2>
<p>Familie Yilmaz ist letzte Woche umgezogen — von einer kleinen Wohnung in ein Reihenhaus am Stadtrand. Der Umzug war anstrengend: Sie haben über fünfzig Kartons gepackt.</p>
<p>Drei Freunde haben beim Tragen geholfen, und für die Möbel haben sie einen Transporter gemietet. Am Abend waren alle müde, aber glücklich.</p>
<p>Die Kinder freuen sich besonders über den Garten. Frau Yilmaz braucht jetzt zwanzig Minuten länger zur Arbeit, aber sie sagt: "Dafür haben wir endlich mehr Platz. Das ist es wert."</p>',
   5, NULL, NOW()),
  ('00000000-0000-0000-0006-000000000006',
   '00000000-0000-0000-0000-000000000006',
   'Das Klassentreffen',
   'das-klassentreffen-lesen',
   '<h2>Lesetext: Das Klassentreffen</h2>
<p>Nach zehn Jahren hat Sandras alte Schulklasse ein Klassentreffen organisiert. Es fand in einem Restaurant in ihrer Heimatstadt statt.</p>
<p>Von 25 ehemaligen Mitschülern sind 18 gekommen. Manche haben sich kaum verändert, andere hat Sandra fast nicht erkannt. Ihr früherer Banknachbar lebt jetzt in Kanada und ist nur für das Treffen nach Deutschland geflogen.</p>
<p>Sie haben alte Fotos angeschaut und viel gelacht. Am Ende haben alle versprochen: Das nächste Treffen kommt in fünf Jahren — nicht erst in zehn.</p>',
   6, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- B1 READING (course ...0007) – lessons 4–6
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0007-000000000004',
   '00000000-0000-0000-0000-000000000007',
   'Ehrenamt in Deutschland',
   'ehrenamt-in-deutschland-lesen',
   '<h2>Lesetext: Ehrenamt in Deutschland</h2>
<p>In Deutschland engagieren sich Millionen Menschen ehrenamtlich — bei der Freiwilligen Feuerwehr, in Sportvereinen, in der Flüchtlingshilfe oder im Tierschutz. Sie arbeiten ohne Bezahlung, oft mehrere Stunden pro Woche.</p>
<p>Warum machen sie das? Viele sagen, dass ihnen die Arbeit Sinn gibt und sie neue Menschen kennenlernen. Andere möchten der Gesellschaft etwas zurückgeben.</p>
<p>Auch für Zugewanderte kann ein Ehrenamt eine Brücke sein: Man übt die Sprache in echten Situationen, knüpft Kontakte und lernt den Alltag in Deutschland besser kennen. Viele Städte haben Freiwilligenagenturen, die passende Aufgaben vermitteln.</p>',
   4, NULL, NOW()),
  ('00000000-0000-0000-0007-000000000005',
   '00000000-0000-0000-0000-000000000007',
   'Weniger Auto, mehr Fahrrad?',
   'weniger-auto-mehr-fahrrad-lesen',
   '<h2>Lesetext: Weniger Auto, mehr Fahrrad?</h2>
<p>Immer mehr deutsche Städte bauen ihre Radwege aus und machen Innenstädte autofrei. Befürworter freuen sich über bessere Luft und weniger Lärm. Wer mit dem Rad zur Arbeit fährt, tut außerdem etwas für die Gesundheit.</p>
<p>Doch es gibt auch Kritik: Handwerker und Lieferdienste brauchen ihre Fahrzeuge, und ältere Menschen können nicht jede Strecke mit dem Rad fahren. Auf dem Land ist das Auto oft die einzige Möglichkeit, zur Arbeit zu kommen.</p>
<p>Die Diskussion zeigt: Es geht nicht um Auto <em>oder</em> Fahrrad, sondern um kluge Lösungen für beide — bessere Busverbindungen, sichere Radwege und Parkplätze am Stadtrand.</p>',
   5, NULL, NOW()),
  ('00000000-0000-0000-0007-000000000006',
   '00000000-0000-0000-0000-000000000007',
   'Ein Jahr im Ausland',
   'ein-jahr-im-ausland-lesen',
   '<h2>Lesetext: Ein Jahr im Ausland</h2>
<p>Nach dem Abitur wusste Jana nicht, was sie studieren wollte. Deshalb entschied sie sich für ein freiwilliges Jahr in Spanien, wo sie in einem Umweltprojekt arbeitete.</p>
<p>Am Anfang war vieles schwierig: Sie verstand die Sprache kaum, vermisste ihre Freunde und musste zum ersten Mal ganz allein für sich sorgen. Nach einigen Monaten änderte sich das. Sie fand Freunde aus fünf Ländern und wurde immer selbstständiger.</p>
<p>Heute sagt Jana: "Dieses Jahr hat mir mehr beigebracht als jede Schule. Ich habe gelernt, Probleme selbst zu lösen — und dass man fast überall auf der Welt zu Hause sein kann."</p>',
   6, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- B2 READING (course ...0008) – lessons 4–6
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0008-000000000004',
   '00000000-0000-0000-0000-000000000008',
   'Die Vier-Tage-Woche',
   'die-vier-tage-woche-lesen',
   '<h2>Lesetext: Die Vier-Tage-Woche</h2>
<p>Die Vier-Tage-Woche wird in vielen Ländern erprobt: Beschäftigte arbeiten weniger Tage bei gleichem Gehalt. Erste Pilotprojekte berichten von zufriedeneren Mitarbeitenden, weniger Krankmeldungen und erstaunlich stabiler Produktivität.</p>
<p>Kritiker halten dagegen, dass sich das Modell nicht auf alle Branchen übertragen lässt. In der Pflege, im Einzelhandel oder in der Produktion lässt sich Arbeit nicht einfach verdichten — dort würde eine Vier-Tage-Woche zusätzliches Personal erfordern, das vielerorts fehlt.</p>
<p>Ökonomen weisen zudem darauf hin, dass die Ergebnisse der Pilotprojekte mit Vorsicht zu interpretieren sind: Teilnehmende Firmen melden sich freiwillig und sind daher kaum repräsentativ. Ob die Vier-Tage-Woche zum Standard wird, dürfte sich weniger an Idealen als am Arbeitsmarkt entscheiden.</p>',
   4, NULL, NOW()),
  ('00000000-0000-0000-0008-000000000005',
   '00000000-0000-0000-0000-000000000008',
   'Soziale Medien und Meinungsbildung',
   'soziale-medien-meinungsbildung-lesen',
   '<h2>Lesetext: Soziale Medien und Meinungsbildung</h2>
<p>Für viele Menschen sind soziale Medien inzwischen die wichtigste Nachrichtenquelle. Das hat Vorteile: Informationen verbreiten sich schnell, und jede Stimme kann theoretisch ein Publikum finden.</p>
<p>Problematisch wird es durch die Empfehlungsalgorithmen. Sie zeigen bevorzugt Inhalte, die starke Reaktionen auslösen — und verstärken damit oft Empörung statt Einordnung. Wer nur noch Beiträge sieht, die die eigene Meinung bestätigen, hält abweichende Positionen schnell für Randmeinungen.</p>
<p>Medienkompetenz gilt daher als Schlüsselfähigkeit: Quellen prüfen, Absender hinterfragen, bewusst auch Perspektiven lesen, die der eigenen widersprechen. Einige Länder haben Medienbildung inzwischen fest in die Lehrpläne aufgenommen.</p>',
   5, NULL, NOW()),
  ('00000000-0000-0000-0008-000000000006',
   '00000000-0000-0000-0000-000000000008',
   'Wohnungsmarkt in Großstädten',
   'wohnungsmarkt-grossstaedte-lesen',
   '<h2>Lesetext: Wohnungsmarkt in Großstädten</h2>
<p>In deutschen Großstädten sind die Mieten in den vergangenen zehn Jahren deutlich stärker gestiegen als die Einkommen. Für Normalverdiener wird es zunehmend schwierig, bezahlbaren Wohnraum in zentraler Lage zu finden.</p>
<p>Die Ursachen sind vielschichtig: Zuzug in die Städte, zu wenig Neubau, steigende Baukosten und Flächenknappheit. Politische Instrumente wie die Mietpreisbremse dämpfen die Entwicklung allenfalls, beheben aber nicht den Kern des Problems — das knappe Angebot.</p>
<p>Fachleute fordern deshalb vor allem eines: mehr bauen, dichter bauen und Genehmigungen beschleunigen. Zugleich gewinnen Alternativen an Bedeutung, etwa genossenschaftliches Wohnen oder die Umwandlung leerstehender Büroflächen in Wohnungen — ein Trend, den das Homeoffice zusätzlich verstärkt.</p>',
   6, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – A1 lessons 4–6
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0005-0004-000000000001','00000000-0000-0000-0005-000000000004',
   'Was braucht Frau Berger NICHT?','multiple_choice',
   '["Brot", "Milch", "Fleisch", "Eier"]'::jsonb,'Fleisch',
   'Der Text nennt Brot, Milch, Eier und Obst — Fleisch nicht.',NOW()),
  ('00000000-0000-0005-0004-000000000002','00000000-0000-0000-0005-000000000004',
   'Wo steht die Milch?','multiple_choice',
   '["Am Eingang", "Im Kühlregal", "An der Kasse", "Beim Obst"]'::jsonb,'Im Kühlregal',
   'Der Text sagt: "Die Milch steht im Kühlregal, neben dem Käse."',NOW()),
  ('00000000-0000-0005-0004-000000000003','00000000-0000-0000-0005-000000000004',
   'Wie viel bezahlt Frau Berger?','multiple_choice',
   '["14 Euro 80", "40 Euro 18", "14 Euro 18", "18 Euro 40"]'::jsonb,'14 Euro 80',
   'Der Text sagt: "An der Kasse bezahlt sie 14 Euro 80 mit Karte."',NOW()),
  ('00000000-0000-0005-0004-000000000004','00000000-0000-0000-0005-000000000004',
   'Wie bezahlt sie?','multiple_choice',
   '["Mit Bargeld", "Mit Karte", "Mit dem Handy", "Sie bezahlt nicht"]'::jsonb,'Mit Karte',
   'Der Text sagt: "...bezahlt sie 14 Euro 80 mit Karte."',NOW()),

  ('00000000-0000-0005-0005-000000000001','00000000-0000-0000-0005-000000000005',
   'In welchem Stock ist die Wohnung?','multiple_choice',
   '["Im ersten Stock", "Im zweiten Stock", "Im dritten Stock", "Im Erdgeschoss"]'::jsonb,'Im dritten Stock',
   'Der Text sagt: "Ich wohne in einer kleinen Wohnung im dritten Stock."',NOW()),
  ('00000000-0000-0005-0005-000000000002','00000000-0000-0000-0005-000000000005',
   'Was ist das Lieblingszimmer?','multiple_choice',
   '["Die Küche", "Das Bad", "Das Wohnzimmer", "Das Schlafzimmer"]'::jsonb,'Das Wohnzimmer',
   'Der Text sagt: "Mein Lieblingszimmer ist das Wohnzimmer."',NOW()),
  ('00000000-0000-0005-0005-000000000003','00000000-0000-0000-0005-000000000005',
   'Was sieht man vom Balkon?','multiple_choice',
   '["Einen Park", "Einen Fluss", "Ein Einkaufszentrum", "Einen Bahnhof"]'::jsonb,'Einen Park',
   'Der Text sagt: "Vom Balkon sehe ich einen Park."',NOW()),
  ('00000000-0000-0005-0005-000000000004','00000000-0000-0000-0005-000000000005',
   'Wie viel kostet die Miete?','multiple_choice',
   '["560 Euro", "650 Euro", "600 Euro", "700 Euro"]'::jsonb,'650 Euro',
   'Der Text sagt: "Die Miete kostet 650 Euro im Monat."',NOW()),

  ('00000000-0000-0005-0006-000000000001','00000000-0000-0000-0005-000000000006',
   'Wie ist das Wetter am Morgen?','multiple_choice',
   '["Es regnet", "Die Sonne scheint", "Es schneit", "Es ist neblig"]'::jsonb,'Die Sonne scheint',
   'Der Text sagt: "Am Morgen scheint die Sonne und es ist warm."',NOW()),
  ('00000000-0000-0005-0006-000000000002','00000000-0000-0000-0005-000000000006',
   'Wann regnet es stark?','multiple_choice',
   '["Am Morgen", "Um zwei Uhr", "Am Abend", "In der Nacht"]'::jsonb,'Um zwei Uhr',
   'Der Text sagt: "Um zwei Uhr regnet es stark."',NOW()),
  ('00000000-0000-0005-0006-000000000003','00000000-0000-0000-0005-000000000006',
   'Wie soll das Wetter morgen sein?','multiple_choice',
   '["Regnerisch", "Sonnig", "Windig", "Kalt"]'::jsonb,'Sonnig',
   'Der Text sagt: "Morgen soll es den ganzen Tag sonnig sein."',NOW()),
  ('00000000-0000-0005-0006-000000000004','00000000-0000-0000-0005-000000000006',
   'Wie wird das Wetter am Wochenende?','multiple_choice',
   '["Warm", "Wieder kalt", "Sehr heiß", "Sonnig"]'::jsonb,'Wieder kalt',
   'Der Text sagt: "Am Wochenende wird es aber wieder kalt."',NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – A2 lessons 4–6
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0006-0004-000000000001','00000000-0000-0000-0006-000000000004',
   'Seit wann fotografiert Daniel?','multiple_choice',
   '["Seit drei Wochen", "Seit drei Monaten", "Seit drei Jahren", "Seit letzter Woche"]'::jsonb,'Seit drei Monaten',
   'Der Text sagt: "Seit drei Monaten hat Daniel ein neues Hobby."',NOW()),
  ('00000000-0000-0006-0004-000000000002','00000000-0000-0000-0006-000000000004',
   'Was fotografiert er am liebsten?','multiple_choice',
   '["Menschen und Autos", "Vögel und alte Gebäude", "Essen", "Sportereignisse"]'::jsonb,'Vögel und alte Gebäude',
   'Der Text sagt: "Am liebsten fotografiert er Vögel und alte Gebäude."',NOW()),
  ('00000000-0000-0006-0004-000000000003','00000000-0000-0000-0006-000000000004',
   'Wo bekommt er Tipps?','multiple_choice',
   '["In einem Online-Forum", "In der Schule", "Von seiner Familie", "Im Fernsehen"]'::jsonb,'In einem Online-Forum',
   'Der Text sagt: "...in einem Online-Forum, wo andere Hobbyfotografen ihm Tipps geben."',NOW()),
  ('00000000-0000-0006-0004-000000000004','00000000-0000-0000-0006-000000000004',
   'Was möchte er nächstes Jahr machen?','multiple_choice',
   '["Eine neue Kamera kaufen", "Einen Fotokurs machen", "Nach Spanien reisen", "Ein Buch schreiben"]'::jsonb,'Einen Fotokurs machen',
   'Der Text sagt: "Nächstes Jahr möchte er einen Fotokurs an der Volkshochschule machen."',NOW()),

  ('00000000-0000-0006-0005-000000000001','00000000-0000-0000-0006-000000000005',
   'Wohin ist Familie Yilmaz gezogen?','multiple_choice',
   '["In eine größere Wohnung", "In ein Reihenhaus am Stadtrand", "In eine andere Stadt", "Aufs Land"]'::jsonb,'In ein Reihenhaus am Stadtrand',
   'Der Text sagt: "...von einer kleinen Wohnung in ein Reihenhaus am Stadtrand."',NOW()),
  ('00000000-0000-0006-0005-000000000002','00000000-0000-0000-0006-000000000005',
   'Wer hat beim Umzug geholfen?','multiple_choice',
   '["Eine Umzugsfirma", "Drei Freunde", "Die Nachbarn", "Niemand"]'::jsonb,'Drei Freunde',
   'Der Text sagt: "Drei Freunde haben beim Tragen geholfen."',NOW()),
  ('00000000-0000-0006-0005-000000000003','00000000-0000-0000-0006-000000000005',
   'Worüber freuen sich die Kinder?','multiple_choice',
   '["Über den Garten", "Über die neue Schule", "Über ein Haustier", "Über den kurzen Schulweg"]'::jsonb,'Über den Garten',
   'Der Text sagt: "Die Kinder freuen sich besonders über den Garten."',NOW()),
  ('00000000-0000-0006-0005-000000000004','00000000-0000-0000-0006-000000000005',
   'Was ist für Frau Yilmaz jetzt anders?','multiple_choice',
   '["Sie braucht länger zur Arbeit", "Sie hat einen neuen Job", "Sie arbeitet von zu Hause", "Sie fährt jetzt Fahrrad"]'::jsonb,'Sie braucht länger zur Arbeit',
   'Der Text sagt: "Frau Yilmaz braucht jetzt zwanzig Minuten länger zur Arbeit."',NOW()),

  ('00000000-0000-0006-0006-000000000001','00000000-0000-0000-0006-000000000006',
   'Nach wie vielen Jahren fand das Klassentreffen statt?','multiple_choice',
   '["Nach fünf Jahren", "Nach zehn Jahren", "Nach fünfzehn Jahren", "Nach zwanzig Jahren"]'::jsonb,'Nach zehn Jahren',
   'Der Text sagt: "Nach zehn Jahren hat Sandras alte Schulklasse ein Klassentreffen organisiert."',NOW()),
  ('00000000-0000-0006-0006-000000000002','00000000-0000-0000-0006-000000000006',
   'Wie viele Mitschüler sind gekommen?','multiple_choice',
   '["25", "18", "15", "20"]'::jsonb,'18',
   'Der Text sagt: "Von 25 ehemaligen Mitschülern sind 18 gekommen."',NOW()),
  ('00000000-0000-0006-0006-000000000003','00000000-0000-0000-0006-000000000006',
   'Wo lebt Sandras früherer Banknachbar jetzt?','multiple_choice',
   '["In Spanien", "In Kanada", "In Deutschland", "In den USA"]'::jsonb,'In Kanada',
   'Der Text sagt: "Ihr früherer Banknachbar lebt jetzt in Kanada."',NOW()),
  ('00000000-0000-0006-0006-000000000004','00000000-0000-0000-0006-000000000006',
   'Wann soll das nächste Treffen sein?','multiple_choice',
   '["In zehn Jahren", "In fünf Jahren", "Nächstes Jahr", "Es ist kein Treffen geplant"]'::jsonb,'In fünf Jahren',
   'Der Text sagt: "Das nächste Treffen kommt in fünf Jahren."',NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B1 lessons 4–6
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0007-0004-000000000001','00000000-0000-0000-0007-000000000004',
   'Was bekommen Ehrenamtliche für ihre Arbeit?','multiple_choice',
   '["Ein normales Gehalt", "Keine Bezahlung", "Einen Mindestlohn", "Steuervorteile"]'::jsonb,'Keine Bezahlung',
   'Der Text sagt: "Sie arbeiten ohne Bezahlung."',NOW()),
  ('00000000-0000-0007-0004-000000000002','00000000-0000-0000-0007-000000000004',
   'Warum engagieren sich viele Menschen laut Text?','multiple_choice',
   '["Für ihre Karriere", "Die Arbeit gibt ihnen Sinn", "Wegen der Steuer", "Weil es Pflicht ist"]'::jsonb,'Die Arbeit gibt ihnen Sinn',
   'Der Text sagt: "...dass ihnen die Arbeit Sinn gibt und sie neue Menschen kennenlernen."',NOW()),
  ('00000000-0000-0007-0004-000000000003','00000000-0000-0000-0007-000000000004',
   'Warum kann ein Ehrenamt für Zugewanderte nützlich sein?','multiple_choice',
   '["Man verdient Geld", "Man übt die Sprache in echten Situationen", "Man bekommt schneller ein Visum", "Man muss weniger arbeiten"]'::jsonb,'Man übt die Sprache in echten Situationen',
   'Der Text sagt: "Man übt die Sprache in echten Situationen, knüpft Kontakte..."',NOW()),
  ('00000000-0000-0007-0004-000000000004','00000000-0000-0000-0007-000000000004',
   'Wer vermittelt passende Aufgaben?','multiple_choice',
   '["Das Arbeitsamt", "Freiwilligenagenturen", "Die Polizei", "Die Universitäten"]'::jsonb,'Freiwilligenagenturen',
   'Der Text sagt: "Viele Städte haben Freiwilligenagenturen, die passende Aufgaben vermitteln."',NOW()),

  ('00000000-0000-0007-0005-000000000001','00000000-0000-0000-0007-000000000005',
   'Worüber freuen sich die Befürworter?','multiple_choice',
   '["Über mehr Parkplätze", "Über bessere Luft und weniger Lärm", "Über schnellere Autos", "Über neue Straßen"]'::jsonb,'Über bessere Luft und weniger Lärm',
   'Der Text sagt: "Befürworter freuen sich über bessere Luft und weniger Lärm."',NOW()),
  ('00000000-0000-0007-0005-000000000002','00000000-0000-0000-0007-000000000005',
   'Wer braucht laut Text weiterhin Fahrzeuge?','multiple_choice',
   '["Studenten", "Handwerker und Lieferdienste", "Touristen", "Kinder"]'::jsonb,'Handwerker und Lieferdienste',
   'Der Text sagt: "Handwerker und Lieferdienste brauchen ihre Fahrzeuge."',NOW()),
  ('00000000-0000-0007-0005-000000000003','00000000-0000-0000-0007-000000000005',
   'Was ist auf dem Land oft die einzige Möglichkeit?','multiple_choice',
   '["Das Fahrrad", "Das Auto", "Der Zug", "Der Bus"]'::jsonb,'Das Auto',
   'Der Text sagt: "Auf dem Land ist das Auto oft die einzige Möglichkeit, zur Arbeit zu kommen."',NOW()),
  ('00000000-0000-0007-0005-000000000004','00000000-0000-0000-0007-000000000005',
   'Was ist die Kernaussage des Textes?','multiple_choice',
   '["Autos sollten verboten werden", "Es geht um kluge Lösungen für Auto und Fahrrad", "Fahrräder sind gefährlich", "Radwege sind zu teuer"]'::jsonb,'Es geht um kluge Lösungen für Auto und Fahrrad',
   'Der Text sagt: "Es geht nicht um Auto oder Fahrrad, sondern um kluge Lösungen für beide."',NOW()),

  ('00000000-0000-0007-0006-000000000001','00000000-0000-0000-0007-000000000006',
   'Warum ging Jana ins Ausland?','multiple_choice',
   '["Sie hatte einen Studienplatz in Spanien", "Sie wusste nicht, was sie studieren wollte", "Ihre Familie zog um", "Sie hatte dort einen Job"]'::jsonb,'Sie wusste nicht, was sie studieren wollte',
   'Der Text sagt: "Nach dem Abitur wusste Jana nicht, was sie studieren wollte."',NOW()),
  ('00000000-0000-0007-0006-000000000002','00000000-0000-0000-0007-000000000006',
   'Wo arbeitete sie?','multiple_choice',
   '["In einem Restaurant", "In einem Umweltprojekt", "In einer Schule", "In einem Krankenhaus"]'::jsonb,'In einem Umweltprojekt',
   'Der Text sagt: "...wo sie in einem Umweltprojekt arbeitete."',NOW()),
  ('00000000-0000-0007-0006-000000000003','00000000-0000-0000-0007-000000000006',
   'Was war am Anfang schwierig?','multiple_choice',
   '["Das Wetter", "Sie verstand die Sprache kaum", "Die Arbeit war langweilig", "Sie hatte kein Geld"]'::jsonb,'Sie verstand die Sprache kaum',
   'Der Text sagt: "Sie verstand die Sprache kaum, vermisste ihre Freunde..."',NOW()),
  ('00000000-0000-0007-0006-000000000004','00000000-0000-0000-0007-000000000006',
   'Was hat Jana laut eigener Aussage gelernt?','multiple_choice',
   '["Perfekt Spanisch", "Probleme selbst zu lösen", "Besser zu kochen", "Schneller zu arbeiten"]'::jsonb,'Probleme selbst zu lösen',
   'Der Text sagt: "Ich habe gelernt, Probleme selbst zu lösen."',NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B2 lessons 4–6
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0008-0004-000000000001','00000000-0000-0000-0008-000000000004',
   'Was berichten erste Pilotprojekte zur Vier-Tage-Woche?','multiple_choice',
   '["Deutlich sinkende Produktivität", "Zufriedenere Mitarbeitende und weniger Krankmeldungen", "Mehr Kündigungen", "Höhere Kosten ohne Nutzen"]'::jsonb,'Zufriedenere Mitarbeitende und weniger Krankmeldungen',
   'Der Text nennt zufriedenere Mitarbeitende, weniger Krankmeldungen und stabile Produktivität.',NOW()),
  ('00000000-0000-0008-0004-000000000002','00000000-0000-0000-0008-000000000004',
   'Warum ist das Modell in der Pflege schwierig?','multiple_choice',
   '["Arbeit lässt sich dort nicht einfach verdichten", "Pflegekräfte wollen es nicht", "Es ist gesetzlich verboten", "Die Gehälter sind zu hoch"]'::jsonb,'Arbeit lässt sich dort nicht einfach verdichten',
   'Der Text sagt: "In der Pflege... lässt sich Arbeit nicht einfach verdichten."',NOW()),
  ('00000000-0000-0008-0004-000000000003','00000000-0000-0000-0008-000000000004',
   'Warum sind die Pilotergebnisse mit Vorsicht zu interpretieren?','multiple_choice',
   '["Die Daten sind geheim", "Teilnehmende Firmen melden sich freiwillig", "Die Projekte waren zu kurz", "Die Zahlen wurden gefälscht"]'::jsonb,'Teilnehmende Firmen melden sich freiwillig',
   'Der Text sagt: "Teilnehmende Firmen melden sich freiwillig und sind daher kaum repräsentativ."',NOW()),
  ('00000000-0000-0008-0004-000000000004','00000000-0000-0000-0008-000000000004',
   'Woran dürfte sich die Zukunft des Modells laut Text entscheiden?','multiple_choice',
   '["An Idealen", "Am Arbeitsmarkt", "An der Politik", "An den Gewerkschaften"]'::jsonb,'Am Arbeitsmarkt',
   'Der Text sagt: "...dürfte sich weniger an Idealen als am Arbeitsmarkt entscheiden."',NOW()),

  ('00000000-0000-0008-0005-000000000001','00000000-0000-0000-0008-000000000005',
   'Welche Inhalte bevorzugen Empfehlungsalgorithmen laut Text?','multiple_choice',
   '["Lange Analysen", "Inhalte, die starke Reaktionen auslösen", "Offizielle Nachrichten", "Werbung"]'::jsonb,'Inhalte, die starke Reaktionen auslösen',
   'Der Text sagt: "Sie zeigen bevorzugt Inhalte, die starke Reaktionen auslösen."',NOW()),
  ('00000000-0000-0008-0005-000000000002','00000000-0000-0000-0008-000000000005',
   'Was passiert, wenn man nur bestätigende Beiträge sieht?','multiple_choice',
   '["Man wird besser informiert", "Man hält abweichende Positionen für Randmeinungen", "Man liest mehr Bücher", "Man verliert Interesse an Nachrichten"]'::jsonb,'Man hält abweichende Positionen für Randmeinungen',
   'Der Text sagt: "...hält abweichende Positionen schnell für Randmeinungen."',NOW()),
  ('00000000-0000-0008-0005-000000000003','00000000-0000-0000-0008-000000000005',
   'Was gehört laut Text zur Medienkompetenz?','multiple_choice',
   '["Nur eine Quelle nutzen", "Quellen prüfen und Absender hinterfragen", "Kommentare schreiben", "Viele Accounts folgen"]'::jsonb,'Quellen prüfen und Absender hinterfragen',
   'Der Text nennt: Quellen prüfen, Absender hinterfragen, andere Perspektiven lesen.',NOW()),
  ('00000000-0000-0008-0005-000000000004','00000000-0000-0000-0008-000000000005',
   'Wie reagieren einige Länder?','multiple_choice',
   '["Sie verbieten soziale Medien", "Sie nehmen Medienbildung in die Lehrpläne auf", "Sie besteuern Plattformen höher", "Sie schließen Schulen"]'::jsonb,'Sie nehmen Medienbildung in die Lehrpläne auf',
   'Der Text sagt: "Einige Länder haben Medienbildung inzwischen fest in die Lehrpläne aufgenommen."',NOW()),

  ('00000000-0000-0008-0006-000000000001','00000000-0000-0000-0008-000000000006',
   'Wie haben sich Mieten im Verhältnis zu Einkommen entwickelt?','multiple_choice',
   '["Sie sind langsamer gestiegen", "Sie sind deutlich stärker gestiegen", "Sie sind gleich geblieben", "Sie sind gesunken"]'::jsonb,'Sie sind deutlich stärker gestiegen',
   'Der Text sagt: "...deutlich stärker gestiegen als die Einkommen."',NOW()),
  ('00000000-0000-0008-0006-000000000002','00000000-0000-0000-0008-000000000006',
   'Was ist laut Text der Kern des Problems?','multiple_choice',
   '["Zu hohe Zinsen", "Das knappe Angebot", "Zu viele Touristen", "Zu große Wohnungen"]'::jsonb,'Das knappe Angebot',
   'Der Text sagt: "...beheben aber nicht den Kern des Problems — das knappe Angebot."',NOW()),
  ('00000000-0000-0008-0006-000000000003','00000000-0000-0000-0008-000000000006',
   'Was fordern Fachleute vor allem?','multiple_choice',
   '["Höhere Mieten", "Mehr bauen und Genehmigungen beschleunigen", "Weniger Zuzug", "Mehr Büros"]'::jsonb,'Mehr bauen und Genehmigungen beschleunigen',
   'Der Text sagt: "mehr bauen, dichter bauen und Genehmigungen beschleunigen."',NOW()),
  ('00000000-0000-0008-0006-000000000004','00000000-0000-0000-0008-000000000006',
   'Welcher Trend verstärkt die Umwandlung von Büros in Wohnungen?','multiple_choice',
   '["Das Homeoffice", "Der Tourismus", "Die Inflation", "Das Bevölkerungswachstum"]'::jsonb,'Das Homeoffice',
   'Der Text sagt: "...ein Trend, den das Homeoffice zusätzlich verstärkt."',NOW())
ON CONFLICT (id) DO NOTHING;
