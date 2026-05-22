-- ============================================================
-- DeutschPilot – Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor.
-- Safe to re-run (uses ON CONFLICT DO NOTHING).
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- COURSES
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.courses (id, title, slug, description, level, language, is_published, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001',
   'A1 German Starter',
   'a1-german-starter',
   'Begin your German journey. Learn essential greetings, numbers, colours and everyday vocabulary from absolute scratch. Perfect for complete beginners.',
   'A1', 'de', TRUE, NOW() - INTERVAL '4 days'),

  ('00000000-0000-0000-0000-000000000002',
   'A2 Daily German',
   'a2-daily-german',
   'Master everyday communication. Talk about routines, shopping, travel and health. Build confidence for real-life situations in German-speaking countries.',
   'A2', 'de', TRUE, NOW() - INTERVAL '3 days'),

  ('00000000-0000-0000-0000-000000000003',
   'B1 Integration German',
   'b1-integration-german',
   'Communicate fluently in most everyday situations. Work with past tense, modal verbs and complex sentences. Ideal for integration courses and visa requirements.',
   'B1', 'de', TRUE, NOW() - INTERVAL '2 days'),

  ('00000000-0000-0000-0000-000000000004',
   'B2 Work and Study German',
   'b2-work-study-german',
   'Achieve professional fluency. Master the subjunctive, academic writing and business language needed for German universities and workplaces.',
   'B2', 'de', TRUE, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – A1 German Starter
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0001-000000000001',
   '00000000-0000-0000-0000-000000000001',
   'Greetings and Introductions',
   'greetings-introductions',
   '<h2>Greetings in German</h2>
<p>German has different greetings for different times of day and levels of formality.</p>
<h3>Formal Greetings</h3>
<ul>
  <li><strong>Guten Morgen</strong> – Good morning (until ~10:00)</li>
  <li><strong>Guten Tag</strong> – Good day / Hello (daytime)</li>
  <li><strong>Guten Abend</strong> – Good evening</li>
  <li><strong>Auf Wiedersehen</strong> – Goodbye (formal)</li>
</ul>
<h3>Informal Greetings</h3>
<ul>
  <li><strong>Hallo</strong> – Hello</li>
  <li><strong>Hi</strong> – Hi</li>
  <li><strong>Tschüss</strong> – Bye</li>
  <li><strong>Ciao</strong> – Bye (casual)</li>
</ul>
<h3>Introducing Yourself</h3>
<p><strong>Wie heißt du?</strong> – What is your name? (informal)<br>
<strong>Wie heißen Sie?</strong> – What is your name? (formal)<br>
<strong>Ich heiße …</strong> – My name is …<br>
<strong>Ich bin …</strong> – I am …<br>
<strong>Woher kommst du?</strong> – Where are you from?<br>
<strong>Ich komme aus …</strong> – I am from …</p>',
   1, NULL, NOW()),

  ('00000000-0000-0000-0001-000000000002',
   '00000000-0000-0000-0000-000000000001',
   'Numbers and Colours',
   'numbers-colours',
   '<h2>Numbers 1–20</h2>
<p>Learning numbers is essential for everyday life in Germany.</p>
<table>
  <tr><td>1 – eins</td><td>2 – zwei</td><td>3 – drei</td><td>4 – vier</td></tr>
  <tr><td>5 – fünf</td><td>6 – sechs</td><td>7 – sieben</td><td>8 – acht</td></tr>
  <tr><td>9 – neun</td><td>10 – zehn</td><td>11 – elf</td><td>12 – zwölf</td></tr>
  <tr><td>13 – dreizehn</td><td>14 – vierzehn</td><td>15 – fünfzehn</td><td>20 – zwanzig</td></tr>
</table>
<h2>Colours</h2>
<ul>
  <li><strong>rot</strong> – red</li>
  <li><strong>blau</strong> – blue</li>
  <li><strong>grün</strong> – green</li>
  <li><strong>gelb</strong> – yellow</li>
  <li><strong>schwarz</strong> – black</li>
  <li><strong>weiß</strong> – white</li>
</ul>',
   2, NULL, NOW()),

  ('00000000-0000-0000-0001-000000000003',
   '00000000-0000-0000-0000-000000000001',
   'Family and People',
   'family-people',
   '<h2>Family Members</h2>
<p>Learn how to talk about your family in German.</p>
<ul>
  <li><strong>die Mutter</strong> – mother</li>
  <li><strong>der Vater</strong> – father</li>
  <li><strong>die Eltern</strong> – parents</li>
  <li><strong>die Schwester</strong> – sister</li>
  <li><strong>der Bruder</strong> – brother</li>
  <li><strong>die Großmutter / Oma</strong> – grandmother</li>
  <li><strong>der Großvater / Opa</strong> – grandfather</li>
</ul>
<h3>Talking About Your Family</h3>
<p><strong>Ich habe eine Schwester.</strong> – I have a sister.<br>
<strong>Mein Bruder heißt Markus.</strong> – My brother is called Markus.<br>
<strong>Sie ist 25 Jahre alt.</strong> – She is 25 years old.</p>',
   3, NULL, NOW()),

  ('00000000-0000-0000-0001-000000000004',
   '00000000-0000-0000-0000-000000000001',
   'Food and Drinks',
   'food-drinks',
   '<h2>Food and Drinks Vocabulary</h2>
<p>Essential vocabulary for ordering at a café or restaurant in Germany.</p>
<h3>Food</h3>
<ul>
  <li><strong>das Brot</strong> – bread</li>
  <li><strong>die Butter</strong> – butter</li>
  <li><strong>der Käse</strong> – cheese</li>
  <li><strong>das Fleisch</strong> – meat</li>
  <li><strong>das Gemüse</strong> – vegetables</li>
  <li><strong>die Suppe</strong> – soup</li>
</ul>
<h3>Drinks</h3>
<ul>
  <li><strong>das Wasser</strong> – water</li>
  <li><strong>der Kaffee</strong> – coffee</li>
  <li><strong>der Tee</strong> – tea</li>
  <li><strong>das Bier</strong> – beer</li>
  <li><strong>der Saft</strong> – juice</li>
</ul>
<h3>At the Restaurant</h3>
<p><strong>Ich möchte … bestellen.</strong> – I would like to order …<br>
<strong>Die Rechnung, bitte.</strong> – The bill, please.<br>
<strong>Ohne Milch, bitte.</strong> – Without milk, please.</p>',
   4, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – A2 Daily German
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0002-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'Daily Routines',
   'daily-routines',
   '<h2>Talking About Daily Routines</h2>
<p>Describe what you do every day using reflexive verbs and time expressions.</p>
<h3>Key Verbs</h3>
<ul>
  <li><strong>aufstehen</strong> – to get up</li>
  <li><strong>sich waschen</strong> – to wash oneself</li>
  <li><strong>frühstücken</strong> – to have breakfast</li>
  <li><strong>arbeiten</strong> – to work</li>
  <li><strong>schlafen gehen</strong> – to go to sleep</li>
</ul>
<h3>Example Sentences</h3>
<p>Ich stehe um 7 Uhr auf. – I get up at 7 o'clock.<br>
Ich frühstücke um halb acht. – I have breakfast at half past seven.<br>
Um 18 Uhr komme ich nach Hause. – At 6 pm I come home.</p>',
   1, NULL, NOW()),

  ('00000000-0000-0000-0002-000000000002',
   '00000000-0000-0000-0000-000000000002',
   'Shopping and Money',
   'shopping-money',
   '<h2>Shopping in Germany</h2>
<p>Learn how to shop, ask prices and handle money in German.</p>
<h3>Useful Phrases</h3>
<ul>
  <li><strong>Was kostet das?</strong> – How much does this cost?</li>
  <li><strong>Ich suche …</strong> – I am looking for …</li>
  <li><strong>Haben Sie … in Größe …?</strong> – Do you have … in size …?</li>
  <li><strong>Kann ich mit Karte zahlen?</strong> – Can I pay by card?</li>
</ul>
<h3>Numbers and Prices</h3>
<p>50 – fünfzig | 100 – hundert | 1.000 – tausend<br>
Das kostet 12,50 Euro. – That costs 12.50 Euro.</p>',
   2, NULL, NOW()),

  ('00000000-0000-0000-0002-000000000003',
   '00000000-0000-0000-0000-000000000002',
   'Transport and Travel',
   'transport-travel',
   '<h2>Transport in Germany</h2>
<p>Germany has an excellent public transport network. Learn key vocabulary and phrases.</p>
<h3>Transport Types</h3>
<ul>
  <li><strong>der Zug</strong> – train</li>
  <li><strong>die U-Bahn</strong> – underground / metro</li>
  <li><strong>die Straßenbahn</strong> – tram</li>
  <li><strong>der Bus</strong> – bus</li>
  <li><strong>das Taxi</strong> – taxi</li>
</ul>
<h3>At the Train Station</h3>
<p><strong>Einen Fahrschein nach Berlin, bitte.</strong> – One ticket to Berlin, please.<br>
<strong>Wann fährt der nächste Zug?</strong> – When does the next train leave?<br>
<strong>Auf welchem Gleis?</strong> – Which platform?</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – B1 Integration German
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0003-000000000001',
   '00000000-0000-0000-0000-000000000003',
   'Past Tense Mastery',
   'past-tense-mastery',
   '<h2>Perfekt and Präteritum</h2>
<p>German has two main past tenses: Perfekt (spoken) and Präteritum (written).</p>
<h3>Perfekt Formation</h3>
<p>haben/sein + past participle (Partizip II)</p>
<ul>
  <li>Ich habe gegessen. – I ate / I have eaten.</li>
  <li>Er ist gefahren. – He drove / He has driven.</li>
  <li>Wir haben gespielt. – We played.</li>
</ul>
<h3>When to Use Sein</h3>
<p>Use <em>sein</em> with verbs of movement or change of state:<br>
gehen, fahren, fliegen, kommen, werden, bleiben, sein</p>
<h3>Präteritum (common verbs)</h3>
<ul>
  <li>sein → war | haben → hatte | werden → wurde</li>
  <li>können → konnte | müssen → musste</li>
</ul>',
   1, NULL, NOW()),

  ('00000000-0000-0000-0003-000000000002',
   '00000000-0000-0000-0000-000000000003',
   'Modal Verbs in Context',
   'modal-verbs-context',
   '<h2>German Modal Verbs</h2>
<p>Modal verbs modify the meaning of the main verb. They always send the main verb to the end of the clause.</p>
<h3>The Six Modals</h3>
<ul>
  <li><strong>dürfen</strong> – to be allowed to</li>
  <li><strong>können</strong> – to be able to / can</li>
  <li><strong>mögen</strong> – to like</li>
  <li><strong>müssen</strong> – to have to / must</li>
  <li><strong>sollen</strong> – to be supposed to</li>
  <li><strong>wollen</strong> – to want to</li>
</ul>
<h3>Sentence Structure</h3>
<p>Modal verb in position 2, infinitive at the end:<br>
<em>Ich <strong>kann</strong> heute nicht <strong>kommen</strong>.</em> – I cannot come today.<br>
<em>Du <strong>musst</strong> mehr <strong>üben</strong>.</em> – You must practise more.</p>',
   2, NULL, NOW()),

  ('00000000-0000-0000-0003-000000000003',
   '00000000-0000-0000-0000-000000000003',
   'Work and Job Applications',
   'work-job-applications',
   '<h2>German Work Vocabulary</h2>
<p>Essential vocabulary and phrases for the German workplace and job applications.</p>
<h3>Job Application Documents</h3>
<ul>
  <li><strong>der Lebenslauf</strong> – CV / résumé</li>
  <li><strong>das Anschreiben</strong> – cover letter</li>
  <li><strong>das Vorstellungsgespräch</strong> – job interview</li>
  <li><strong>die Bewerbung</strong> – application</li>
</ul>
<h3>Useful Phrases</h3>
<p><strong>Ich bewerbe mich um die Stelle als …</strong> – I am applying for the position of …<br>
<strong>Ich habe Erfahrung in …</strong> – I have experience in …<br>
<strong>Wann könnte ich anfangen?</strong> – When could I start?</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- LESSONS – B2 Work and Study German
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.lessons (id, course_id, title, slug, content, order_index, video_url, created_at)
VALUES
  ('00000000-0000-0000-0004-000000000001',
   '00000000-0000-0000-0000-000000000004',
   'Konjunktiv II – Subjunctive Mood',
   'konjunktiv-ii',
   '<h2>Konjunktiv II in German</h2>
<p>Konjunktiv II expresses wishes, hypotheticals, polite requests and indirect speech.</p>
<h3>Formation</h3>
<p>For most verbs: würden + infinitive<br>
<em>Ich würde gerne kommen.</em> – I would like to come.</p>
<p>Irregular verbs use their own Konjunktiv II forms:</p>
<ul>
  <li>sein → wäre | haben → hätte</li>
  <li>können → könnte | müssen → müsste</li>
  <li>werden → würde | dürfen → dürfte</li>
</ul>
<h3>Common Uses</h3>
<p><strong>Polite requests:</strong> Könnten Sie mir bitte helfen? – Could you please help me?<br>
<strong>Hypotheticals:</strong> Wenn ich Zeit hätte, würde ich mehr reisen. – If I had time, I would travel more.<br>
<strong>Wishes:</strong> Ich wünschte, ich wäre in Berlin. – I wish I were in Berlin.</p>',
   1, NULL, NOW()),

  ('00000000-0000-0000-0004-000000000002',
   '00000000-0000-0000-0000-000000000004',
   'Academic and Business Writing',
   'academic-business-writing',
   '<h2>Formal German Writing</h2>
<p>Learn the conventions of formal German writing for academic and business contexts.</p>
<h3>Formal Letter Structure</h3>
<ul>
  <li>Absender (sender) – top right</li>
  <li>Empfänger (recipient) – left below</li>
  <li>Datum – date</li>
  <li>Betreff – subject line</li>
  <li>Anrede – salutation: Sehr geehrte Damen und Herren,</li>
  <li>Schlussformel – closing: Mit freundlichen Grüßen</li>
</ul>
<h3>Connective Words (Konnektoren)</h3>
<ul>
  <li><strong>jedoch / allerdings</strong> – however</li>
  <li><strong>daher / deshalb</strong> – therefore</li>
  <li><strong>obwohl</strong> – although</li>
  <li><strong>sofern</strong> – provided that</li>
</ul>',
   2, NULL, NOW()),

  ('00000000-0000-0000-0004-000000000003',
   '00000000-0000-0000-0000-000000000004',
   'Complex Sentence Structures',
   'complex-sentences',
   '<h2>Advanced Sentence Building</h2>
<p>Combine clauses confidently using subordinating conjunctions, relative clauses and extended noun phrases.</p>
<h3>Subordinating Conjunctions</h3>
<p>Send the verb to the end of the clause:</p>
<ul>
  <li><strong>weil</strong> – because: Ich bleibe zu Hause, weil ich krank <em>bin</em>.</li>
  <li><strong>dass</strong> – that: Er sagt, dass er kommt.</li>
  <li><strong>als</strong> – when (past): Als ich jung war, …</li>
  <li><strong>obwohl</strong> – although: Obwohl es regnet, gehe ich spazieren.</li>
</ul>
<h3>Relative Clauses</h3>
<p>Das Buch, <em>das ich lese</em>, ist sehr interessant. – The book that I am reading is very interesting.</p>',
   3, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – A1 Lesson 1 (Greetings)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0001-0001-000000000001',
   '00000000-0000-0000-0001-000000000001',
   'Was bedeutet "Guten Morgen"?',
   'multiple_choice',
   '["Good morning", "Good evening", "Good night", "Goodbye"]'::jsonb,
   'Good morning',
   '"Guten Morgen" means "Good morning" and is used until approximately 10:00.',
   NOW()),

  ('00000000-0000-0001-0001-000000000002',
   '00000000-0000-0000-0001-000000000001',
   'Wie sagt man "My name is" auf Deutsch?',
   'multiple_choice',
   '["Ich heiße", "Du heißt", "Er heißt", "Wir heißen"]'::jsonb,
   'Ich heiße',
   '"Ich heiße …" is the standard way to say "My name is …" in German.',
   NOW()),

  ('00000000-0000-0001-0001-000000000003',
   '00000000-0000-0000-0001-000000000001',
   'Which greeting is INFORMAL in German?',
   'multiple_choice',
   '["Hallo", "Guten Tag", "Guten Abend", "Auf Wiedersehen"]'::jsonb,
   'Hallo',
   '"Hallo" is the informal/casual greeting equivalent to "Hi" in English.',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – A1 Lesson 2 (Numbers and Colours)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0001-0002-000000000001',
   '00000000-0000-0000-0001-000000000002',
   'Wie heißt die Zahl 7 auf Deutsch?',
   'multiple_choice',
   '["sechs", "sieben", "acht", "neun"]'::jsonb,
   'sieben',
   '7 = sieben. Remember: sechs=6, sieben=7, acht=8, neun=9.',
   NOW()),

  ('00000000-0000-0001-0002-000000000002',
   '00000000-0000-0000-0001-000000000002',
   'What colour is "grün"?',
   'multiple_choice',
   '["red", "blue", "green", "yellow"]'::jsonb,
   'green',
   '"Grün" means green in German. rot=red, blau=blue, gelb=yellow.',
   NOW()),

  ('00000000-0000-0001-0002-000000000003',
   '00000000-0000-0000-0001-000000000002',
   'Wie sagt man "twenty" auf Deutsch?',
   'multiple_choice',
   '["zehn", "zwölf", "zwanzig", "dreißig"]'::jsonb,
   'zwanzig',
   '20 = zwanzig. zehn=10, zwölf=12, dreißig=30.',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – A2 Lesson 1 (Daily Routines)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0002-0001-000000000001',
   '00000000-0000-0000-0002-000000000001',
   'Was bedeutet "aufstehen"?',
   'multiple_choice',
   '["to go to sleep", "to get up", "to eat breakfast", "to work"]'::jsonb,
   'to get up',
   '"Aufstehen" is a separable verb meaning "to get up / to stand up".',
   NOW()),

  ('00000000-0000-0002-0001-000000000002',
   '00000000-0000-0000-0002-000000000001',
   'Ergänze: Ich ___ um 7 Uhr auf.',
   'multiple_choice',
   '["stehe", "stehst", "steht", "stehen"]'::jsonb,
   'stehe',
   '"Ich stehe auf" – 1st person singular of the separable verb "aufstehen".',
   NOW()),

  ('00000000-0000-0002-0001-000000000003',
   '00000000-0000-0000-0002-000000000001',
   'What time is "halb acht"?',
   'multiple_choice',
   '["8:30", "7:30", "8:15", "7:15"]'::jsonb,
   '7:30',
   '"Halb acht" = half to eight = 7:30. German "halb" means "half before" the hour.',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B1 Lesson 1 (Past Tense)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0003-0001-000000000001',
   '00000000-0000-0000-0003-000000000001',
   'Welche Hilfsverb braucht "fahren" im Perfekt?',
   'multiple_choice',
   '["haben", "sein", "werden", "können"]'::jsonb,
   'sein',
   '"Fahren" uses "sein" in Perfekt because it expresses movement: "Ich bin gefahren."',
   NOW()),

  ('00000000-0000-0003-0001-000000000002',
   '00000000-0000-0000-0003-000000000001',
   'Ergänze: Wir ___ gestern Fußball gespielt.',
   'multiple_choice',
   '["haben", "sind", "waren", "hatten"]'::jsonb,
   'haben',
   '"Spielen" uses "haben" in Perfekt: "Wir haben gespielt."',
   NOW()),

  ('00000000-0000-0003-0001-000000000003',
   '00000000-0000-0000-0003-000000000001',
   'What is the Präteritum of "sein"?',
   'multiple_choice',
   '["hatte", "wurde", "war", "blieb"]'::jsonb,
   'war',
   'The Präteritum of "sein" (to be) is "war". Ich war, du warst, er/sie/es war.',
   NOW())
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- EXERCISES – B2 Lesson 1 (Konjunktiv II)
-- ──────────────────────────────────────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('00000000-0000-0004-0001-000000000001',
   '00000000-0000-0000-0004-000000000001',
   'Ergänze: Wenn ich Zeit ___, würde ich reisen.',
   'multiple_choice',
   '["hätte", "habe", "hatte", "haben"]'::jsonb,
   'hätte',
   'Konjunktiv II of "haben" is "hätte". Used in hypothetical "wenn" clauses.',
   NOW()),

  ('00000000-0000-0004-0001-000000000002',
   '00000000-0000-0000-0004-000000000001',
   'Which sentence uses Konjunktiv II for a polite request?',
   'multiple_choice',
   '["Können Sie helfen?", "Könnten Sie mir helfen?", "Sie helfen mir.", "Sie haben geholfen."]'::jsonb,
   'Könnten Sie mir helfen?',
   '"Könnten" is Konjunktiv II of "können", making the request more polite.',
   NOW()),

  ('00000000-0000-0004-0001-000000000003',
   '00000000-0000-0000-0004-000000000001',
   'Was ist der Konjunktiv II von "sein"?',
   'multiple_choice',
   '["sei", "wäre", "war", "würde sein"]'::jsonb,
   'wäre',
   '"Wäre" is the Konjunktiv II of "sein". E.g. "Ich wäre gern dort."',
   NOW())
ON CONFLICT (id) DO NOTHING;
