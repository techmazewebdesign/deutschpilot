-- ============================================================
-- DeutschPilot – A2 Rooms 01–03 (Alltag, Reisen, Gesundheit)
-- Mirrors the A1 room pattern: one course per room (slug = room
-- slug from ROOM_META.A2), 3 content lessons + checkpoint quiz
-- (order_index 99). Additive only, ON CONFLICT DO NOTHING.
-- ============================================================

-- ── COURSES ─────────────────────────────────────────────────
INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES
  ('a2000000-0000-0000-0000-000000000001','daily-routines-a2',
   'A2 Room 01 – Alltag & Tagesablauf',
   'Talk about your daily routine with reflexive verbs, separable verbs and precise time expressions.',
   'A2','de',TRUE,NOW()),
  ('a2000000-0000-0000-0000-000000000002','travel-transport-a2',
   'A2 Room 02 – Reisen & Verkehr',
   'Book tickets, describe journeys in the Perfekt, and handle travel problems in German.',
   'A2','de',TRUE,NOW()),
  ('a2000000-0000-0000-0000-000000000003','health-body-a2',
   'A2 Room 03 – Gesundheit & Körper',
   'Describe symptoms at the doctor, understand advice, and use the imperative for instructions.',
   'A2','de',TRUE,NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 01 – Alltag & Tagesablauf
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('a2000000-0000-0000-0001-000000000001','a2000000-0000-0000-0000-000000000001',
   'a2-reflexive-verben','Reflexive Verben im Alltag',
   '<h2>Reflexive Verben im Alltag</h2>
<p>Viele Alltagsverben im Deutschen sind reflexiv — die Handlung richtet sich auf die Person selbst.</p>
<h3>1. Die wichtigsten reflexiven Alltagsverben</h3>
<ul>
<li><strong>sich waschen</strong> – Ich wasche mich jeden Morgen.</li>
<li><strong>sich anziehen</strong> – Er zieht sich schnell an.</li>
<li><strong>sich beeilen</strong> – Wir müssen uns beeilen!</li>
<li><strong>sich ausruhen</strong> – Am Abend ruhe ich mich aus.</li>
<li><strong>sich freuen auf</strong> – Sie freut sich auf das Wochenende.</li>
</ul>
<h3>2. Die Reflexivpronomen</h3>
<table>
<thead><tr><th>Person</th><th>Reflexivpronomen</th><th>Beispiel</th></tr></thead>
<tbody>
<tr><td>ich</td><td>mich</td><td>Ich dusche mich.</td></tr>
<tr><td>du</td><td>dich</td><td>Du kämmst dich.</td></tr>
<tr><td>er/sie/es</td><td>sich</td><td>Sie schminkt sich.</td></tr>
<tr><td>wir</td><td>uns</td><td>Wir beeilen uns.</td></tr>
<tr><td>ihr</td><td>euch</td><td>Ihr ruht euch aus.</td></tr>
<tr><td>sie/Sie</td><td>sich</td><td>Sie treffen sich um acht.</td></tr>
</tbody>
</table>
<h3>3. Wortstellung</h3>
<p>Das Reflexivpronomen steht direkt nach dem konjugierten Verb: <em>Ich wasche <strong>mich</strong> jeden Morgen.</em> In Fragen nach dem Subjekt: <em>Wäschst du <strong>dich</strong>?</em></p>',
   1,NOW()),
  ('a2000000-0000-0000-0001-000000000002','a2000000-0000-0000-0000-000000000001',
   'a2-trennbare-verben','Trennbare Verben & Tagesablauf',
   '<h2>Trennbare Verben & Tagesablauf</h2>
<p>Der deutsche Tagesablauf ist voller trennbarer Verben: aufstehen, anfangen, einkaufen, fernsehen...</p>
<h3>1. So funktionieren trennbare Verben</h3>
<p>Im Hauptsatz geht das Präfix ans Satzende:</p>
<ul>
<li>auf|stehen → Ich <strong>stehe</strong> um 7 Uhr <strong>auf</strong>.</li>
<li>ein|kaufen → Sie <strong>kauft</strong> nach der Arbeit <strong>ein</strong>.</li>
<li>fern|sehen → Wir <strong>sehen</strong> abends <strong>fern</strong>.</li>
<li>an|rufen → Er <strong>ruft</strong> seine Mutter <strong>an</strong>.</li>
</ul>
<h3>2. Mit Modalverben bleibt alles zusammen</h3>
<p><em>Ich muss um 7 Uhr <strong>aufstehen</strong>.</em> — Nach Modalverben steht der Infinitiv ungetrennt am Ende.</p>
<h3>3. Zeitangaben präzise machen</h3>
<ul>
<li><strong>zuerst</strong> – zuerst frühstücke ich</li>
<li><strong>danach / dann</strong> – danach fahre ich zur Arbeit</li>
<li><strong>gegen</strong> – gegen 18 Uhr komme ich nach Hause</li>
<li><strong>schließlich</strong> – schließlich gehe ich schlafen</li>
</ul>',
   2,NOW()),
  ('a2000000-0000-0000-0001-000000000003','a2000000-0000-0000-0000-000000000001',
   'a2-wie-oft','Wie oft? Häufigkeit ausdrücken',
   '<h2>Wie oft? Häufigkeit ausdrücken</h2>
<p>Auf A2 beschreibst du nicht nur, WAS du machst, sondern auch WIE OFT.</p>
<h3>1. Die Häufigkeitsskala</h3>
<table>
<thead><tr><th>Deutsch</th><th>English</th></tr></thead>
<tbody>
<tr><td><strong>immer</strong></td><td>always</td></tr>
<tr><td><strong>meistens</strong></td><td>mostly</td></tr>
<tr><td><strong>oft</strong></td><td>often</td></tr>
<tr><td><strong>manchmal</strong></td><td>sometimes</td></tr>
<tr><td><strong>selten</strong></td><td>rarely</td></tr>
<tr><td><strong>nie</strong></td><td>never</td></tr>
</tbody>
</table>
<h3>2. Position im Satz</h3>
<p>Häufigkeitsadverbien stehen meist direkt nach dem Verb (oder nach dem Reflexivpronomen):</p>
<ul>
<li>Ich gehe <strong>oft</strong> ins Fitnessstudio.</li>
<li>Er kommt <strong>meistens</strong> pünktlich.</li>
<li>Wir sehen <strong>selten</strong> fern.</li>
</ul>
<h3>3. Konkrete Angaben</h3>
<ul>
<li><strong>einmal / zweimal pro Woche</strong> – Ich koche dreimal pro Woche.</li>
<li><strong>jeden Tag / jede Woche / jedes Wochenende</strong> – Jeden Tag lerne ich Deutsch.</li>
<li><strong>alle zwei Tage</strong> – Alle zwei Tage gehe ich joggen.</li>
</ul>',
   3,NOW()),
  ('a2000000-0000-0000-0001-000000000099','a2000000-0000-0000-0000-000000000001',
   'a2-room01-quiz','Checkpoint: Alltag & Tagesablauf',
   '<h2>Checkpoint Quiz</h2><p>Zeig, was du über reflexive Verben, trennbare Verben und Häufigkeit gelernt hast. Du brauchst 60 %, um den nächsten Raum freizuschalten.</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('a2000000-0000-0001-0001-000000000001','a2000000-0000-0000-0001-000000000001',
   'Ergänze: Ich wasche ___ jeden Morgen.','multiple_choice',
   '["mich", "mir", "sich", "dich"]'::jsonb,'mich',
   'Reflexivpronomen 1. Person Singular Akkusativ: mich.',NOW()),
  ('a2000000-0000-0001-0001-000000000002','a2000000-0000-0000-0001-000000000001',
   'Ergänze: Wir müssen ___ beeilen!','multiple_choice',
   '["sich", "uns", "euch", "mich"]'::jsonb,'uns',
   '1. Person Plural: wir → uns.',NOW()),
  ('a2000000-0000-0001-0001-000000000003','a2000000-0000-0000-0001-000000000001',
   'Welcher Satz ist richtig?','multiple_choice',
   '["Sie freut sich auf das Wochenende.", "Sie freut auf das Wochenende sich.", "Sie sich freut auf das Wochenende.", "Sich freut sie auf das Wochenende."]'::jsonb,
   'Sie freut sich auf das Wochenende.',
   'Das Reflexivpronomen steht direkt nach dem konjugierten Verb.',NOW()),

  ('a2000000-0000-0001-0002-000000000001','a2000000-0000-0000-0001-000000000002',
   'Ergänze: Ich ___ um 7 Uhr ___. (aufstehen)','multiple_choice',
   '["stehe ... auf", "aufstehe ...", "stehe auf ...", "auf ... stehe"]'::jsonb,'stehe ... auf',
   'Trennbares Verb im Hauptsatz: Präfix ans Ende — Ich stehe um 7 Uhr auf.',NOW()),
  ('a2000000-0000-0001-0002-000000000002','a2000000-0000-0000-0001-000000000002',
   'Welcher Satz mit Modalverb ist richtig?','multiple_choice',
   '["Ich muss um 7 Uhr aufstehen.", "Ich muss um 7 Uhr stehe auf.", "Ich aufstehen muss um 7 Uhr.", "Ich muss aufstehe um 7 Uhr."]'::jsonb,
   'Ich muss um 7 Uhr aufstehen.',
   'Nach Modalverben steht der ganze Infinitiv (ungetrennt) am Satzende.',NOW()),
  ('a2000000-0000-0001-0002-000000000003','a2000000-0000-0000-0001-000000000002',
   'Was bedeutet "gegen 18 Uhr"?','multiple_choice',
   '["Genau um 18 Uhr", "Ungefähr um 18 Uhr", "Vor 18 Uhr", "Nach 18 Uhr"]'::jsonb,
   'Ungefähr um 18 Uhr',
   '"Gegen" + Uhrzeit bedeutet "ungefähr/circa".',NOW()),

  ('a2000000-0000-0001-0003-000000000001','a2000000-0000-0000-0001-000000000003',
   'Ordne: Was ist häufiger als "manchmal"?','multiple_choice',
   '["nie", "selten", "oft", "keins davon"]'::jsonb,'oft',
   'Skala: nie < selten < manchmal < oft < meistens < immer.',NOW()),
  ('a2000000-0000-0001-0003-000000000002','a2000000-0000-0000-0001-000000000003',
   'Welcher Satz ist richtig?','multiple_choice',
   '["Ich gehe oft ins Fitnessstudio.", "Ich oft gehe ins Fitnessstudio.", "Oft ich gehe ins Fitnessstudio.", "Ich gehe ins oft Fitnessstudio."]'::jsonb,
   'Ich gehe oft ins Fitnessstudio.',
   'Häufigkeitsadverbien stehen meist direkt nach dem Verb.',NOW()),

  ('a2000000-0000-0001-0099-000000000001','a2000000-0000-0000-0001-000000000099',
   'Ergänze: Er zieht ___ schnell an.','multiple_choice',
   '["sich", "ihm", "ihn", "er"]'::jsonb,'sich',
   '3. Person Singular reflexiv: sich.',NOW()),
  ('a2000000-0000-0001-0099-000000000002','a2000000-0000-0000-0001-000000000099',
   'Ergänze: Sie ___ nach der Arbeit ___. (einkaufen)','multiple_choice',
   '["kauft ... ein", "einkauft ...", "kauft ein ...", "ein ... kauft"]'::jsonb,'kauft ... ein',
   'Trennbar: Sie kauft nach der Arbeit ein.',NOW()),
  ('a2000000-0000-0001-0099-000000000003','a2000000-0000-0000-0001-000000000099',
   '"Alle zwei Tage" bedeutet:','multiple_choice',
   '["Zweimal am Tag", "Jeden zweiten Tag", "Zwei Tage lang", "Selten"]'::jsonb,
   'Jeden zweiten Tag',
   '"Alle zwei Tage" = jeden zweiten Tag.',NOW()),
  ('a2000000-0000-0001-0099-000000000004','a2000000-0000-0000-0001-000000000099',
   'Welcher Satz ist FALSCH?','multiple_choice',
   '["Wir ruhen uns am Sonntag aus.", "Ich sehe abends fern.", "Er ruft an seine Mutter.", "Du kämmst dich."]'::jsonb,
   'Er ruft an seine Mutter.',
   'Richtig wäre: "Er ruft seine Mutter an." — das Präfix gehört ans Satzende.',NOW()),
  ('a2000000-0000-0001-0099-000000000005','a2000000-0000-0000-0001-000000000099',
   'Ergänze: Ihr ruht ___ am Wochenende aus.','multiple_choice',
   '["sich", "uns", "euch", "ihr"]'::jsonb,'euch',
   '2. Person Plural: ihr → euch.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 02 – Reisen & Verkehr
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('a2000000-0000-0000-0002-000000000001','a2000000-0000-0000-0000-000000000002',
   'a2-am-bahnhof','Am Bahnhof & Tickets kaufen',
   '<h2>Am Bahnhof & Tickets kaufen</h2>
<h3>1. Wichtige Wörter</h3>
<ul>
<li><strong>die Fahrkarte / das Ticket</strong> – einfach oder hin und zurück?</li>
<li><strong>das Gleis</strong> – Der Zug fährt von Gleis 7 ab.</li>
<li><strong>die Verspätung</strong> – Der ICE hat 20 Minuten Verspätung.</li>
<li><strong>umsteigen</strong> – Sie müssen in Köln umsteigen.</li>
<li><strong>die Verbindung</strong> – Gibt es eine direkte Verbindung?</li>
</ul>
<h3>2. Dialog am Schalter</h3>
<p><em>— Guten Tag, eine Fahrkarte nach München, bitte.<br>
— Einfach oder hin und zurück?<br>
— Hin und zurück, bitte. Mit Bahncard 25.<br>
— Gern. Der nächste Zug fährt um 14:32 von Gleis 12. Sie müssen in Nürnberg umsteigen.<br>
— Vielen Dank!</em></p>
<h3>3. Nützliche Fragen</h3>
<ul>
<li>Wann fährt der nächste Zug nach ...?</li>
<li>Von welchem Gleis fährt der Zug ab?</li>
<li>Muss ich umsteigen?</li>
<li>Ist der Zug pünktlich?</li>
</ul>',
   1,NOW()),
  ('a2000000-0000-0000-0002-000000000002','a2000000-0000-0000-0000-000000000002',
   'a2-perfekt-reisen','Über Reisen sprechen: das Perfekt',
   '<h2>Über Reisen sprechen: das Perfekt</h2>
<p>Wenn du von einer Reise erzählst, brauchst du das Perfekt — und bei Bewegungsverben das Hilfsverb <strong>sein</strong>.</p>
<h3>1. sein oder haben?</h3>
<table>
<thead><tr><th>Mit SEIN (Bewegung/Zustandswechsel)</th><th>Mit HABEN (alles andere)</th></tr></thead>
<tbody>
<tr><td>Ich <strong>bin</strong> nach Rom <strong>geflogen</strong>.</td><td>Ich <strong>habe</strong> viel <strong>fotografiert</strong>.</td></tr>
<tr><td>Wir <strong>sind</strong> mit dem Zug <strong>gefahren</strong>.</td><td>Wir <strong>haben</strong> ein Hotel <strong>gebucht</strong>.</td></tr>
<tr><td>Sie <strong>ist</strong> spät <strong>angekommen</strong>.</td><td>Sie <strong>hat</strong> Souvenirs <strong>gekauft</strong>.</td></tr>
</tbody>
</table>
<h3>2. Eine Reise erzählen — Mustertext</h3>
<p><em>Letzten Sommer bin ich nach Österreich gefahren. Ich habe in einem kleinen Hotel in den Bergen gewohnt. Jeden Tag bin ich gewandert und habe die Natur fotografiert. Das Essen hat mir sehr gut geschmeckt. Nach einer Woche bin ich müde, aber glücklich nach Hause gekommen.</em></p>
<h3>3. Typische Reiseverben im Perfekt</h3>
<ul>
<li>fahren → ist gefahren | fliegen → ist geflogen | ankommen → ist angekommen</li>
<li>buchen → hat gebucht | packen → hat gepackt | besichtigen → hat besichtigt</li>
</ul>',
   2,NOW()),
  ('a2000000-0000-0000-0002-000000000003','a2000000-0000-0000-0000-000000000002',
   'a2-reiseprobleme','Probleme unterwegs lösen',
   '<h2>Probleme unterwegs lösen</h2>
<p>Verspätung, verlorenes Gepäck, falsches Zimmer — auf Reisen geht nicht immer alles glatt.</p>
<h3>1. Probleme benennen</h3>
<ul>
<li>Mein Zug <strong>hatte Verspätung</strong>, deshalb habe ich den Anschluss <strong>verpasst</strong>.</li>
<li>Mein Koffer <strong>ist</strong> nicht <strong>angekommen</strong>.</li>
<li>Das Zimmer ist <strong>zu laut</strong> / <strong>nicht sauber</strong>.</li>
<li>Ich habe meine Tasche im Bus <strong>vergessen</strong>.</li>
</ul>
<h3>2. Höflich um Hilfe bitten</h3>
<ul>
<li><strong>Entschuldigung, können Sie mir helfen?</strong></li>
<li><strong>Was kann ich jetzt tun?</strong></li>
<li><strong>Bekomme ich mein Geld zurück?</strong></li>
<li><strong>Gibt es einen späteren Zug?</strong></li>
</ul>
<h3>3. Am Fundbüro</h3>
<p><em>— Guten Tag, ich habe meine Tasche in der U-Bahn vergessen.<br>
— Wie sieht die Tasche aus?<br>
— Sie ist schwarz und ziemlich groß. Mein Laptop ist darin.<br>
— Einen Moment... Sie haben Glück! Jemand hat sie abgegeben.</em></p>',
   3,NOW()),
  ('a2000000-0000-0000-0002-000000000099','a2000000-0000-0000-0000-000000000002',
   'a2-room02-quiz','Checkpoint: Reisen & Verkehr',
   '<h2>Checkpoint Quiz</h2><p>Bahnhof, Perfekt mit sein/haben, Reiseprobleme — zeig, was du kannst!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('a2000000-0000-0002-0001-000000000001','a2000000-0000-0000-0002-000000000001',
   'Was bedeutet "umsteigen"?','multiple_choice',
   '["Den Zug wechseln", "Aussteigen", "Einsteigen", "Das Ticket kaufen"]'::jsonb,
   'Den Zug wechseln',
   '"Umsteigen" = von einem Zug/Bus in einen anderen wechseln.',NOW()),
  ('a2000000-0000-0002-0001-000000000002','a2000000-0000-0000-0002-000000000001',
   '"Der Zug fährt von ___ 7 ab."','multiple_choice',
   '["Gleis", "Bahnhof", "Schalter", "Verbindung"]'::jsonb,'Gleis',
   'Züge fahren von einem Gleis ab.',NOW()),
  ('a2000000-0000-0002-0001-000000000003','a2000000-0000-0000-0002-000000000001',
   'Du willst hin- UND zurückfahren. Was sagst du?','multiple_choice',
   '["Einfach, bitte.", "Hin und zurück, bitte.", "Nur hin, bitte.", "Mit Umsteigen, bitte."]'::jsonb,
   'Hin und zurück, bitte.',
   '"Hin und zurück" = return ticket.',NOW()),

  ('a2000000-0000-0002-0002-000000000001','a2000000-0000-0000-0002-000000000002',
   'Ergänze: Ich ___ nach Rom geflogen.','multiple_choice',
   '["habe", "bin", "war", "ist"]'::jsonb,'bin',
   'Bewegungsverben bilden das Perfekt mit "sein".',NOW()),
  ('a2000000-0000-0002-0002-000000000002','a2000000-0000-0000-0002-000000000002',
   'Ergänze: Wir ___ ein Hotel gebucht.','multiple_choice',
   '["sind", "haben", "waren", "hat"]'::jsonb,'haben',
   '"Buchen" ist keine Bewegung → Perfekt mit "haben".',NOW()),
  ('a2000000-0000-0002-0002-000000000003','a2000000-0000-0000-0002-000000000002',
   'Welcher Satz ist richtig?','multiple_choice',
   '["Sie ist spät angekommen.", "Sie hat spät angekommen.", "Sie ist spät angekommt.", "Sie hat spät ankommen."]'::jsonb,
   'Sie ist spät angekommen.',
   '"Ankommen" = Bewegung → sein + angekommen.',NOW()),

  ('a2000000-0000-0002-0003-000000000001','a2000000-0000-0000-0002-000000000003',
   'Dein Zug hatte Verspätung. Was ist passiert?','multiple_choice',
   '["Er war zu früh", "Er kam später als geplant", "Er ist ausgefallen", "Er war voll"]'::jsonb,
   'Er kam später als geplant',
   '"Verspätung haben" = später kommen als geplant.',NOW()),
  ('a2000000-0000-0002-0003-000000000002','a2000000-0000-0000-0002-000000000003',
   'Wo meldest du eine vergessene Tasche?','multiple_choice',
   '["Am Fundbüro", "Am Kiosk", "Im Restaurant", "Am Geldautomaten"]'::jsonb,
   'Am Fundbüro',
   'Verlorene/vergessene Sachen → Fundbüro (lost and found).',NOW()),

  ('a2000000-0000-0002-0099-000000000001','a2000000-0000-0000-0002-000000000099',
   'Ergänze: Letzten Sommer ___ ich nach Spanien gefahren.','multiple_choice',
   '["habe", "bin", "hatte", "war"]'::jsonb,'bin',
   'Fahren = Bewegung → Perfekt mit sein.',NOW()),
  ('a2000000-0000-0002-0099-000000000002','a2000000-0000-0000-0002-000000000099',
   'Ergänze: Ich ___ viele Fotos gemacht.','multiple_choice',
   '["bin", "habe", "ist", "sind"]'::jsonb,'habe',
   'Fotos machen → keine Bewegung → haben.',NOW()),
  ('a2000000-0000-0002-0099-000000000003','a2000000-0000-0000-0002-000000000099',
   'Du hast den Anschlusszug verpasst. Was fragst du?','multiple_choice',
   '["Gibt es einen späteren Zug?", "Wo ist das Restaurant?", "Wie heißen Sie?", "Was kostet ein Taxi nach Hause?"]'::jsonb,
   'Gibt es einen späteren Zug?',
   'Die praktische Frage nach der nächsten Verbindung.',NOW()),
  ('a2000000-0000-0002-0099-000000000004','a2000000-0000-0000-0002-000000000099',
   '"Muss ich umsteigen?" — Was möchtest du wissen?','multiple_choice',
   '["Ob die Fahrt direkt ist", "Ob der Zug pünktlich ist", "Was das Ticket kostet", "Wo der Bahnhof ist"]'::jsonb,
   'Ob die Fahrt direkt ist',
   'Wer nicht umsteigen muss, hat eine direkte Verbindung.',NOW()),
  ('a2000000-0000-0002-0099-000000000005','a2000000-0000-0000-0002-000000000099',
   'Welcher Satz ist FALSCH?','multiple_choice',
   '["Wir sind mit dem Zug gefahren.", "Ich habe ein Zimmer gebucht.", "Sie ist Souvenirs gekauft.", "Er ist spät angekommen."]'::jsonb,
   'Sie ist Souvenirs gekauft.',
   'Kaufen → haben: "Sie hat Souvenirs gekauft."',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 03 – Gesundheit & Körper
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('a2000000-0000-0000-0003-000000000001','a2000000-0000-0000-0000-000000000003',
   'a2-koerperteile','Der Körper & Schmerzen beschreiben',
   '<h2>Der Körper & Schmerzen beschreiben</h2>
<h3>1. Die wichtigsten Körperteile</h3>
<ul>
<li><strong>der Kopf</strong> – head | <strong>der Hals</strong> – throat/neck</li>
<li><strong>der Bauch</strong> – belly | <strong>der Rücken</strong> – back</li>
<li><strong>das Bein</strong> – leg | <strong>der Arm</strong> – arm</li>
<li><strong>die Hand</strong> – hand | <strong>der Fuß</strong> – foot</li>
<li><strong>das Auge</strong> – eye | <strong>das Ohr</strong> – ear</li>
</ul>
<h3>2. Schmerzen ausdrücken — drei Wege</h3>
<ul>
<li><strong>Ich habe Kopfschmerzen.</strong> (Körperteil + schmerzen)</li>
<li><strong>Mein Rücken tut weh.</strong> (tut weh / tun weh)</li>
<li><strong>Mir ist schlecht / schwindelig.</strong> (Dativ für Zustände)</li>
</ul>
<h3>3. Weitere Beschwerden</h3>
<ul>
<li>Ich habe <strong>Fieber</strong> / <strong>Husten</strong> / <strong>Schnupfen</strong>.</li>
<li>Ich bin <strong>erkältet</strong>.</li>
<li>Ich fühle mich <strong>schwach</strong> / <strong>müde</strong>.</li>
</ul>',
   1,NOW()),
  ('a2000000-0000-0000-0003-000000000002','a2000000-0000-0000-0000-000000000003',
   'a2-beim-arzt','Beim Arzt: der Termin',
   '<h2>Beim Arzt: der Termin</h2>
<h3>1. Einen Termin vereinbaren</h3>
<p><em>— Praxis Dr. Weber, guten Tag.<br>
— Guten Tag, ich hätte gern einen Termin. Ich habe seit drei Tagen starke Halsschmerzen.<br>
— Können Sie morgen um 9:30 Uhr kommen?<br>
— Ja, das passt. Vielen Dank!</em></p>
<h3>2. Im Sprechzimmer</h3>
<ul>
<li>Arzt: <strong>Was fehlt Ihnen?</strong> / <strong>Wo tut es weh?</strong></li>
<li>Du: <em>Ich habe seit Montag Fieber und Husten.</em></li>
<li>Arzt: <strong>Seit wann haben Sie die Beschwerden?</strong></li>
<li>Du: <em>Seit ungefähr einer Woche.</em></li>
</ul>
<h3>3. Wichtige Wörter in der Praxis</h3>
<ul>
<li><strong>die Versichertenkarte</strong> – bitte an der Anmeldung zeigen</li>
<li><strong>das Wartezimmer</strong> – bitte nehmen Sie Platz</li>
<li><strong>das Rezept</strong> – damit holst du Medikamente in der Apotheke</li>
<li><strong>die Krankschreibung</strong> – für den Arbeitgeber</li>
</ul>',
   2,NOW()),
  ('a2000000-0000-0000-0003-000000000003','a2000000-0000-0000-0000-000000000003',
   'a2-imperativ-ratschlaege','Ratschläge geben: der Imperativ',
   '<h2>Ratschläge geben: der Imperativ</h2>
<p>Der Arzt sagt dir, was du tun sollst — mit dem Imperativ oder mit "sollten".</p>
<h3>1. Imperativ-Formen</h3>
<table>
<thead><tr><th>Infinitiv</th><th>du</th><th>Sie</th></tr></thead>
<tbody>
<tr><td>trinken</td><td><strong>Trink</strong> viel Wasser!</td><td><strong>Trinken Sie</strong> viel Wasser!</td></tr>
<tr><td>bleiben</td><td><strong>Bleib</strong> im Bett!</td><td><strong>Bleiben Sie</strong> im Bett!</td></tr>
<tr><td>nehmen</td><td><strong>Nimm</strong> die Tabletten!</td><td><strong>Nehmen Sie</strong> die Tabletten!</td></tr>
<tr><td>schlafen</td><td><strong>Schlaf</strong> genug!</td><td><strong>Schlafen Sie</strong> genug!</td></tr>
</tbody>
</table>
<h3>2. Höflicher: sollten</h3>
<ul>
<li>Sie <strong>sollten</strong> viel trinken und sich ausruhen.</li>
<li>Du <strong>solltest</strong> zwei Tage zu Hause bleiben.</li>
</ul>
<h3>3. Typische Arzt-Ratschläge</h3>
<ul>
<li>Nehmen Sie die Medikamente <strong>dreimal täglich</strong> — <strong>vor dem Essen</strong>.</li>
<li>Kommen Sie <strong>in einer Woche</strong> wieder, wenn es nicht besser wird.</li>
</ul>',
   3,NOW()),
  ('a2000000-0000-0000-0003-000000000099','a2000000-0000-0000-0000-000000000003',
   'a2-room03-quiz','Checkpoint: Gesundheit & Körper',
   '<h2>Checkpoint Quiz</h2><p>Körperteile, Arztbesuch und Imperativ — der letzte Schritt in diesem Raum.</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('a2000000-0000-0003-0001-000000000001','a2000000-0000-0000-0003-000000000001',
   '"Mein Rücken ___ weh."','multiple_choice',
   '["tut", "tun", "hat", "ist"]'::jsonb,'tut',
   'Singular: Mein Rücken tut weh. (Plural: Meine Füße tun weh.)',NOW()),
  ('a2000000-0000-0003-0001-000000000002','a2000000-0000-0000-0003-000000000001',
   'Wie sagt man "I feel dizzy"?','multiple_choice',
   '["Ich bin schwindelig", "Mir ist schwindelig", "Ich habe schwindelig", "Mich ist schwindelig"]'::jsonb,
   'Mir ist schwindelig',
   'Zustände mit Dativ: Mir ist schlecht/schwindelig/kalt.',NOW()),
  ('a2000000-0000-0003-0001-000000000003','a2000000-0000-0000-0003-000000000001',
   '"Ich bin erkältet" bedeutet:','multiple_choice',
   '["Ich habe eine Erkältung", "Mir ist kalt", "Ich war im Kalten", "Ich habe Fieber"]'::jsonb,
   'Ich habe eine Erkältung',
   '"Erkältet sein" = eine Erkältung haben (a cold).',NOW()),

  ('a2000000-0000-0003-0002-000000000001','a2000000-0000-0000-0003-000000000002',
   'Was fragt der Arzt zuerst?','multiple_choice',
   '["Was fehlt Ihnen?", "Wie heißen Ihre Eltern?", "Wo wohnen Sie?", "Was arbeiten Sie?"]'::jsonb,
   'Was fehlt Ihnen?',
   '"Was fehlt Ihnen?" = What seems to be the problem?',NOW()),
  ('a2000000-0000-0003-0002-000000000002','a2000000-0000-0000-0003-000000000002',
   'Womit holst du Medikamente in der Apotheke?','multiple_choice',
   '["Mit dem Rezept", "Mit der Krankschreibung", "Mit dem Termin", "Mit dem Wartezimmer"]'::jsonb,
   'Mit dem Rezept',
   'Das Rezept (prescription) ist für die Apotheke.',NOW()),
  ('a2000000-0000-0003-0002-000000000003','a2000000-0000-0000-0003-000000000002',
   '"Seit wann haben Sie die Beschwerden?" — Gute Antwort:','multiple_choice',
   '["Seit ungefähr einer Woche.", "Um 9:30 Uhr.", "Dreimal täglich.", "In der Apotheke."]'::jsonb,
   'Seit ungefähr einer Woche.',
   '"Seit wann" fragt nach dem Beginn → "Seit einer Woche."',NOW()),

  ('a2000000-0000-0003-0003-000000000001','a2000000-0000-0000-0003-000000000003',
   'Imperativ (du) von "nehmen":','multiple_choice',
   '["Nehm die Tabletten!", "Nimm die Tabletten!", "Nehmen die Tabletten!", "Nimmst die Tabletten!"]'::jsonb,
   'Nimm die Tabletten!',
   '"Nehmen" ist unregelmäßig: du nimmst → Nimm!',NOW()),
  ('a2000000-0000-0003-0003-000000000002','a2000000-0000-0000-0003-000000000003',
   'Höfliche Sie-Form: "___ Sie viel Wasser!"','multiple_choice',
   '["Trink", "Trinken", "Trinkt", "Trank"]'::jsonb,'Trinken',
   'Sie-Imperativ: Infinitiv + Sie — Trinken Sie!',NOW()),

  ('a2000000-0000-0003-0099-000000000001','a2000000-0000-0000-0003-000000000099',
   '"Ich habe seit Montag Husten und ___."','multiple_choice',
   '["Schnupfen", "Rezept", "Gleis", "Termin"]'::jsonb,'Schnupfen',
   'Husten und Schnupfen sind typische Erkältungssymptome.',NOW()),
  ('a2000000-0000-0003-0099-000000000002','a2000000-0000-0000-0003-000000000099',
   'Plural: "Meine Füße ___ weh."','multiple_choice',
   '["tut", "tun", "tuen", "sind"]'::jsonb,'tun',
   'Plural: Meine Füße tun weh.',NOW()),
  ('a2000000-0000-0003-0099-000000000003','a2000000-0000-0000-0003-000000000099',
   'Der Arzt sagt: "Sie sollten zwei Tage im Bett bleiben." Das ist:','multiple_choice',
   '["Ein Befehl", "Ein höflicher Ratschlag", "Eine Frage", "Eine Diagnose"]'::jsonb,
   'Ein höflicher Ratschlag',
   '"Sollten" macht Ratschläge höflicher als der Imperativ.',NOW()),
  ('a2000000-0000-0003-0099-000000000004','a2000000-0000-0000-0003-000000000099',
   'Was zeigst du an der Anmeldung in der Praxis?','multiple_choice',
   '["Die Versichertenkarte", "Das Rezept", "Den Reisepass", "Die Krankschreibung"]'::jsonb,
   'Die Versichertenkarte',
   'An der Anmeldung: Versichertenkarte (health insurance card).',NOW()),
  ('a2000000-0000-0003-0099-000000000005','a2000000-0000-0000-0003-000000000099',
   'Du-Imperativ von "schlafen":','multiple_choice',
   '["Schlaf genug!", "Schläfst genug!", "Schlafen genug!", "Schlief genug!"]'::jsonb,
   'Schlaf genug!',
   'Du-Imperativ: Verbstamm ohne -st — Schlaf!',NOW())
ON CONFLICT (id) DO NOTHING;
