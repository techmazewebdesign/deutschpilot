-- A1 Room 05 – Food & Restaurants
-- Course ID: a0000000-0000-0000-0000-000000000005

INSERT INTO courses (id, slug, title, description, level, language, is_published, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000005',
  'a1-food-restaurants',
  'A1 Room 05 – Food & Restaurants',
  'Learn to order food, talk about meals, express preferences, and navigate restaurants in German.',
  'A1', 'de', true, NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lesson 1: Mahlzeiten und Essen
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0005-000000000001',
  'a0000000-0000-0000-0000-000000000005',
  'mahlzeiten-und-essen',
  'Mahlzeiten und Essen',
  '# Mahlzeiten und Essen

## Meals of the Day

| German | English |
|--------|---------|
| das Frühstück | breakfast |
| das Mittagessen | lunch |
| das Abendessen | dinner / supper |
| der Snack | snack |

## Common Foods

| German | English |
|--------|---------|
| die Suppe | soup |
| der Salat | salad |
| das Hähnchen | chicken |
| die Pasta | pasta |
| der Reis | rice |
| das Sandwich | sandwich |
| der Kuchen | cake |
| das Eis | ice cream |

## Meal Phrases

- Zum Frühstück esse ich **Brot mit Käse**. (For breakfast I eat bread with cheese.)
- Zum Mittagessen möchte ich **Suppe**. (For lunch I would like soup.)
- Was gibt es zum Abendessen? (What is there for dinner?)',
  1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0005-0001-000000000001', 'a0000000-0000-0000-0005-000000000001', 'multiple_choice',
   'What is "das Frühstück"?',
   '["breakfast","lunch","dinner","snack"]', 'breakfast'),
  ('a0000000-0000-0005-0001-000000000002', 'a0000000-0000-0000-0005-000000000001', 'multiple_choice',
   'How do you say "soup" in German?',
   '["die Suppe","der Salat","der Reis","das Eis"]', 'die Suppe'),
  ('a0000000-0000-0005-0001-000000000003', 'a0000000-0000-0000-0005-000000000001', 'fill_blank',
   'Complete: Zum Frühstück esse ich ___. (bread)',
   null, 'Brot'),
  ('a0000000-0000-0005-0001-000000000004', 'a0000000-0000-0000-0005-000000000001', 'word_order',
   'Arrange: "For lunch I would like soup."',
   '["Zum","Mittagessen","möchte","ich","Suppe","."]', 'Zum Mittagessen möchte ich Suppe .')
ON CONFLICT (id) DO NOTHING;

-- Lesson 2: Im Restaurant bestellen
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0005-000000000002',
  'a0000000-0000-0000-0000-000000000005',
  'im-restaurant-bestellen',
  'Im Restaurant bestellen',
  '# Im Restaurant bestellen

## Restaurant Vocabulary

| German | English |
|--------|---------|
| die Speisekarte | menu |
| der Kellner | waiter |
| die Kellnerin | waitress |
| der Tisch | table |
| die Bestellung | order |
| die Rechnung | bill |

## Ordering Food

- Ich hätte gern ... (I would like ...)
- Ich möchte ... bestellen. (I would like to order ...)
- Was empfehlen Sie? (What do you recommend?)
- Für mich bitte ... (For me please ...)

## A Restaurant Dialogue

**Kellner:** Was möchten Sie bestellen? (What would you like to order?)
**Gast:** Ich hätte gern die Suppe und einen Salat, bitte. (I would like the soup and a salad, please.)
**Kellner:** Und was möchten Sie trinken? (And what would you like to drink?)
**Gast:** Ein Wasser, bitte. (A water, please.)
**Gast:** Die Rechnung bitte! (The bill, please!)',
  2
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0005-0002-000000000001', 'a0000000-0000-0000-0005-000000000002', 'multiple_choice',
   'How do you say "the bill, please"?',
   '["Die Rechnung bitte!","Die Speisekarte bitte!","Den Tisch bitte!","Die Bestellung bitte!"]', 'Die Rechnung bitte!'),
  ('a0000000-0000-0005-0002-000000000002', 'a0000000-0000-0000-0005-000000000002', 'multiple_choice',
   'What does "die Speisekarte" mean?',
   '["menu","bill","order","table"]', 'menu'),
  ('a0000000-0000-0005-0002-000000000003', 'a0000000-0000-0000-0005-000000000002', 'fill_blank',
   'Complete: Ich ___ gern die Suppe. (I would like)',
   null, 'hätte'),
  ('a0000000-0000-0005-0002-000000000004', 'a0000000-0000-0000-0005-000000000002', 'word_order',
   'Arrange: "I would like to order a salad."',
   '["Ich","möchte","einen","Salat","bestellen","."]', 'Ich möchte einen Salat bestellen .')
ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Getränke und Trinken
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0005-000000000003',
  'a0000000-0000-0000-0000-000000000005',
  'getraenke-und-trinken',
  'Getränke und Trinken',
  '# Getränke und Trinken

## Drinks Vocabulary

| German | English |
|--------|---------|
| das Wasser | water |
| der Kaffee | coffee |
| der Tee | tea |
| der Saft | juice |
| die Milch | milk |
| das Bier | beer |
| der Wein | wine |
| die Limonade | lemonade / soda |

## Ordering Drinks

- Ein Kaffee, bitte. (A coffee, please.)
- Ich möchte einen Tee. (I would like a tea.)
- Haben Sie Orangensaft? (Do you have orange juice?)
- Mit oder ohne Milch? (With or without milk?)
- Mit Zucker, bitte. (With sugar, please.)

## Verb: trinken (to drink)

| Person | Form |
|--------|------|
| ich | trinke |
| du | trinkst |
| er/sie/es | trinkt |

- Ich **trinke** jeden Morgen Kaffee. (I drink coffee every morning.)',
  3
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0005-0003-000000000001', 'a0000000-0000-0000-0005-000000000003', 'multiple_choice',
   'How do you say "juice" in German?',
   '["der Saft","das Bier","der Wein","der Tee"]', 'der Saft'),
  ('a0000000-0000-0005-0003-000000000002', 'a0000000-0000-0000-0005-000000000003', 'multiple_choice',
   'Complete: Ich ___ jeden Morgen Kaffee.',
   '["trinke","trinkst","trinkt","trinken"]', 'trinke'),
  ('a0000000-0000-0005-0003-000000000003', 'a0000000-0000-0000-0005-000000000003', 'fill_blank',
   'Complete: Mit oder ohne ___? (sugar)',
   null, 'Zucker'),
  ('a0000000-0000-0005-0003-000000000004', 'a0000000-0000-0000-0005-000000000003', 'word_order',
   'Arrange: "I would like a tea with milk."',
   '["Ich","möchte","einen","Tee","mit","Milch","."]', 'Ich möchte einen Tee mit Milch .')
ON CONFLICT (id) DO NOTHING;

-- Lesson 4: Essen mögen – Vorlieben
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0005-000000000004',
  'a0000000-0000-0000-0000-000000000005',
  'essen-moegen-vorlieben',
  'Essen mögen – Vorlieben',
  '# Essen mögen – Vorlieben

## Expressing Likes and Dislikes

Use **gern** / **nicht gern** (like / don't like):

- Ich esse **gern** Pizza. (I like eating pizza.)
- Ich trinke **gern** Kaffee. (I like drinking coffee.)
- Ich esse **nicht gern** Fisch. (I don't like eating fish.)

Use **mögen** (to like):

| Person | mögen |
|--------|-------|
| ich | mag |
| du | magst |
| er/sie/es | mag |

- Ich **mag** Schokolade. (I like chocolate.)
- Magst du Käse? — Ja, ich mag Käse sehr gern. (Do you like cheese? — Yes, I like cheese very much.)
- Er **mag** kein Gemüse. (He doesn't like vegetables.)

## Asking About Preferences

- Was isst du gern? (What do you like to eat?)
- Was trinkst du gern? (What do you like to drink?)
- Magst du ...? (Do you like ...?)',
  4
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0005-0004-000000000001', 'a0000000-0000-0000-0005-000000000004', 'multiple_choice',
   'Complete: Ich esse ___ Pizza. (I like eating pizza)',
   '["gern","nicht","kein","sehr"]', 'gern'),
  ('a0000000-0000-0005-0004-000000000002', 'a0000000-0000-0000-0005-000000000004', 'multiple_choice',
   'Complete: Ich ___ Schokolade. (I like chocolate)',
   '["mag","magst","mögen","möchte"]', 'mag'),
  ('a0000000-0000-0005-0004-000000000003', 'a0000000-0000-0000-0005-000000000004', 'fill_blank',
   'Complete: Er mag kein ___. (He doesn't like vegetables)',
   null, 'Gemüse'),
  ('a0000000-0000-0005-0004-000000000004', 'a0000000-0000-0000-0005-000000000004', 'word_order',
   'Arrange: "I don't like eating fish."',
   '["Ich","esse","nicht","gern","Fisch","."]', 'Ich esse nicht gern Fisch .')
ON CONFLICT (id) DO NOTHING;

-- Lesson 5: Rezepte und Kochen
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0005-000000000005',
  'a0000000-0000-0000-0000-000000000005',
  'rezepte-und-kochen',
  'Rezepte und Kochen',
  '# Rezepte und Kochen

## Cooking Verbs

| German | English |
|--------|---------|
| kochen | to cook |
| backen | to bake |
| braten | to fry |
| schneiden | to cut |
| mischen | to mix |
| hinzufügen | to add |

## Kitchen Items

| German | English |
|--------|---------|
| die Pfanne | frying pan |
| der Topf | pot |
| das Messer | knife |
| der Ofen | oven |
| das Rezept | recipe |

## A Simple Recipe: Rührei (Scrambled Eggs)

1. Nehme **zwei Eier**. (Take two eggs.)
2. Mische die Eier mit **Salz** und **Pfeffer**. (Mix the eggs with salt and pepper.)
3. Erhitze die **Pfanne** mit etwas Butter. (Heat the pan with some butter.)
4. **Brate** die Eier für zwei Minuten. (Fry the eggs for two minutes.)
5. **Fertig!** (Done!)',
  5
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0005-0005-000000000001', 'a0000000-0000-0000-0005-000000000005', 'multiple_choice',
   'What does "backen" mean?',
   '["to bake","to fry","to cut","to mix"]', 'to bake'),
  ('a0000000-0000-0005-0005-000000000002', 'a0000000-0000-0000-0005-000000000005', 'multiple_choice',
   'How do you say "frying pan" in German?',
   '["die Pfanne","der Topf","das Messer","der Ofen"]', 'die Pfanne'),
  ('a0000000-0000-0005-0005-000000000003', 'a0000000-0000-0000-0005-000000000005', 'fill_blank',
   'Complete: Mische die Eier mit Salz und ___. (pepper)',
   null, 'Pfeffer'),
  ('a0000000-0000-0005-0005-000000000004', 'a0000000-0000-0000-0005-000000000005', 'word_order',
   'Arrange: "I like cooking every day."',
   '["Ich","koche","gern","jeden","Tag","."]', 'Ich koche gern jeden Tag .')
ON CONFLICT (id) DO NOTHING;

-- Quiz (order_index 99)
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0005-000000000099',
  'a0000000-0000-0000-0000-000000000005',
  'room-05-quiz-food-restaurants',
  'Room 05 Quiz – Food & Restaurants',
  'Test your knowledge of food vocabulary, restaurant phrases, drinks, preferences, and cooking.',
  99
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0005-0099-000000000001', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'What is "das Mittagessen"?',
   '["lunch","breakfast","dinner","snack"]', 'lunch'),
  ('a0000000-0000-0005-0099-000000000002', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'How do you say "the menu"?',
   '["die Speisekarte","die Rechnung","der Tisch","die Bestellung"]', 'die Speisekarte'),
  ('a0000000-0000-0005-0099-000000000003', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'Complete: Ich ___ gern Pizza.',
   '["esse","trinkst","magst","kochst"]', 'esse'),
  ('a0000000-0000-0005-0099-000000000004', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'What does "backen" mean?',
   '["to bake","to fry","to drink","to mix"]', 'to bake'),
  ('a0000000-0000-0005-0099-000000000005', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'How do you ask for the bill?',
   '["Die Rechnung bitte!","Die Speisekarte!","Den Kellner!","Ein Wasser!"]', 'Die Rechnung bitte!'),
  ('a0000000-0000-0005-0099-000000000006', 'a0000000-0000-0000-0005-000000000099', 'fill_blank',
   'Translate "coffee" into German.',
   null, 'der Kaffee'),
  ('a0000000-0000-0005-0099-000000000007', 'a0000000-0000-0000-0005-000000000099', 'fill_blank',
   'Complete: Ich ___ Schokolade. (I like chocolate — use mögen)',
   null, 'mag'),
  ('a0000000-0000-0005-0099-000000000008', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'How do you say "I like drinking tea"?',
   '["Ich trinke gern Tee.","Ich mag kein Tee.","Ich trinke nicht Tee.","Ich esse gern Tee."]', 'Ich trinke gern Tee.'),
  ('a0000000-0000-0005-0099-000000000009', 'a0000000-0000-0000-0005-000000000099', 'word_order',
   'Arrange: "I would like to order chicken and rice."',
   '["Ich","möchte","Hähnchen","und","Reis","bestellen","."]', 'Ich möchte Hähnchen und Reis bestellen .'),
  ('a0000000-0000-0005-0099-000000000010', 'a0000000-0000-0000-0005-000000000099', 'multiple_choice',
   'What is "die Pfanne"?',
   '["frying pan","pot","knife","oven"]', 'frying pan')
ON CONFLICT (id) DO NOTHING;
