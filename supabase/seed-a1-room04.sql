-- A1 Room 04 – Shopping & Daily Needs
-- Course ID: a0000000-0000-0000-0000-000000000004

INSERT INTO courses (id, slug, title, description, level, language, is_published, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'a1-shopping',
  'A1 Room 04 – Shopping & Daily Needs',
  'Learn to shop for food and clothes, understand prices, use modal verbs, and ask for help in stores.',
  'A1', 'de', true, NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lesson 1: Im Supermarkt – Lebensmittel
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0004-000000000001',
  'a0000000-0000-0000-0000-000000000004',
  'im-supermarkt-lebensmittel',
  'Im Supermarkt – Lebensmittel',
  '# Im Supermarkt – Lebensmittel

## Food Vocabulary with Articles

| German | English |
|--------|---------|
| das Brot | bread |
| die Milch | milk |
| das Fleisch | meat |
| das Gemüse | vegetables |
| das Obst | fruit |
| der Käse | cheese |
| die Eier (pl.) | eggs |
| der Saft | juice |
| das Wasser | water |
| der Joghurt | yogurt |

## Shopping Phrases

- Ich kaufe **Brot** und **Milch**. (I buy bread and milk.)
- Ich brauche **Obst** und **Gemüse**. (I need fruit and vegetables.)
- Haben Sie **Käse**? (Do you have cheese?)
- Wo ist der **Joghurt**? (Where is the yogurt?)',
  1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0004-0001-000000000001', 'a0000000-0000-0000-0004-000000000001', 'multiple_choice',
   'What is the article for "bread" (das Brot)?',
   '["das","die","der","den"]', 'das'),
  ('a0000000-0000-0004-0001-000000000002', 'a0000000-0000-0000-0004-000000000001', 'multiple_choice',
   'How do you say "milk" in German?',
   '["die Milch","das Brot","der Saft","das Wasser"]', 'die Milch'),
  ('a0000000-0000-0004-0001-000000000003', 'a0000000-0000-0000-0004-000000000001', 'fill_blank',
   'Complete: Ich kaufe Brot und ___. (milk)',
   null, 'Milch'),
  ('a0000000-0000-0004-0001-000000000004', 'a0000000-0000-0000-0004-000000000001', 'word_order',
   'Arrange: "I need fruit and vegetables."',
   '["Ich","brauche","Obst","und","Gemüse","."]', 'Ich brauche Obst und Gemüse .')
ON CONFLICT (id) DO NOTHING;

-- Lesson 2: Preise und Zahlen
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0004-000000000002',
  'a0000000-0000-0000-0000-000000000004',
  'preise-und-zahlen',
  'Preise und Zahlen',
  '# Preise und Zahlen

## Asking About Prices

- Wie viel kostet das? (How much does that cost?)
- Was kostet ...? (What does ... cost?)
- Das kostet **zwei Euro**. (That costs two euros.)
- Das kostet **1,50 Euro**. (That costs 1.50 euros.)

## Numbers Review (1–100)

| Number | German |
|--------|--------|
| 10 | zehn |
| 20 | zwanzig |
| 30 | dreißig |
| 40 | vierzig |
| 50 | fünfzig |
| 100 | hundert |

- einundzwanzig (21), zweiundzwanzig (22) ...
- dreiunddreißig (33), vierundvierzig (44) ...

## At the Checkout

- Das macht **fünf Euro** bitte. (That's five euros please.)
- Hier sind **zehn Euro**. (Here are ten euros.)
- Das Wechselgeld ist **fünf Euro**. (The change is five euros.)',
  2
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0004-0002-000000000001', 'a0000000-0000-0000-0004-000000000002', 'multiple_choice',
   'How do you ask "How much does that cost?" in German?',
   '["Wie viel kostet das?","Was ist das?","Wo ist das?","Wie heißt das?"]', 'Wie viel kostet das?'),
  ('a0000000-0000-0004-0002-000000000002', 'a0000000-0000-0000-0004-000000000002', 'multiple_choice',
   'What is "50" in German?',
   '["fünfzig","vierzig","dreißig","sechzig"]', 'fünfzig'),
  ('a0000000-0000-0004-0002-000000000003', 'a0000000-0000-0000-0004-000000000002', 'fill_blank',
   'Complete: Das kostet zwei ___. (euros)',
   null, 'Euro'),
  ('a0000000-0000-0004-0002-000000000004', 'a0000000-0000-0000-0004-000000000002', 'word_order',
   'Arrange: "That costs five euros."',
   '["Das","kostet","fünf","Euro","."]', 'Das kostet fünf Euro .')
ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Kleidung kaufen
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0004-000000000003',
  'a0000000-0000-0000-0000-000000000004',
  'kleidung-kaufen',
  'Kleidung kaufen',
  '# Kleidung kaufen

## Clothing Vocabulary

| German | English |
|--------|---------|
| das Hemd | shirt |
| die Hose | trousers / pants |
| das Kleid | dress |
| die Jacke | jacket |
| die Schuhe (pl.) | shoes |
| die Mütze | hat / beanie |
| der Pullover | sweater |
| die Socken (pl.) | socks |

## Sizes and Colors

- Welche Größe haben Sie? — Ich habe Größe M. (What size are you? — I'm size M.)
- Welche Farbe möchten Sie? (What colour would you like?)
- Ich möchte das Hemd **in Blau**. (I would like the shirt in blue.)
- Haben Sie die Jacke **in Größe L**? (Do you have the jacket in size L?)

## In the Shop

- Kann ich das anprobieren? (Can I try this on?)
- Das passt gut. (That fits well.)
- Das ist zu groß / zu klein. (That is too big / too small.)',
  3
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0004-0003-000000000001', 'a0000000-0000-0000-0004-000000000003', 'multiple_choice',
   'How do you say "jacket" in German?',
   '["die Jacke","das Hemd","die Hose","der Pullover"]', 'die Jacke'),
  ('a0000000-0000-0004-0003-000000000002', 'a0000000-0000-0000-0004-000000000003', 'multiple_choice',
   'How do you ask "Can I try this on?"',
   '["Kann ich das anprobieren?","Wie viel kostet das?","Haben Sie das?","Welche Größe?"]', 'Kann ich das anprobieren?'),
  ('a0000000-0000-0004-0003-000000000003', 'a0000000-0000-0000-0004-000000000003', 'fill_blank',
   'Complete: Das ist zu ___. (too small)',
   null, 'klein'),
  ('a0000000-0000-0004-0003-000000000004', 'a0000000-0000-0000-0004-000000000003', 'word_order',
   'Arrange: "I would like the shirt in blue."',
   '["Ich","möchte","das","Hemd","in","Blau","."]', 'Ich möchte das Hemd in Blau .')
ON CONFLICT (id) DO NOTHING;

-- Lesson 4: Modal Verbs – können & möchten
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0004-000000000004',
  'a0000000-0000-0000-0000-000000000004',
  'modal-verben-koennen-moechten',
  'Modal Verbs – können & möchten',
  '# Modal Verbs – können & möchten

## können (can / to be able to)

| Person | Form |
|--------|------|
| ich | kann |
| du | kannst |
| er/sie/es | kann |
| wir | können |
| ihr | könnt |
| sie/Sie | können |

## möchten (would like to)

| Person | Form |
|--------|------|
| ich | möchte |
| du | möchtest |
| er/sie/es | möchte |
| wir | möchten |

## Usage

Modal verbs come in second position; the main verb goes to the end:

- Ich **kann** Deutsch **sprechen**. (I can speak German.)
- **Kannst** du mir **helfen**? (Can you help me?)
- Ich **möchte** ein Brot **kaufen**. (I would like to buy a bread.)
- **Möchtest** du einen Kaffee **trinken**? (Would you like to drink a coffee?)
  4
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0004-0004-000000000001', 'a0000000-0000-0000-0004-000000000004', 'multiple_choice',
   'Complete: Ich ___ Deutsch sprechen. (I can speak German)',
   '["kann","kannst","können","könnt"]', 'kann'),
  ('a0000000-0000-0004-0004-000000000002', 'a0000000-0000-0000-0004-000000000004', 'multiple_choice',
   'Complete: Ich ___ ein Brot kaufen. (I would like)',
   '["möchte","möchtest","möchten","kann"]', 'möchte'),
  ('a0000000-0000-0004-0004-000000000003', 'a0000000-0000-0000-0004-000000000004', 'fill_blank',
   'Complete: ___ du mir helfen? (Can you help me?)',
   null, 'Kannst'),
  ('a0000000-0000-0004-0004-000000000004', 'a0000000-0000-0000-0004-000000000004', 'word_order',
   'Arrange: "I would like to buy a jacket."',
   '["Ich","möchte","eine","Jacke","kaufen","."]', 'Ich möchte eine Jacke kaufen .')
ON CONFLICT (id) DO NOTHING;

-- Lesson 5: Im Geschäft – Einkaufsgespräch
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0004-000000000005',
  'a0000000-0000-0000-0000-000000000004',
  'im-geschaeft-einkaufsgespraech',
  'Im Geschäft – Einkaufsgespräch',
  '# Im Geschäft – Einkaufsgespräch

## A Shopping Dialogue

**Verkäufer:** Guten Tag! Kann ich Ihnen helfen? (Good day! Can I help you?)
**Kunde:** Ja, ich suche eine Jacke in Größe M. (Yes, I am looking for a jacket in size M.)
**Verkäufer:** Welche Farbe möchten Sie? (What colour would you like?)
**Kunde:** Blau, bitte. (Blue, please.)
**Verkäufer:** Hier ist eine blaue Jacke. Möchten Sie sie anprobieren? (Here is a blue jacket. Would you like to try it on?)
**Kunde:** Ja, gerne. — Das passt gut. Wie viel kostet sie? (Yes, please. — It fits well. How much does it cost?)
**Verkäufer:** Sie kostet 35 Euro. (It costs 35 euros.)
**Kunde:** Gut, ich nehme sie. (Good, I'll take it.)

## Key Phrases

- Ich suche ... (I am looking for ...)
- Haben Sie ...? (Do you have ...?)
- Ich nehme es/sie/ihn. (I'll take it.)
- Das ist zu teuer. (That is too expensive.)
- Das ist ein gutes Angebot. (That is a good offer.)',
  5
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0004-0005-000000000001', 'a0000000-0000-0000-0004-000000000005', 'multiple_choice',
   'How do you say "I am looking for a jacket"?',
   '["Ich suche eine Jacke.","Ich kaufe eine Jacke.","Ich habe eine Jacke.","Ich möchte eine Jacke."]', 'Ich suche eine Jacke.'),
  ('a0000000-0000-0004-0005-000000000002', 'a0000000-0000-0000-0004-000000000005', 'multiple_choice',
   'What does "Das ist zu teuer" mean?',
   '["That is too expensive.","That fits well.","That is a good offer.","I'll take it."]', 'That is too expensive.'),
  ('a0000000-0000-0004-0005-000000000003', 'a0000000-0000-0000-0004-000000000005', 'fill_blank',
   'Complete: Ich ___ es. (I'll take it)',
   null, 'nehme'),
  ('a0000000-0000-0004-0005-000000000004', 'a0000000-0000-0000-0004-000000000005', 'word_order',
   'Arrange: "I am looking for shoes in size 42."',
   '["Ich","suche","Schuhe","in","Größe","42","."]', 'Ich suche Schuhe in Größe 42 .')
ON CONFLICT (id) DO NOTHING;

-- Quiz (order_index 99)
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0004-000000000099',
  'a0000000-0000-0000-0000-000000000004',
  'room-04-quiz-shopping-daily-needs',
  'Room 04 Quiz – Shopping & Daily Needs',
  'Test your knowledge of food vocabulary, prices, clothing, modal verbs, and shopping conversations.',
  99
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0004-0099-000000000001', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'What is "das Gemüse" in English?',
   '["vegetables","fruit","meat","bread"]', 'vegetables'),
  ('a0000000-0000-0004-0099-000000000002', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'How do you ask "How much does that cost?"',
   '["Wie viel kostet das?","Was ist das?","Wo kaufst du?","Hast du Geld?"]', 'Wie viel kostet das?'),
  ('a0000000-0000-0004-0099-000000000003', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'Complete: Ich ___ Deutsch sprechen.',
   '["kann","möchte","will","soll"]', 'kann'),
  ('a0000000-0000-0004-0099-000000000004', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'What does "die Jacke" mean?',
   '["jacket","shirt","dress","trousers"]', 'jacket'),
  ('a0000000-0000-0004-0099-000000000005', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'Complete: Ich möchte ___ Brot kaufen.',
   '["ein","eine","einen","einem"]', 'ein'),
  ('a0000000-0000-0004-0099-000000000006', 'a0000000-0000-0000-0004-000000000099', 'fill_blank',
   'Translate "cheese" into German.',
   null, 'der Käse'),
  ('a0000000-0000-0004-0099-000000000007', 'a0000000-0000-0000-0004-000000000099', 'fill_blank',
   'Complete: Das ist zu ___. (too expensive)',
   null, 'teuer'),
  ('a0000000-0000-0004-0099-000000000008', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'How do you say "Can I try this on?"',
   '["Kann ich das anprobieren?","Wie groß ist das?","Was kostet das?","Ich nehme es."]', 'Kann ich das anprobieren?'),
  ('a0000000-0000-0004-0099-000000000009', 'a0000000-0000-0000-0004-000000000099', 'word_order',
   'Arrange: "I would like to buy a sweater."',
   '["Ich","möchte","einen","Pullover","kaufen","."]', 'Ich möchte einen Pullover kaufen .'),
  ('a0000000-0000-0004-0099-000000000010', 'a0000000-0000-0000-0004-000000000099', 'multiple_choice',
   'What is 30 in German?',
   '["dreißig","zwanzig","vierzig","fünfzig"]', 'dreißig')
ON CONFLICT (id) DO NOTHING;
