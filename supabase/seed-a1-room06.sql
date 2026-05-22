-- A1 Room 06 – Getting Around
-- Course ID: a0000000-0000-0000-0000-000000000006

INSERT INTO courses (id, slug, title, description, level, language, is_published, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000006',
  'a1-getting-around',
  'A1 Room 06 – Getting Around',
  'Learn to ask for directions, use public transport, talk about places in the city, and describe locations.',
  'A1', 'de', true, NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lesson 1: Orte in der Stadt
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0006-000000000001',
  'a0000000-0000-0000-0000-000000000006',
  'orte-in-der-stadt',
  'Orte in der Stadt',
  '# Orte in der Stadt

## Places in the City

| German | English |
|--------|---------|
| der Bahnhof | train station |
| der Flughafen | airport |
| die Bushaltestelle | bus stop |
| das Krankenhaus | hospital |
| die Apotheke | pharmacy |
| der Supermarkt | supermarket |
| die Bank | bank |
| das Hotel | hotel |
| die Schule | school |
| das Rathaus | town hall |
| der Park | park |
| die Kirche | church |

## Asking About Places

- Wo ist ...? (Where is ...?)
- Wo ist der Bahnhof? (Where is the train station?)
- Gibt es hier eine Apotheke? (Is there a pharmacy here?)
- Wie weit ist es bis ...? (How far is it to ...?)',
  1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0006-0001-000000000001', 'a0000000-0000-0000-0006-000000000001', 'multiple_choice',
   'What is "der Bahnhof"?',
   '["train station","airport","bus stop","hospital"]', 'train station'),
  ('a0000000-0000-0006-0001-000000000002', 'a0000000-0000-0000-0006-000000000001', 'multiple_choice',
   'How do you ask "Where is the bank?"',
   '["Wo ist die Bank?","Was ist die Bank?","Wo gibt es eine Bank?","Wie weit ist die Bank?"]', 'Wo ist die Bank?'),
  ('a0000000-0000-0006-0001-000000000003', 'a0000000-0000-0000-0006-000000000001', 'fill_blank',
   'Translate "pharmacy" into German.',
   null, 'die Apotheke'),
  ('a0000000-0000-0006-0001-000000000004', 'a0000000-0000-0000-0006-000000000001', 'word_order',
   'Arrange: "Is there a hotel here?"',
   '["Gibt","es","hier","ein","Hotel","?"]', 'Gibt es hier ein Hotel ?')
ON CONFLICT (id) DO NOTHING;

-- Lesson 2: Nach dem Weg fragen
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0006-000000000002',
  'a0000000-0000-0000-0000-000000000006',
  'nach-dem-weg-fragen',
  'Nach dem Weg fragen',
  '# Nach dem Weg fragen

## Asking for Directions

- Entschuldigung, wie komme ich zum Bahnhof? (Excuse me, how do I get to the train station?)
- Können Sie mir helfen? (Can you help me?)
- Ich suche die Apotheke. (I am looking for the pharmacy.)

## Giving Directions

| German | English |
|--------|---------|
| geradeaus | straight ahead |
| links | left |
| rechts | right |
| die erste Straße links | the first street on the left |
| die zweite Straße rechts | the second street on the right |
| an der Ampel | at the traffic lights |
| gegenüber | opposite |
| neben | next to |

## Examples

- Gehen Sie **geradeaus**, dann **links**. (Go straight ahead, then left.)
- Die Bank ist **gegenüber** dem Hotel. (The bank is opposite the hotel.)
- Der Supermarkt ist **neben** der Kirche. (The supermarket is next to the church.)',
  2
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0006-0002-000000000001', 'a0000000-0000-0000-0006-000000000002', 'multiple_choice',
   'What does "geradeaus" mean?',
   '["straight ahead","left","right","opposite"]', 'straight ahead'),
  ('a0000000-0000-0006-0002-000000000002', 'a0000000-0000-0000-0006-000000000002', 'multiple_choice',
   'How do you say "next to" in German?',
   '["neben","gegenüber","links","rechts"]', 'neben'),
  ('a0000000-0000-0006-0002-000000000003', 'a0000000-0000-0000-0006-000000000002', 'fill_blank',
   'Complete: Gehen Sie ___, dann links. (straight ahead)',
   null, 'geradeaus'),
  ('a0000000-0000-0006-0002-000000000004', 'a0000000-0000-0000-0006-000000000002', 'word_order',
   'Arrange: "The bank is opposite the hotel."',
   '["Die","Bank","ist","gegenüber","dem","Hotel","."]', 'Die Bank ist gegenüber dem Hotel .')
ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Öffentliche Verkehrsmittel
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0006-000000000003',
  'a0000000-0000-0000-0000-000000000006',
  'oeffentliche-verkehrsmittel',
  'Öffentliche Verkehrsmittel',
  '# Öffentliche Verkehrsmittel

## Public Transport Vocabulary

| German | English |
|--------|---------|
| der Bus | bus |
| die U-Bahn | underground / subway |
| die S-Bahn | suburban train |
| der Zug | train |
| die Straßenbahn | tram |
| das Ticket / die Fahrkarte | ticket |
| die Haltestelle | stop |
| einsteigen | to get on |
| aussteigen | to get off |
| umsteigen | to change (transport) |

## Buying a Ticket

- Ich möchte eine Fahrkarte nach Berlin. (I would like a ticket to Berlin.)
- Einmal hin und zurück, bitte. (One return ticket, please.)
- Einmal einfach nach München. (One single to Munich.)
- Welcher Zug fährt nach Hamburg? (Which train goes to Hamburg?)',
  3
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0006-0003-000000000001', 'a0000000-0000-0000-0006-000000000003', 'multiple_choice',
   'What is "die U-Bahn"?',
   '["underground / subway","bus","tram","suburban train"]', 'underground / subway'),
  ('a0000000-0000-0006-0003-000000000002', 'a0000000-0000-0000-0006-000000000003', 'multiple_choice',
   'What does "umsteigen" mean?',
   '["to change (transport)","to get on","to get off","to arrive"]', 'to change (transport)'),
  ('a0000000-0000-0006-0003-000000000003', 'a0000000-0000-0000-0006-000000000003', 'fill_blank',
   'Complete: Einmal ___ und zurück, bitte. (one return)',
   null, 'hin'),
  ('a0000000-0000-0006-0003-000000000004', 'a0000000-0000-0000-0006-000000000003', 'word_order',
   'Arrange: "I would like a ticket to Berlin."',
   '["Ich","möchte","eine","Fahrkarte","nach","Berlin","."]', 'Ich möchte eine Fahrkarte nach Berlin .')
ON CONFLICT (id) DO NOTHING;

-- Lesson 4: Präpositionen des Ortes
INSERT INTO lessons (id, course_id, title, content, order_index, is_published)
VALUES (
  'a0000000-0000-0000-0006-000000000004',
  'a0000000-0000-0000-0000-000000000006',
  'Präpositionen des Ortes',
  '# Präpositionen des Ortes

## Location Prepositions (with dative)

| German | English | Example |
|--------|---------|---------|
| in | in | Das Buch ist **im** (in dem) Regal. |
| an | at / on | Das Bild ist **an der** Wand. |
| auf | on (top of) | Die Tasse ist **auf dem** Tisch. |
| unter | under | Die Katze ist **unter dem** Bett. |
| über | above | Das Licht ist **über dem** Tisch. |
| neben | next to | Die Lampe ist **neben dem** Sofa. |
| zwischen | between | Der Stuhl ist **zwischen** dem Tisch und der Wand. |
| vor | in front of | Das Auto ist **vor dem** Haus. |
| hinter | behind | Der Garten ist **hinter dem** Haus. |

## Contractions

- in + dem = **im**
- an + dem = **am**
- zu + dem = **zum**
- zu + der = **zur**',
  4
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0006-0004-000000000001', 'a0000000-0000-0000-0006-000000000004', 'multiple_choice',
   'What does "hinter" mean?',
   '["behind","in front of","next to","between"]', 'behind'),
  ('a0000000-0000-0006-0004-000000000002', 'a0000000-0000-0000-0006-000000000004', 'multiple_choice',
   'Complete: Die Tasse ist ___ dem Tisch. (on the table)',
   '["auf","unter","an","in"]', 'auf'),
  ('a0000000-0000-0006-0004-000000000003', 'a0000000-0000-0000-0006-000000000004', 'fill_blank',
   'Complete: in + dem = ___',
   null, 'im'),
  ('a0000000-0000-0006-0004-000000000004', 'a0000000-0000-0000-0006-000000000004', 'word_order',
   'Arrange: "The cat is under the bed."',
   '["Die","Katze","ist","unter","dem","Bett","."]', 'Die Katze ist unter dem Bett .')
ON CONFLICT (id) DO NOTHING;

-- Lesson 5: Reisen planen
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0006-000000000005',
  'a0000000-0000-0000-0000-000000000006',
  'reisen-planen',
  'Reisen planen',
  '# Reisen planen

## Planning a Trip

- Wohin möchtest du reisen? (Where would you like to travel?)
- Ich möchte nach **Berlin** reisen. (I would like to travel to Berlin.)
- Wann fährt der Zug ab? (When does the train leave?)
- Der Zug fährt um **14 Uhr** ab. (The train leaves at 2 pm.)
- Wie lange dauert die Fahrt? (How long does the journey take?)
- Die Fahrt dauert **zwei Stunden**. (The journey takes two hours.)

## Useful Vocabulary

| German | English |
|--------|---------|
| die Reise | journey / trip |
| der Urlaub | holiday |
| die Unterkunft | accommodation |
| ankommen | to arrive |
| abfahren | to depart |
| buchen | to book |
| der Koffer | suitcase |
| der Reisepass | passport |

## At the Hotel

- Ich habe eine Reservierung. (I have a reservation.)
- Ein Einzelzimmer / Doppelzimmer, bitte. (A single / double room, please.)
- Bis wann ist Check-out? (What time is check-out?)',
  5
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0006-0005-000000000001', 'a0000000-0000-0000-0006-000000000005', 'multiple_choice',
   'What does "abfahren" mean?',
   '["to depart","to arrive","to book","to pack"]', 'to depart'),
  ('a0000000-0000-0006-0005-000000000002', 'a0000000-0000-0000-0006-000000000005', 'multiple_choice',
   'How do you say "passport" in German?',
   '["der Reisepass","der Koffer","die Reise","der Urlaub"]', 'der Reisepass'),
  ('a0000000-0000-0006-0005-000000000003', 'a0000000-0000-0000-0006-000000000005', 'fill_blank',
   'Complete: Die Fahrt ___ zwei Stunden. (takes)',
   null, 'dauert'),
  ('a0000000-0000-0006-0005-000000000004', 'a0000000-0000-0000-0006-000000000005', 'word_order',
   'Arrange: "I would like to travel to Munich."',
   '["Ich","möchte","nach","München","reisen","."]', 'Ich möchte nach München reisen .')
ON CONFLICT (id) DO NOTHING;

-- Quiz (order_index 99)
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0006-000000000099',
  'a0000000-0000-0000-0000-000000000006',
  'room-06-quiz-getting-around',
  'Room 06 Quiz – Getting Around',
  'Test your knowledge of city places, directions, public transport, prepositions, and travel planning.',
  99
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0006-0099-000000000001', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'What is "der Bahnhof"?',
   '["train station","airport","bus stop","town hall"]', 'train station'),
  ('a0000000-0000-0006-0099-000000000002', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'What does "geradeaus" mean?',
   '["straight ahead","left","right","behind"]', 'straight ahead'),
  ('a0000000-0000-0006-0099-000000000003', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'What is "die U-Bahn"?',
   '["underground / subway","tram","bus","train"]', 'underground / subway'),
  ('a0000000-0000-0006-0099-000000000004', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'Complete: Die Tasse ist ___ dem Tisch. (on)',
   '["auf","unter","neben","vor"]', 'auf'),
  ('a0000000-0000-0006-0099-000000000005', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'What does "abfahren" mean?',
   '["to depart","to arrive","to book","to travel"]', 'to depart'),
  ('a0000000-0000-0006-0099-000000000006', 'a0000000-0000-0000-0006-000000000099', 'fill_blank',
   'Translate "pharmacy" into German.',
   null, 'die Apotheke'),
  ('a0000000-0000-0006-0099-000000000007', 'a0000000-0000-0000-0006-000000000099', 'fill_blank',
   'Complete: in + dem = ___',
   null, 'im'),
  ('a0000000-0000-0006-0099-000000000008', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'How do you say "I would like a ticket to Hamburg"?',
   '["Ich möchte eine Fahrkarte nach Hamburg.","Ich suche Hamburg.","Wo ist Hamburg?","Ich fahre Hamburg."]', 'Ich möchte eine Fahrkarte nach Hamburg.'),
  ('a0000000-0000-0006-0099-000000000009', 'a0000000-0000-0000-0006-000000000099', 'word_order',
   'Arrange: "The bank is opposite the hotel."',
   '["Die","Bank","ist","gegenüber","dem","Hotel","."]', 'Die Bank ist gegenüber dem Hotel .'),
  ('a0000000-0000-0006-0099-000000000010', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'How do you say "How long does the journey take?"',
   '["Wie lange dauert die Fahrt?","Wann fährt der Zug?","Wohin reist du?","Was kostet die Fahrt?"]', 'Wie lange dauert die Fahrt?')
ON CONFLICT (id) DO NOTHING;
