-- A1 Room 05 – Food & Restaurants (fixed: HTML content, escaped apostrophes)
-- Course ID: a0000000-0000-0000-0000-000000000005

INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000005',
  'a1-food-restaurants',
  'A1 Room 05 – Food & Restaurants',
  'Learn to talk about meals, order food in a restaurant, discuss drinks and preferences, and read simple recipes.',
  'A1', 'de', true, NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lesson 1: Mahlzeiten und Essen
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0005-000000000001',
  'a0000000-0000-0000-0000-000000000005',
  'mahlzeiten-und-essen',
  'Mahlzeiten und Essen',
  '<h2>Mahlzeiten und Essen</h2>
<h3>Meals of the Day</h3>
<table>
<thead><tr><th>German</th><th>English</th></tr></thead>
<tbody>
<tr><td>das Frühstück</td><td>breakfast</td></tr>
<tr><td>das Mittagessen</td><td>lunch</td></tr>
<tr><td>das Abendessen</td><td>dinner</td></tr>
<tr><td>der Snack</td><td>snack</td></tr>
</tbody>
</table>
<h3>Common Foods</h3>
<ul>
<li>das Brötchen (bread roll), die Marmelade (jam), der Honig (honey)</li>
<li>die Suppe (soup), der Salat (salad), die Nudeln (pasta)</li>
<li>der Reis (rice), das Fleisch (meat), der Fisch (fish)</li>
</ul>
<h3>Talking About Meals</h3>
<ul>
<li>Zum Frühstück esse ich <strong>ein Brötchen</strong>. (For breakfast I eat a bread roll.)</li>
<li>Zum Mittagessen esse ich <strong>Suppe</strong>. (For lunch I eat soup.)</li>
<li>Was isst du zum Abendessen? (What do you eat for dinner?)</li>
</ul>',
  1, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0005-0001-000000000001', 'a0000000-0000-0000-0005-000000000001', 'multiple_choice',
   'How do you say "breakfast" in German?',
   '["das Frühstück","das Mittagessen","das Abendessen","der Snack"]'::jsonb, 'das Frühstück', NOW()),
  ('a0000000-0000-0005-0001-000000000002', 'a0000000-0000-0000-0005-000000000001', 'multiple_choice',
   'What is "die Suppe" in English?',
   '["soup","salad","rice","fish"]'::jsonb, 'soup', NOW()),
  ('a0000000-0000-0005-0001-000000000003', 'a0000000-0000-0000-0005-000000000001', 'fill_blank',
   'Complete: Zum Frühstück esse ich ein ___. (bread roll)',
   null, 'Brötchen', NOW()),
  ('a0000000-0000-0005-0001-000000000004', 'a0000000-0000-0000-0005-000000000001', 'word_order',
   'Arrange: "What do you eat for dinner?"',
   '["Was","isst","du","zum","Abendessen","?"]'::jsonb, 'Was isst du zum Abendessen ?', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 2: Im Restaurant bestellen
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0005-000000000002',
  'a0000000-0000-0000-0000-000000000005',
  'im-restaurant-bestellen',
  'Im Restaurant bestellen',
  '<h2>Im Restaurant bestellen</h2>
<h3>Ordering Phrases</h3>
<ul>
<li>Ich möchte bestellen. (I would like to order.)</li>
<li>Ich hätte gerne <strong>die Suppe</strong>. (I would like the soup.)</li>
<li>Für mich bitte <strong>den Salat</strong>. (For me, the salad please.)</li>
<li>Können wir die Speisekarte haben? (Can we have the menu?)</li>
<li>Die Rechnung, bitte. (The bill, please.)</li>
</ul>
<h3>Useful Words</h3>
<table>
<thead><tr><th>German</th><th>English</th></tr></thead>
<tbody>
<tr><td>die Speisekarte</td><td>menu</td></tr>
<tr><td>der Kellner / die Kellnerin</td><td>waiter / waitress</td></tr>
<tr><td>die Rechnung</td><td>the bill</td></tr>
<tr><td>das Trinkgeld</td><td>tip</td></tr>
<tr><td>die Vorspeise</td><td>starter</td></tr>
<tr><td>die Hauptspeise</td><td>main course</td></tr>
<tr><td>die Nachspeise</td><td>dessert</td></tr>
</tbody>
</table>
<h3>A Short Dialogue</h3>
<p><strong>Kellner:</strong> Guten Abend! Was möchten Sie bestellen? (Good evening! What would you like to order?)<br>
<strong>Gast:</strong> Ich hätte gerne die Hauptspeise mit Reis. (I would like the main course with rice.)<br>
<strong>Kellner:</strong> Und zu trinken? (And to drink?)<br>
<strong>Gast:</strong> Ein Wasser, bitte. (A water, please.)</p>',
  2, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0005-0002-000000000001', 'a0000000-0000-0000-0005-000000000002', 'multiple_choice',
   'How do you say "I would like to order"?',
   '["Ich möchte bestellen.","Ich möchte bezahlen.","Ich möchte essen.","Ich möchte trinken."]'::jsonb, 'Ich möchte bestellen.', NOW()),
  ('a0000000-0000-0005-0002-000000000002', 'a0000000-0000-0000-0005-000000000002', 'multiple_choice',
   'What is "die Rechnung"?',
   '["the bill","the menu","the tip","the waiter"]'::jsonb, 'the bill', NOW()),
  ('a0000000-0000-0005-0002-000000000003', 'a0000000-0000-0000-0005-000000000002', 'fill_blank',
   'Complete: Die ___, bitte. (the bill)',
   null, 'Rechnung', NOW()),
  ('a0000000-0000-0005-0002-000000000004', 'a0000000-0000-0000-0005-000000000002', 'word_order',
   'Arrange: "Can we have the menu?"',
   '["Können","wir","die","Speisekarte","haben","?"]'::jsonb, 'Können wir die Speisekarte haben ?', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Getränke und Trinken
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0005-000000000003',
  'a0000000-0000-0000-0000-000000000005',
  'getraenke-und-trinken',
  'Getränke und Trinken',
  '<h2>Getränke und Trinken</h2>
<h3>Drinks Vocabulary</h3>
<table>
<thead><tr><th>German</th><th>English</th></tr></thead>
<tbody>
<tr><td>das Wasser</td><td>water</td></tr>
<tr><td>der Kaffee</td><td>coffee</td></tr>
<tr><td>der Tee</td><td>tea</td></tr>
<tr><td>der Saft</td><td>juice</td></tr>
<tr><td>die Limonade</td><td>lemonade / soda</td></tr>
<tr><td>das Bier</td><td>beer</td></tr>
<tr><td>der Wein</td><td>wine</td></tr>
</tbody>
</table>
<h3>Ordering a Drink</h3>
<ul>
<li>Ich möchte <strong>einen Kaffee</strong>, bitte. (I would like a coffee, please.)</li>
<li>Ein Glas Wasser, bitte. (A glass of water, please.)</li>
<li>Mit oder ohne Kohlensäure? (With or without carbonation?)</li>
<li>Möchten Sie noch etwas trinken? (Would you like something else to drink?)</li>
</ul>
<h3>Quantities</h3>
<ul>
<li>eine Tasse Kaffee (a cup of coffee)</li>
<li>ein Glas Saft (a glass of juice)</li>
<li>eine Flasche Wasser (a bottle of water)</li>
</ul>',
  3, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0005-0003-000000000001', 'a0000000-0000-0000-0005-000000000003', 'multiple_choice',
   'How do you say "tea" in German?',
   '["der Tee","der Kaffee","das Wasser","der Wein"]'::jsonb, 'der Tee', NOW()),
  ('a0000000-0000-0005-0003-000000000002', 'a0000000-0000-0000-0005-000000000003', 'multiple_choice',
   'What does "eine Flasche Wasser" mean?',
   '["a bottle of water","a cup of water","a glass of water","water with ice"]'::jsonb, 'a bottle of water', NOW()),
  ('a0000000-0000-0005-0003-000000000003', 'a0000000-0000-0000-0005-000000000003', 'fill_blank',
   'Complete: Ich möchte einen ___, bitte. (coffee)',
   null, 'Kaffee', NOW()),
  ('a0000000-0000-0005-0003-000000000004', 'a0000000-0000-0000-0005-000000000003', 'word_order',
   'Arrange: "A glass of water, please."',
   '["Ein","Glas","Wasser",",","bitte","."]'::jsonb, 'Ein Glas Wasser , bitte .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 4: Essen mögen – Vorlieben
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0005-000000000004',
  'a0000000-0000-0000-0000-000000000005',
  'essen-moegen-vorlieben',
  'Essen mögen – Vorlieben',
  '<h2>Essen mögen – Vorlieben</h2>
<h3>The Verb "mögen" (to like)</h3>
<table>
<thead><tr><th>Person</th><th>Form</th></tr></thead>
<tbody>
<tr><td>ich</td><td>mag</td></tr>
<tr><td>du</td><td>magst</td></tr>
<tr><td>er/sie/es</td><td>mag</td></tr>
<tr><td>wir</td><td>mögen</td></tr>
<tr><td>ihr</td><td>mögt</td></tr>
<tr><td>sie/Sie</td><td>mögen</td></tr>
</tbody>
</table>
<h3>Expressing Preferences</h3>
<ul>
<li>Ich mag <strong>Pizza</strong>. (I like pizza.)</li>
<li>Ich mag <strong>keinen Fisch</strong>. (I don''t like fish.)</li>
<li>Magst du <strong>Schokolade</strong>? (Do you like chocolate?)</li>
<li>Ich mag <strong>Nudeln lieber als Reis</strong>. (I like pasta better than rice.)</li>
<li>Mein Lieblingsessen ist <strong>Pizza</strong>. (My favourite food is pizza.)</li>
</ul>
<h3>Saying You Don''t Like Something</h3>
<ul>
<li>Ich mag das nicht. (I don''t like that.)</li>
<li>Das schmeckt mir nicht. (That doesn''t taste good to me.)</li>
</ul>',
  4, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0005-0004-000000000001', 'a0000000-0000-0000-0005-000000000004', 'multiple_choice',
   'Complete: Ich ___ Pizza. (I like)',
   '["mag","magst","mögen","mögt"]'::jsonb, 'mag', NOW()),
  ('a0000000-0000-0005-0004-000000000002', 'a0000000-0000-0000-0005-000000000004', 'multiple_choice',
   'How do you ask "Do you like chocolate?"',
   '["Magst du Schokolade?","Ich mag Schokolade.","Hast du Schokolade?","Isst du Schokolade?"]'::jsonb, 'Magst du Schokolade?', NOW()),
  ('a0000000-0000-0005-0004-000000000003', 'a0000000-0000-0000-0005-000000000004', 'fill_blank',
   'Complete: Das schmeckt mir ___. (doesn''t taste good — use "nicht")',
   null, 'nicht', NOW()),
  ('a0000000-0000-0005-0004-000000000004', 'a0000000-0000-0000-0005-000000000004', 'word_order',
   'Arrange: "My favourite food is pizza."',
   '["Mein","Lieblingsessen","ist","Pizza","."]'::jsonb, 'Mein Lieblingsessen ist Pizza .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 5: Rezepte und Kochen
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0005-000000000005',
  'a0000000-0000-0000-0000-000000000005',
  'rezepte-und-kochen',
  'Rezepte und Kochen',
  '<h2>Rezepte und Kochen</h2>
<h3>Cooking Verbs</h3>
<table>
<thead><tr><th>German</th><th>English</th></tr></thead>
<tbody>
<tr><td>kochen</td><td>to cook</td></tr>
<tr><td>schneiden</td><td>to cut</td></tr>
<tr><td>mischen</td><td>to mix</td></tr>
<tr><td>backen</td><td>to bake</td></tr>
<tr><td>braten</td><td>to fry / roast</td></tr>
</tbody>
</table>
<h3>A Simple Recipe: Nudelsalat (Pasta Salad)</h3>
<ol>
<li>Koche die Nudeln. (Cook the pasta.)</li>
<li>Schneide das Gemüse. (Cut the vegetables.)</li>
<li>Mische die Nudeln mit dem Gemüse. (Mix the pasta with the vegetables.)</li>
<li>Füge Salz und Öl hinzu. (Add salt and oil.)</li>
<li>Guten Appetit! (Enjoy your meal!)</li>
</ol>
<h3>Imperative Forms (Instructions)</h3>
<ul>
<li>Koch(e)! (Cook! – informal singular)</li>
<li>Kocht! (Cook! – informal plural)</li>
<li>Kochen Sie! (Cook! – formal)</li>
</ul>',
  5, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0005-0005-000000000001', 'a0000000-0000-0000-0005-000000000005', 'multiple_choice',
   'How do you say "to cut" in German?',
   '["schneiden","kochen","mischen","backen"]'::jsonb, 'schneiden', NOW()),
  ('a0000000-0000-0005-0005-000000000002', 'a0000000-0000-0000-0005-000000000005', 'multiple_choice',
   'What does "Guten Appetit!" mean?',
   '["Enjoy your meal!","Good morning!","Good luck!","Thank you!"]'::jsonb, 'Enjoy your meal!', NOW()),
  ('a0000000-0000-0005-0005-000000000003', 'a0000000-0000-0000-0005-000000000005', 'fill_blank',
   'Complete: ___ die Nudeln. (Cook the pasta — informal singular imperative)',
   null, 'Koch', NOW()),
  ('a0000000-0000-0005-0005-000000000004', 'a0000000-0000-0000-0005-000000000005', 'word_order',
   'Arrange: "Mix the pasta with the vegetables."',
   '["Mische","die","Nudeln","mit","dem","Gemüse","."]'::jsonb, 'Mische die Nudeln mit dem Gemüse .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Quiz (order_index 99)
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0005-000000000099',
  'a0000000-0000-0000-0000-000000000005',
  'room-05-quiz-food-restaurants',
  'Room 05 Quiz – Food & Restaurants',
  '<h2>Checkpoint Quiz</h2><p>Test your knowledge of meals, restaurant ordering, drinks, preferences, and recipes.</p>',
  99, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0005-0099-000000000001', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'What is "das Abendessen" in English?',
   '["dinner","breakfast","lunch","snack"]'::jsonb, 'dinner', NOW()),
  ('a0000000-0000-0005-0099-000000000002', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'How do you say "I would like to order"?',
   '["Ich möchte bestellen.","Ich möchte gehen.","Ich möchte kochen.","Ich möchte kaufen."]'::jsonb, 'Ich möchte bestellen.', NOW()),
  ('a0000000-0000-0005-0099-000000000003', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'What does "die Speisekarte" mean?',
   '["menu","bill","tip","waiter"]'::jsonb, 'menu', NOW()),
  ('a0000000-0000-0005-0099-000000000004', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'Complete: Ich ___ Pizza. (I like)',
   '["mag","habe","bin","will"]'::jsonb, 'mag', NOW()),
  ('a0000000-0000-0005-0099-000000000005', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'How do you say "a bottle of water"?',
   '["eine Flasche Wasser","eine Tasse Wasser","ein Glas Wasser","ein Liter Wasser"]'::jsonb, 'eine Flasche Wasser', NOW()),
  ('a0000000-0000-0005-0099-000000000006', 'a0000000-0000-0000-0005-000000000099', 'fill_blank',
   'Translate "the bill" into German.',
   null, 'die Rechnung', NOW()),
  ('a0000000-0000-0005-0099-000000000007', 'a0000000-0000-0000-0005-000000000099', 'fill_blank',
   'Complete: Guten ___! (Enjoy your meal!)',
   null, 'Appetit', NOW()),
  ('a0000000-0000-0005-0099-000000000008', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'How do you say "to cook" in German?',
   '["kochen","backen","braten","mischen"]'::jsonb, 'kochen', NOW()),
  ('a0000000-0000-0005-0099-000000000009', 'a0000000-0000-0000-0005-000000000099', 'word_order',
   'Arrange: "For me, the salad please."',
   '["Für","mich","bitte","den","Salat","."]'::jsonb, 'Für mich bitte den Salat .', NOW()),
  ('a0000000-0000-0005-0099-000000000010', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'What is "der Wein" in English?',
   '["wine","beer","juice","water"]'::jsonb, 'wine', NOW())
ON CONFLICT (id) DO NOTHING;
