-- ============================================================
-- DeutschPilot – A2/B1/B2 Speaking Practice
-- Additive only: new courses + lessons + exercises using the
-- existing 'speaking_prompt' exercise type (from commit 2e5b0d7).
-- Does NOT modify any existing rows. Safe to re-run
-- (uses ON CONFLICT DO NOTHING).
-- Appears automatically on the public /courses page once run.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- COURSES
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.courses (id, title, slug, description, level, language, is_published, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000015',
   'A2 Speaking Practice',
   'a2-speaking-practice',
   'Record yourself saying everyday German phrases and compare against a model answer.',
   'A2', 'de', TRUE, NOW()),
  ('00000000-0000-0000-0000-000000000016',
   'B1 Speaking Practice',
   'b1-speaking-practice',
   'Record yourself giving short opinions and everyday statements in German.',
   'B1', 'de', TRUE, NOW()),
  ('00000000-0000-0000-0000-000000000017',
   'B2 Speaking Practice',
   'b2-speaking-practice',
   'Record yourself discussing more abstract topics in German.',
   'B2', 'de', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – A2
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0015-000000000001',
   '00000000-0000-0000-0000-000000000015',
   'Nach dem Weg fragen',
   'nach-dem-weg-fragen-sprechen',
   '<h2>Sprechübung: Nach dem Weg fragen</h2>
<p>Übe, wie man nach dem Weg fragt. Sprich den Satz laut aus.</p>',
   1, NULL, NOW()),
  ('00000000-0000-0000-0015-000000000002',
   '00000000-0000-0000-0000-000000000015',
   'Über den Tagesablauf sprechen',
   'tagesablauf-sprechen',
   '<h2>Sprechübung: Über den Tagesablauf sprechen</h2>
<p>Übe, deinen Tagesablauf laut zu beschreiben.</p>',
   2, NULL, NOW()),
  ('00000000-0000-0000-0015-000000000003',
   '00000000-0000-0000-0000-000000000015',
   'Im Geschäft einkaufen',
   'im-geschaeft-einkaufen-sprechen',
   '<h2>Sprechübung: Im Geschäft einkaufen</h2>
<p>Übe, wie man im Geschäft nach einem Produkt fragt.</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – B1
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0016-000000000001',
   '00000000-0000-0000-0000-000000000016',
   'Meine Meinung äußern',
   'meinung-aeussern-sprechen',
   '<h2>Sprechübung: Meine Meinung äußern</h2>
<p>Übe, eine kurze Meinung laut zu formulieren.</p>',
   1, NULL, NOW()),
  ('00000000-0000-0000-0016-000000000002',
   '00000000-0000-0000-0000-000000000016',
   'Über Erfahrungen sprechen',
   'erfahrungen-sprechen',
   '<h2>Sprechübung: Über Erfahrungen sprechen</h2>
<p>Übe, über eine vergangene Erfahrung zu sprechen.</p>',
   2, NULL, NOW()),
  ('00000000-0000-0000-0016-000000000003',
   '00000000-0000-0000-0000-000000000016',
   'Ein Telefongespräch führen',
   'telefongespraech-sprechen',
   '<h2>Sprechübung: Ein Telefongespräch führen</h2>
<p>Übe, einen Termin am Telefon zu vereinbaren.</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – B2
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0017-000000000001',
   '00000000-0000-0000-0000-000000000017',
   'Über Technologie diskutieren',
   'technologie-diskutieren-sprechen',
   '<h2>Sprechübung: Über Technologie diskutieren</h2>
<p>Übe, eine differenzierte Meinung zu einem abstrakten Thema zu äußern.</p>',
   1, NULL, NOW()),
  ('00000000-0000-0000-0017-000000000002',
   '00000000-0000-0000-0000-000000000017',
   'Eine Präsentation beginnen',
   'praesentation-beginnen-sprechen',
   '<h2>Sprechübung: Eine Präsentation beginnen</h2>
<p>Übe, eine formelle Präsentation zu eröffnen.</p>',
   2, NULL, NOW()),
  ('00000000-0000-0000-0017-000000000003',
   '00000000-0000-0000-0000-000000000017',
   'Einen Kompromiss vorschlagen',
   'kompromiss-vorschlagen-sprechen',
   '<h2>Sprechübung: Einen Kompromiss vorschlagen</h2>
<p>Übe, in einer Diskussion einen Kompromiss zu formulieren.</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES (type: speaking_prompt)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0015-0001-000000000001',
   '00000000-0000-0000-0015-000000000001',
   'Sag laut: ''Entschuldigung, wie komme ich zum Bahnhof?''',
   'speaking_prompt',
   NULL,
   'Entschuldigung, wie komme ich zum Bahnhof?',
   'Achte auf die Betonung: ent-SCHUL-digung, wie KOMM-e ich zum BAHN-hof?',
   NOW()),

  ('00000000-0000-0015-0002-000000000001',
   '00000000-0000-0000-0015-000000000002',
   'Sag laut: ''Ich stehe normalerweise um sieben Uhr auf und frühstücke danach.''',
   'speaking_prompt',
   NULL,
   'Ich stehe normalerweise um sieben Uhr auf und frühstücke danach.',
   'Sprich "normalerweise" langsam aus: nor-MA-ler-wei-se.',
   NOW()),

  ('00000000-0000-0015-0003-000000000001',
   '00000000-0000-0000-0015-000000000003',
   'Sag laut: ''Entschuldigung, haben Sie das auch in einer anderen Größe?''',
   'speaking_prompt',
   NULL,
   'Entschuldigung, haben Sie das auch in einer anderen Größe?',
   'Achte auf "Größe" - GRÖ-ße, mit einem langen Ö-Laut.',
   NOW()),

  ('00000000-0000-0016-0001-000000000001',
   '00000000-0000-0000-0016-000000000001',
   'Sag laut: ''Meiner Meinung nach ist Homeoffice eine gute Sache, weil man flexibler arbeiten kann.''',
   'speaking_prompt',
   NULL,
   'Meiner Meinung nach ist Homeoffice eine gute Sache, weil man flexibler arbeiten kann.',
   'Sprich den ganzen Satz flüssig, ohne lange Pausen zwischen den Wörtern.',
   NOW()),

  ('00000000-0000-0016-0002-000000000001',
   '00000000-0000-0000-0016-000000000002',
   'Sag laut: ''Letztes Jahr habe ich eine sehr interessante Erfahrung gemacht.''',
   'speaking_prompt',
   NULL,
   'Letztes Jahr habe ich eine sehr interessante Erfahrung gemacht.',
   'Achte auf die Satzstellung: Position 2 ist "habe", das Partizip "gemacht" steht am Ende.',
   NOW()),

  ('00000000-0000-0016-0003-000000000001',
   '00000000-0000-0000-0016-000000000003',
   'Sag laut: ''Guten Tag, ich möchte gerne einen Termin für nächste Woche vereinbaren.''',
   'speaking_prompt',
   NULL,
   'Guten Tag, ich möchte gerne einen Termin für nächste Woche vereinbaren.',
   'Sprich höflich und deutlich, wie in einem echten Telefongespräch.',
   NOW()),

  ('00000000-0000-0017-0001-000000000001',
   '00000000-0000-0000-0017-000000000001',
   'Sag laut: ''Auf der einen Seite bietet künstliche Intelligenz viele Vorteile, auf der anderen Seite birgt sie auch Risiken.''',
   'speaking_prompt',
   NULL,
   'Auf der einen Seite bietet künstliche Intelligenz viele Vorteile, auf der anderen Seite birgt sie auch Risiken.',
   'Übe den Kontrast "auf der einen Seite... auf der anderen Seite" mit klarer Betonung.',
   NOW()),

  ('00000000-0000-0017-0002-000000000001',
   '00000000-0000-0000-0017-000000000002',
   'Sag laut: ''Guten Tag, vielen Dank, dass Sie sich heute Zeit genommen haben. Ich möchte Ihnen unser neues Projekt vorstellen.''',
   'speaking_prompt',
   NULL,
   'Guten Tag, vielen Dank, dass Sie sich heute Zeit genommen haben. Ich möchte Ihnen unser neues Projekt vorstellen.',
   'Sprich formell und selbstbewusst, wie zu Beginn einer echten Präsentation.',
   NOW()),

  ('00000000-0000-0017-0003-000000000001',
   '00000000-0000-0000-0017-000000000003',
   'Sag laut: ''Ich verstehe Ihren Standpunkt, aber vielleicht könnten wir einen Mittelweg finden.''',
   'speaking_prompt',
   NULL,
   'Ich verstehe Ihren Standpunkt, aber vielleicht könnten wir einen Mittelweg finden.',
   'Achte auf einen diplomatischen, ruhigen Tonfall.',
   NOW())
ON CONFLICT (id) DO NOTHING;
