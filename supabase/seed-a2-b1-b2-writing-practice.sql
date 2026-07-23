-- ============================================================
-- DeutschPilot – A2/B1/B2 Writing Practice
-- Additive only: new courses + lessons + exercises using the
-- existing 'writing_prompt' exercise type (from commit ddced77).
-- Does NOT modify any existing rows. Safe to re-run
-- (uses ON CONFLICT DO NOTHING).
-- Appears automatically on the public /courses page once run.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- COURSES
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.courses (id, title, slug, description, level, language, is_published, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000012',
   'A2 Writing Practice',
   'a2-writing-practice',
   'Everyday writing prompts for A2 learners, with instant AI feedback on your German.',
   'A2', 'de', TRUE, NOW()),
  ('00000000-0000-0000-0000-000000000013',
   'B1 Writing Practice',
   'b1-writing-practice',
   'Opinion and everyday writing prompts for B1 learners, with instant AI feedback.',
   'B1', 'de', TRUE, NOW()),
  ('00000000-0000-0000-0000-000000000014',
   'B2 Writing Practice',
   'b2-writing-practice',
   'Argumentative and abstract writing prompts for B2 learners, with instant AI feedback.',
   'B2', 'de', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – A2
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0012-000000000001',
   '00000000-0000-0000-0000-000000000012',
   'Mein letzter Urlaub',
   'mein-letzter-urlaub-schreiben',
   '<h2>Schreibaufgabe: Mein letzter Urlaub</h2>
<p>Schreibe 4-5 Sätze im Perfekt über deinen letzten Urlaub. Wohin bist du gefahren? Was hast du gemacht?</p>',
   1, NULL, NOW()),
  ('00000000-0000-0000-0012-000000000002',
   '00000000-0000-0000-0000-000000000012',
   'Meine Wochenendpläne',
   'meine-wochenendplaene-schreiben',
   '<h2>Schreibaufgabe: Meine Wochenendpläne</h2>
<p>Schreibe 3-4 Sätze über deine Pläne für das nächste Wochenende. Benutze das Futur oder "möchte".</p>',
   2, NULL, NOW()),
  ('00000000-0000-0000-0012-000000000003',
   '00000000-0000-0000-0000-000000000012',
   'Eine Person, die ich gut kenne',
   'eine-person-schreiben',
   '<h2>Schreibaufgabe: Eine Person, die ich gut kenne</h2>
<p>Beschreibe 4-5 Sätze eine Person aus deinem Leben (Freund, Familie, Kollege). Wie sieht sie aus? Was macht sie gern?</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – B1
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0013-000000000001',
   '00000000-0000-0000-0000-000000000013',
   'Meine Meinung zum Homeoffice',
   'meinung-homeoffice-schreiben',
   '<h2>Schreibaufgabe: Meine Meinung zum Homeoffice</h2>
<p>Schreibe 5-6 Sätze: Was denkst du über Homeoffice? Nenne Vor- und Nachteile aus deiner Sicht.</p>',
   1, NULL, NOW()),
  ('00000000-0000-0000-0013-000000000002',
   '00000000-0000-0000-0000-000000000013',
   'Eine schwierige Entscheidung',
   'schwierige-entscheidung-schreiben',
   '<h2>Schreibaufgabe: Eine schwierige Entscheidung</h2>
<p>Beschreibe 5-6 Sätze eine schwierige Entscheidung, die du treffen musstest. Wie hast du dich entschieden und warum?</p>',
   2, NULL, NOW()),
  ('00000000-0000-0000-0013-000000000003',
   '00000000-0000-0000-0000-000000000013',
   'Meine Zukunftspläne',
   'zukunftsplaene-schreiben',
   '<h2>Schreibaufgabe: Meine Zukunftspläne</h2>
<p>Schreibe 5-6 Sätze über deine Pläne für die nächsten Jahre. Was möchtest du erreichen?</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – B2
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0014-000000000001',
   '00000000-0000-0000-0000-000000000014',
   'KI am Arbeitsplatz',
   'ki-arbeitsplatz-schreiben',
   '<h2>Schreibaufgabe: Künstliche Intelligenz am Arbeitsplatz</h2>
<p>Schreibe einen kurzen Absatz (6-8 Sätze): Diskutiere die Vor- und Nachteile von künstlicher Intelligenz am Arbeitsplatz.</p>',
   1, NULL, NOW()),
  ('00000000-0000-0000-0014-000000000002',
   '00000000-0000-0000-0000-000000000014',
   'Der demografische Wandel',
   'demografischer-wandel-schreiben',
   '<h2>Schreibaufgabe: Der demografische Wandel</h2>
<p>Schreibe einen kurzen Absatz (6-8 Sätze): Welche Herausforderungen bringt der demografische Wandel mit sich, und wie könnte man ihnen begegnen?</p>',
   2, NULL, NOW()),
  ('00000000-0000-0000-0014-000000000003',
   '00000000-0000-0000-0000-000000000014',
   'Stadt oder Land?',
   'stadt-oder-land-schreiben',
   '<h2>Schreibaufgabe: Stadt oder Land?</h2>
<p>Schreibe einen kurzen Absatz (6-8 Sätze): Was ist deiner Meinung nach besser – das Leben in der Stadt oder auf dem Land? Begründe deine Meinung.</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES (type: writing_prompt)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0012-0001-000000000001',
   '00000000-0000-0000-0012-000000000001',
   'Schreibe 4-5 Sätze im Perfekt über deinen letzten Urlaub.',
   'writing_prompt',
   NULL,
   'Letztes Jahr bin ich nach Italien gefahren. Ich habe dort viele Museen besucht und italienisches Essen probiert. Das Wetter war sehr schön. Es war ein toller Urlaub.',
   'Benutze das Perfekt: ich bin gefahren, ich habe besucht, ich habe probiert.',
   NOW()),

  ('00000000-0000-0012-0002-000000000001',
   '00000000-0000-0000-0012-000000000002',
   'Schreibe 3-4 Sätze über deine Pläne für das nächste Wochenende.',
   'writing_prompt',
   NULL,
   'Am Samstag möchte ich mit Freunden ins Kino gehen. Am Sonntag werde ich meine Familie besuchen. Vielleicht gehe ich auch spazieren.',
   'Benutze "möchte" + Infinitiv oder das Futur mit "werden".',
   NOW()),

  ('00000000-0000-0012-0003-000000000001',
   '00000000-0000-0000-0012-000000000003',
   'Beschreibe 4-5 Sätze eine Person, die du gut kennst.',
   'writing_prompt',
   NULL,
   'Meine beste Freundin heißt Laura. Sie ist groß und hat lange braune Haare. Sie arbeitet als Lehrerin und mag es, Bücher zu lesen. Wir treffen uns oft am Wochenende.',
   'Benutze Adjektive für Aussehen (groß, klein, lange Haare) und "arbeitet als" für den Beruf.',
   NOW()),

  ('00000000-0000-0013-0001-000000000001',
   '00000000-0000-0000-0013-000000000001',
   'Schreibe 5-6 Sätze über deine Meinung zum Homeoffice.',
   'writing_prompt',
   NULL,
   'Ich finde Homeoffice sehr praktisch, weil man flexibler arbeiten kann. Man spart auch Zeit, weil man nicht pendeln muss. Allerdings fehlt manchmal der persönliche Kontakt zu den Kollegen. Ich denke, ein Mix aus Büro und Homeoffice ist am besten.',
   'Benutze Meinungsausdrücke wie "Ich finde...", "Ich denke, dass...", "Meiner Meinung nach...".',
   NOW()),

  ('00000000-0000-0013-0002-000000000001',
   '00000000-0000-0000-0013-000000000002',
   'Beschreibe 5-6 Sätze eine schwierige Entscheidung, die du treffen musstest.',
   'writing_prompt',
   NULL,
   'Letztes Jahr musste ich entscheiden, ob ich in eine andere Stadt ziehe. Es war schwierig, weil ich meine Familie und Freunde zurücklassen musste. Am Ende habe ich mich für den Umzug entschieden, weil die neue Stelle eine große Chance war.',
   'Benutze Nebensätze mit "weil" und "dass" für Begründungen.',
   NOW()),

  ('00000000-0000-0013-0003-000000000001',
   '00000000-0000-0000-0013-000000000003',
   'Schreibe 5-6 Sätze über deine Pläne für die nächsten Jahre.',
   'writing_prompt',
   NULL,
   'In den nächsten Jahren möchte ich meine Deutschkenntnisse verbessern. Ich plane auch, eine neue Stelle zu finden. Vielleicht werde ich auch ins Ausland ziehen. Mein größtes Ziel ist es, glücklich und zufrieden zu sein.',
   'Benutze Zukunftsausdrücke: "ich möchte", "ich plane", "ich werde".',
   NOW()),

  ('00000000-0000-0014-0001-000000000001',
   '00000000-0000-0000-0014-000000000001',
   'Diskutiere die Vor- und Nachteile von künstlicher Intelligenz am Arbeitsplatz (6-8 Sätze).',
   'writing_prompt',
   NULL,
   'Künstliche Intelligenz bietet viele Vorteile, da sie repetitive Aufgaben automatisieren kann und Prozesse effizienter macht. Andererseits befürchten viele Menschen, dass dadurch Arbeitsplätze verloren gehen könnten. Meiner Meinung nach ist es wichtig, dass sich Arbeitnehmer kontinuierlich weiterbilden, um mit den technologischen Entwicklungen Schritt zu halten. So können neue Chancen entstehen, anstatt nur Risiken zu sehen.',
   'Benutze Konnektoren wie "andererseits", "meiner Meinung nach", "um...zu" für eine strukturierte Argumentation.',
   NOW()),

  ('00000000-0000-0014-0002-000000000001',
   '00000000-0000-0000-0014-000000000002',
   'Welche Herausforderungen bringt der demografische Wandel mit sich (6-8 Sätze)?',
   'writing_prompt',
   NULL,
   'Der demografische Wandel stellt Deutschland vor große Herausforderungen, da die Bevölkerung immer älter wird und gleichzeitig die Geburtenrate niedrig bleibt. Dies belastet das Rentensystem und führt zu einem Fachkräftemangel. Um dem entgegenzuwirken, setzt die Regierung auf Zuwanderung und bessere Vereinbarkeit von Familie und Beruf. Dennoch sind meiner Ansicht nach weitere strukturelle Reformen notwendig, um die Situation langfristig zu verbessern.',
   'Benutze Nebensätze mit "da" und "um...zu" sowie Übergangswörter wie "dennoch", "gleichzeitig".',
   NOW()),

  ('00000000-0000-0014-0003-000000000001',
   '00000000-0000-0000-0014-000000000003',
   'Stadt oder Land – was ist deiner Meinung nach besser zum Leben (6-8 Sätze)?',
   'writing_prompt',
   NULL,
   'Sowohl das Leben in der Stadt als auch auf dem Land hat seine Vorzüge. Städte bieten bessere Infrastruktur und mehr Karrieremöglichkeiten, gehen jedoch oft mit hohen Mietpreisen einher. Das Landleben hingegen bietet Ruhe und günstigeren Wohnraum, wobei die Anbindung an öffentliche Verkehrsmittel eingeschränkt sein kann. Meiner Meinung nach hängt die Wahl stark von den persönlichen Prioritäten ab, etwa ob man Karriere oder Ruhe bevorzugt.',
   'Benutze "sowohl...als auch", "jedoch", "wobei" für eine ausgewogene Argumentation.',
   NOW())
ON CONFLICT (id) DO NOTHING;
