-- A1 Room 04 – Shopping & Daily Needs (fixed: HTML content, escaped
-- apostrophes, corrected unterminated string on lesson 4)
-- Course ID: a0000000-0000-0000-0000-000000000004

INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'a1-shopping',
  'A1 Room 04 – Shopping & Daily Needs',
  'Learn to shop for food and clothes, understand prices, use modal verbs, and ask for help in stores.',
  'A1', 'de', true, NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lesson 1: Im Supermarkt – Lebensmittel
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0004-000000000001',
  'a0000000-0000-0000-0000-000000000004',
  'im-supermarkt-lebensmittel',
  'Im Supermarkt – Lebensmittel',
  '<h2>Im Supermarkt – Lebensmittel</h2>
<h3>Food Vocabulary with Articles</h3>
<table>
<thead><tr><th>German</th><th>English</th></tr></thead>
<tbody>
<tr><td>das Brot</td><td>bread</td></tr>
<tr><td>die Milch</td><td>milk</td></tr>
<tr><td>das Fleisch</td><td>meat</td></tr>
<tr><td>das Gemüse</td><td>vegetables</td></tr>
<tr><td>das Obst</td><td>fruit</td></tr>
<tr><td>der Käse</td><td>cheese</td></tr>
<tr><td>die Eier (pl.)</td><td>eggs</td></tr>
<tr><td>der Saft</td><td>juice</td></tr>
<tr><td>das Wasser</td><td>water</td></tr>
<tr><td>der Joghurt</td><td>yogurt</td></tr>
</tbody>
</table>
<h3>Shopping Phrases</h3>
<ul>
<li>Ich kaufe <strong>Brot</strong> und <strong>Milch</strong>. (I buy bread and milk.)</li>
<li>Ich brauche <strong>Obst</strong> und <strong>Gemüse</strong>. (I need fruit and vegetables.)</li>
<li>Haben Sie <strong>Käse</strong>? (Do you have cheese?)</li>
<li>Wo ist der <strong>Joghurt</strong>? (Where is the yogurt?)</li>
</ul>',
  1, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0004-0001-000000000001', 'a0000000-0000-0000-0004-000000000001', 'multiple_choice',
   'What is the article for "bread" (das Brot)?',
   '["das","die","der","den"]'::jsonb, 'das', NOW()),
  ('a0000000-0000-0004-0001-000000000002', 'a0000000-0000-0000-0004-000000000001', 'multiple_choice',
   'How do you say "milk" in German?',
   '["die Milch","das Brot","der Saft","das Wasser"]'::jsonb, 'die Milch', NOW()),
  ('a0000000-0000-0004-0001-000000000003', 'a0000000-0000-0000-0004-000000000001', 'fill_blank',
   'Complete: Ich kaufe Brot und ___. (milk)',
   null, 'Milch', NOW()),
  ('a0000000-0000-0004-0001-000000000004', 'a0000000-0000-0000-0004-000000000001', 'word_order',
   'Arrange: "I need fruit and vegetables."',
   '["Ich","brauche","Obst","und","Gemüse","."]'::jsonb, 'Ich brauche Obst und Gemüse .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 2: Preise und Zahlen
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0004-000000000002',
  'a0000000-0000-0000-0000-000000000004',
  'preise-und-zahlen',
  'Preise und Zahlen',
  '<h2>Preise und Zahlen</h2>
<h3>Asking About Prices</h3>
<ul>
<li>Wie viel kostet das? (How much does that cost?)</li>
<li>Was kostet ...? (What does ... cost?)</li>
<li>Das kostet <strong>zwei Euro</strong>. (That costs two euros.)</li>
<li>Das kostet <strong>1,50 Euro</strong>. (That costs 1.50 euros.)</li>
</ul>
<h3>Numbers Review (1–100)</h3>
<table>
<thead><tr><th>Number</th><th>German</th></tr></thead>
<tbody>
<tr><td>10</td><td>zehn</td></tr>
<tr><td>20</td><td>zwanzig</td></tr>
<tr><td>30</td><td>dreißig</td></tr>
<tr><td>40</td><td>vierzig</td></tr>
<tr><td>50</td><td>fünfzig</td></tr>
<tr><td>100</td><td>hundert</td></tr>
</tbody>
</table>
<ul>
<li>einundzwanzig (21), zweiundzwanzig (22) ...</li>
<li>dreiunddreißig (33), vierundvierzig (44) ...</li>
</ul>
<h3>At the Checkout</h3>
<ul>
<li>Das macht <strong>fünf Euro</strong> bitte. (That''s five euros please.)</li>
<li>Hier sind <strong>zehn Euro</strong>. (Here are ten euros.)</li>
<li>Das Wechselgeld ist <strong>fünf Euro</strong>. (The change is five euros.)</li>
</ul>',
  2, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0004-0002-000000000001', 'a0000000-0000-0000-0004-000000000002', 'multiple_choice',
   'How do you ask "How much does that cost?" in German?',
   '["Wie viel kostet das?","Was ist das?","Wo ist das?","Wie heißt das?"]'::jsonb, 'Wie viel kostet das?', NOW()),
  ('a0000000-0000-0004-0002-000000000002', 'a0000000-0000-0000-0004-000000000002', 'multiple_choice',
   'What is "50" in German?',
   '["fünfzig","vierzig","dreißig","sechzig"]'::jsonb, 'fünfzig', NOW()),
  ('a0000000-0000-0004-0002-000000000003', 'a0000000-0000-0000-0004-000000000002', 'fill_blank',
   'Complete: Das kostet zwei ___. (euros)',
   null, 'Euro', NOW()),
  ('a0000000-0000-0004-0002-000000000004', 'a0000000-0000-0000-0004-000000000002', 'word_order',
   'Arrange: "That costs five euros."',
   '["Das","kostet","fünf","Euro","."]'::jsonb, 'Das kostet fünf Euro .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Kleidung kaufen
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0004-000000000003',
  'a0000000-0000-0000-0000-000000000004',
  'kleidung-kaufen',
  'Kleidung kaufen',
  '<h2>Kleidung kaufen</h2>
<h3>Clothing Vocabulary</h3>
<table>
<thead><tr><th>German</th><th>English</th></tr></thead>
<tbody>
<tr><td>das Hemd</td><td>shirt</td></tr>
<tr><td>die Hose</td><td>trousers / pants</td></tr>
<tr><td>das Kleid</td><td>dress</td></tr>
<tr><td>die Jacke</td><td>jacket</td></tr>
<tr><td>die Schuhe (pl.)</td><td>shoes</td></tr>
<tr><td>die Mütze</td><td>hat / beanie</td></tr>
<tr><td>der Pullover</td><td>sweater</td></tr>
<tr><td>die Socken (pl.)</td><td>socks</td></tr>
</tbody>
</table>
<h3>Sizes and Colors</h3>
<ul>
<li>Welche Größe haben Sie? — Ich habe Größe M. (What size are you? — I''m size M.)</li>
<li>Welche Farbe möchten Sie? (What colour would you like?)</li>
<li>Ich möchte das Hemd <strong>in Blau</strong>. (I would like the shirt in blue.)</li>
<li>Haben Sie die Jacke <strong>in Größe L</strong>? (Do you have the jacket in size L?)</li>
</ul>
<h3>In the Shop</h3>
<ul>
<li>Kann ich das anprobieren? (Can I try this on?)</li>
<li>Das passt gut. (That fits well.)</li>
<li>Das ist zu groß / zu klein. (That is too big / too small.)</li>
</ul>',
  3, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0004-0003-000000000001', 'a0000000-0000-0000-0004-000000000003', 'multiple_choice',
   'How do you say "jacket" in German?',
   '["die Jacke","das Hemd","die Hose","der Pullover"]'::jsonb, 'die Jacke', NOW()),
  ('a0000000-0000-0004-0003-000000000002', 'a0000000-0000-0000-0004-000000000003', 'multiple_choice',
   'How do you ask "Can I try this on?"',
   '["Kann ich das anprobieren?","Wie viel kostet das?","Haben Sie das?","Welche Größe?"]'::jsonb, 'Kann ich das anprobieren?', NOW()),
  ('a0000000-0000-0004-0003-000000000003', 'a0000000-0000-0000-0004-000000000003', 'fill_blank',
   'Complete: Das ist zu ___. (too small)',
   null, 'klein', NOW()),
  ('a0000000-0000-0004-0003-000000000004', 'a0000000-0000-0000-0004-000000000003', 'word_order',
   'Arrange: "I would like the shirt in blue."',
   '["Ich","möchte","das","Hemd","in","Blau","."]'::jsonb, 'Ich möchte das Hemd in Blau .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 4: Modal Verbs – können & möchten
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0004-000000000004',
  'a0000000-0000-0000-0000-000000000004',
  'modal-verben-koennen-moechten',
  'Modal Verbs – können & möchten',
  '<h2>Modal Verbs – können &amp; möchten</h2>
<h3>können (can / to be able to)</h3>
<table>
<thead><tr><th>Person</th><th>Form</th></tr></thead>
<tbody>
<tr><td>ich</td><td>kann</td></tr>
<tr><td>du</td><td>kannst</td></tr>
<tr><td>er/sie/es</td><td>kann</td></tr>
<tr><td>wir</td><td>können</td></tr>
<tr><td>ihr</td><td>könnt</td></tr>
<tr><td>sie/Sie</td><td>können</td></tr>
</tbody>
</table>
<h3>möchten (would like to)</h3>
<table>
<thead><tr><th>Person</th><th>Form</th></tr></thead>
<tbody>
<tr><td>ich</td><td>möchte</td></tr>
<tr><td>du</td><td>möchtest</td></tr>
<tr><td>er/sie/es</td><td>möchte</td></tr>
<tr><td>wir</td><td>möchten</td></tr>
</tbody>
</table>
<h3>Usage</h3>
<p>Modal verbs come in second position; the main verb goes to the end:</p>
<ul>
<li>Ich <strong>kann</strong> Deutsch <strong>sprechen</strong>. (I can speak German.)</li>
<li><strong>Kannst</strong> du mir <strong>helfen</strong>? (Can you help me?)</li>
<li>Ich <strong>möchte</strong> ein Brot <strong>kaufen</strong>. (I would like to buy a bread.)</li>
<li><strong>Möchtest</strong> du einen Kaffee <strong>trinken</strong>? (Would you like to drink a coffee?)</li>
</ul>',
  4, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0004-0004-000000000001', 'a0000000-0000-0000-0004-000000000004', 'multiple_choice',
   'Complete: Ich ___ Deutsch sprechen. (I can speak German)',
   '["kann","kannst","können","könnt"]'::jsonb, 'kann', NOW()),
  ('a0000000-0000-0004-0004-000000000002', 'a0000000-0000-0000-0004-000000000004', 'multiple_choice',
   'Complete: Ich ___ ein Brot kaufen. (I would like)',
   '["möchte","möchtest","möchten","kann"]'::jsonb, 'möchte', NOW()),
  ('a0000000-0000-0004-0004-000000000003', 'a0000000-0000-0000-0004-000000000004', 'fill_blank',
   'Complete: ___ du mir helfen? (Can you help me?)',
   null, 'Kannst', NOW()),
  ('a0000000-0000-0004-0004-000000000004', 'a0000000-0000-0000-0004-000000000004', 'word_order',
   'Arrange: "I would like to buy a jacket."',
   '["Ich","möchte","eine","Jacke","kaufen","."]'::jsonb, 'Ich möchte eine Jacke kaufen .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 5: Im Geschäft – Einkaufsgespräch
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0004-000000000005',
  'a0000000-0000-0000-0000-000000000004',
  'im-geschaeft-einkaufsgespraech',
  'Im Geschäft – Einkaufsgespräch',
  '<h2>Im Geschäft – Einkaufsgespräch</h2>
<h3>A Shopping Dialogue</h3>
<p><strong>Verkäufer:</strong> Guten Tag! Kann ich Ihnen helfen? (Good day! Can I help you?)<br>
<strong>Kunde:</strong> Ja, ich suche eine Jacke in Größe M. (Yes, I am looking for a jacket in size M.)<br>
<strong>Verkäufer:</strong> Welche Farbe möchten Sie? (What colour would you like?)<br>
<strong>Kunde:</strong> Blau, bitte. (Blue, please.)<br>
<strong>Verkäufer:</strong> Hier ist eine blaue Jacke. Möchten Sie sie anprobieren? (Here is a blue jacket. Would you like to try it on?)<br>
<strong>Kunde:</strong> Ja, gerne. — Das passt gut. Wie viel kostet sie? (Yes, please. — It fits well. How much does it cost?)<br>
<strong>Verkäufer:</strong> Sie kostet 35 Euro. (It costs 35 euros.)<br>
<strong>Kunde:</strong> Gut, ich nehme sie. (Good, I''ll take it.)</p>
<h3>Key Phrases</h3>
<ul>
<li>Ich suche ... (I am looking for ...)</li>
<li>Haben Sie ...? (Do you have ...?)</li>
<li>Ich nehme es/sie/ihn. (I''ll take it.)</li>
<li>Das ist zu teuer. (That is too expensive.)</li>
<li>Das ist ein gutes Angebot. (That is a good offer.)</li>
</ul>',
  5, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0004-0005-000000000001', 'a0000000-0000-0000-0004-000000000005', 'multiple_choice',
   'How do you say "I am looking for a jacket"?',
   '["Ich suche eine Jacke.","Ich kaufe eine Jacke.","Ich habe eine Jacke.","Ich möchte eine Jacke."]'::jsonb, 'Ich suche eine Jacke.', NOW()),
  ('a0000000-0000-0004-0005-000000000002', 'a0000000-0000-0000-0004-000000000005', 'multiple_choice',
   'What does "Das ist zu teuer" mean?',
   '["That is too expensive.","That fits well.","That is a good offer.","I''ll take it."]'::jsonb, 'That is too expensive.', NOW()),
  ('a0000000-0000-0004-0005-000000000003', 'a0000000-0000-0000-0004-000000000005', 'fill_blank',
   'Complete: Ich ___ es. (I''ll take it)',
   null, 'nehme', NOW()),
  ('a0000000-0000-0004-0005-000000000004', 'a0000000-0000-0000-0004-000000000005', 'word_order',
   'Arrange: "I am looking for shoes in size 42."',
   '["Ich","suche","Schuhe","in","Größe","42","."]'::jsonb, 'Ich suche Schuhe in Größe 42 .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Quiz (order_index 99)
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0004-000000000099',
  'a0000000-0000-0000-0000-000000000004',
  'room-04-quiz-shopping-daily-needs',
  'Room 04 Quiz – Shopping & Daily Needs',
  '<h2>Checkpoint Quiz</h2><p>Test your knowledge of food vocabulary, prices, clothing, modal verbs, and shopping conversations.</p>',
  99, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0004-0099-000000000001', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'What is "das Gemüse" in English?',
   '["vegetables","fruit","meat","bread"]'::jsonb, 'vegetables', NOW()),
  ('a0000000-0000-0004-0099-000000000002', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'How do you ask "How much does that cost?"',
   '["Wie viel kostet das?","Was ist das?","Wo kaufst du?","Hast du Geld?"]'::jsonb, 'Wie viel kostet das?', NOW()),
  ('a0000000-0000-0004-0099-000000000003', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'Complete: Ich ___ Deutsch sprechen.',
   '["kann","möchte","will","soll"]'::jsonb, 'kann', NOW()),
  ('a0000000-0000-0004-0099-000000000004', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'What does "die Jacke" mean?',
   '["jacket","shirt","dress","trousers"]'::jsonb, 'jacket', NOW()),
  ('a0000000-0000-0004-0099-000000000005', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'Complete: Ich möchte ___ Brot kaufen.',
   '["ein","eine","einen","einem"]'::jsonb, 'ein', NOW()),
  ('a0000000-0000-0004-0099-000000000006', 'a0000000-0000-0000-0004-000000000099', 'fill_blank',
   'Translate "cheese" into German.',
   null, 'der Käse', NOW()),
  ('a0000000-0000-0004-0099-000000000007', 'a0000000-0000-0000-0004-000000000099', 'fill_blank',
   'Complete: Das ist zu ___. (too expensive)',
   null, 'teuer', NOW()),
  ('a0000000-0000-0004-0099-000000000008', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'How do you say "Can I try this on?"',
   '["Kann ich das anprobieren?","Wie groß ist das?","Was kostet das?","Ich nehme es."]'::jsonb, 'Kann ich das anprobieren?', NOW()),
  ('a0000000-0000-0004-0099-000000000009', 'a0000000-0000-0000-0004-000000000099', 'word_order',
   'Arrange: "I would like to buy a sweater."',
   '["Ich","möchte","einen","Pullover","kaufen","."]'::jsonb, 'Ich möchte einen Pullover kaufen .', NOW()),
  ('a0000000-0000-0004-0099-000000000010', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'What is 30 in German?',
   '["dreißig","zwanzig","vierzig","fünfzig"]'::jsonb, 'dreißig', NOW())
ON CONFLICT (id) DO NOTHING;
