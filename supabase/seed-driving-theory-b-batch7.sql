-- ============================================================
-- DeutschPilot – Driving Theory (Klasse B) batch 7, 18 more questions
-- Same rules as batches 1-6: original prep questions on well-
-- established German traffic-law topics, not verbatim official content.
-- ============================================================

INSERT INTO public.driving_theory_questions
  (license_class, category, question_de, question_en, options_de, options_en, correct_answer_de, correct_answer_en, explanation_de, explanation_en, order_index)
VALUES

-- Bahnübergänge
('B','Bahnübergänge',
 'Ein Andreaskreuz an einem Bahnübergang bedeutet...',
 'A St. Andrew''s cross at a railway crossing means...',
 '["Vorsicht, Schienenfahrzeuge haben immer Vorrang","der Bahnübergang ist geschlossen","freie Fahrt ohne Einschränkung","nur für Fußgänger relevant"]'::jsonb,
 '["caution — rail vehicles always have priority","the crossing is closed","clear passage with no restriction","only relevant for pedestrians"]'::jsonb,
 'Vorsicht, Schienenfahrzeuge haben immer Vorrang',
 'caution — rail vehicles always have priority',
 NULL, NULL, 138),

('B','Bahnübergänge',
 'Blinkt an einem Bahnübergang rotes Licht oder senkt sich die Schranke...',
 'If a red light flashes at a railway crossing or the barrier is lowering...',
 '["darfst du auf keinen Fall mehr über den Übergang fahren","darfst du noch schnell durchfahren, wenn du dich beeilst","gilt das nur für LKW","musst du nur langsamer werden"]'::jsonb,
 '["you must not cross under any circumstances","you may still quickly drive through if you hurry","it only applies to trucks","you only need to slow down"]'::jsonb,
 'darfst du auf keinen Fall mehr über den Übergang fahren',
 'you must not cross under any circumstances',
 NULL, NULL, 139),

('B','Bahnübergänge',
 'Bleibt dein Fahrzeug auf einem Bahnübergang liegen, solltest du...',
 'If your vehicle stalls on a railway crossing, you should...',
 '["sofort alle Insassen in Sicherheit bringen und, falls vorhanden, den Nothalteknopf/Streckenwärter alarmieren","im Auto warten und versuchen, es neu zu starten","auf die Bahn warten und hupen","zuerst die Polizei anrufen, dann aussteigen"]'::jsonb,
 '["immediately get everyone to safety and, if available, use the emergency stop button or alert the signal box","stay in the car and try to restart it","wait for the train and honk","call the police first, then get out"]'::jsonb,
 'sofort alle Insassen in Sicherheit bringen und, falls vorhanden, den Nothalteknopf/Streckenwärter alarmieren',
 'immediately get everyone to safety and, if available, use the emergency stop button or alert the signal box',
 NULL, NULL, 140),

('B','Bahnübergänge',
 'An einem unbeschrankten Bahnübergang ohne Ampel gilt...',
 'At an ungated railway crossing with no light signal, the rule is...',
 '["besondere Vorsicht — selbst nach links und rechts schauen und Zug-Vorrang beachten","freie Fahrt ohne besondere Pflichten","nur Vorsicht bei Dunkelheit","dieselbe Regel wie an normalen Kreuzungen"]'::jsonb,
 '["special caution — look both ways yourself and respect the train''s priority","clear passage with no special duties","caution only in darkness","the same rule as a normal intersection"]'::jsonb,
 'besondere Vorsicht — selbst nach links und rechts schauen und Zug-Vorrang beachten',
 'special caution — look both ways yourself and respect the train''s priority',
 NULL, NULL, 141),

-- E-Scooter & Mikromobilität
('B','E-Scooter & Mikromobilität',
 'E-Scooter (Elektrokleinstfahrzeuge) im Straßenverkehr...',
 'E-scooters (small electric vehicles) in traffic...',
 '["dürfen meist Radwege nutzen und dort auch überholt/erwartet werden","dürfen generell nicht am Straßenverkehr teilnehmen","gelten rechtlich genau wie Fußgänger","dürfen nur auf Gehwegen fahren"]'::jsonb,
 '["may generally use bike lanes, and you should expect to encounter/overtake them there","may not generally participate in traffic at all","are legally treated exactly like pedestrians","may only be ridden on sidewalks"]'::jsonb,
 'dürfen meist Radwege nutzen und dort auch überholt/erwartet werden',
 'may generally use bike lanes, and you should expect to encounter/overtake them there',
 NULL, NULL, 142),

('B','E-Scooter & Mikromobilität',
 'Beim Überholen von E-Scootern solltest du...',
 'When overtaking e-scooters, you should...',
 '["ausreichend Seitenabstand einhalten, ähnlich wie bei Radfahrern","so nah wie möglich vorbeifahren","hupen, um sie zu warnen","immer rechts überholen"]'::jsonb,
 '["keep sufficient side clearance, similar to cyclists","pass as closely as possible","honk to warn them","always overtake on the right"]'::jsonb,
 'ausreichend Seitenabstand einhalten, ähnlich wie bei Radfahrern',
 'keep sufficient side clearance, similar to cyclists',
 NULL, NULL, 143),

('B','E-Scooter & Mikromobilität',
 'Da E-Scooter kleiner und leiser sind als Autos, solltest du besonders...',
 'Since e-scooters are smaller and quieter than cars, you should especially...',
 '["beim Abbiegen und an Kreuzungen doppelt auf sie achten","dich auf ihr Bremslicht verlassen","davon ausgehen, dass sie sich wie Fußgänger verhalten","keine besondere Rücksicht nehmen müssen"]'::jsonb,
 '["double-check for them when turning and at intersections","rely on their brake light","assume they behave like pedestrians","not need to take any special care"]'::jsonb,
 'beim Abbiegen und an Kreuzungen doppelt auf sie achten',
 'double-check for them when turning and at intersections',
 NULL, NULL, 144),

('B','E-Scooter & Mikromobilität',
 'Für E-Scooter im öffentlichen Straßenverkehr gilt in Deutschland unter anderem...',
 'For e-scooters in public traffic in Germany, among other things...',
 '["eine Promillegrenze ähnlich wie beim Autofahren","keinerlei Alkoholregelung","ein generelles Fahrverbot","nur eine Altersgrenze ohne weitere Regeln"]'::jsonb,
 '["a blood alcohol limit similar to driving a car","no alcohol regulation at all","a general riding ban","only an age limit and no further rules"]'::jsonb,
 'eine Promillegrenze ähnlich wie beim Autofahren',
 'a blood alcohol limit similar to driving a car',
 NULL, NULL, 145),

-- Kindersicherung vertieft
('B','Kindersicherung vertieft',
 'Ein Kindersitz auf dem Beifahrersitz mit aktiviertem Frontairbag...',
 'A child seat in the front passenger seat with an active front airbag...',
 '["ist bei einem rückwärtsgerichteten Sitz gefährlich und muss deaktiviert werden","ist grundsätzlich immer unproblematisch","ist gesetzlich komplett verboten, egal wie","betrifft nur ältere Fahrzeuge"]'::jsonb,
 '["is dangerous with a rear-facing seat and the airbag must be deactivated","is always completely unproblematic","is completely prohibited by law regardless of setup","only affects older vehicles"]'::jsonb,
 'ist bei einem rückwärtsgerichteten Sitz gefährlich und muss deaktiviert werden',
 'is dangerous with a rear-facing seat and the airbag must be deactivated',
 NULL, NULL, 146),

('B','Kindersicherung vertieft',
 'Ein korrekt eingebauter Kindersitz sollte...',
 'A correctly installed child seat should...',
 '["fest sitzen, ohne sich mehr als ca. 2-3 cm seitlich oder nach vorne bewegen zu lassen","sich leicht bewegen lassen, das ist normal","nur mit dem Sicherheitsgurt gesichert werden, nie mit ISOFIX","möglichst locker sitzen für den Komfort"]'::jsonb,
 '["sit firmly, without moving more than about 2-3 cm sideways or forward","move around easily — that''s normal","only be secured with the seatbelt, never with ISOFIX","sit fairly loosely for comfort"]'::jsonb,
 'fest sitzen, ohne sich mehr als ca. 2-3 cm seitlich oder nach vorne bewegen zu lassen',
 'sit firmly, without moving more than about 2-3 cm sideways or forward',
 NULL, NULL, 147),

('B','Kindersicherung vertieft',
 'Für Babys und Kleinkinder wird ein rückwärtsgerichteter Kindersitz empfohlen, weil...',
 'A rear-facing child seat is recommended for babies and toddlers because...',
 '["er den Kopf, Nacken und die Wirbelsäule bei einem Frontalaufprall besser schützt","er billiger ist","er einfacher einzubauen ist","es keinen Unterschied zur Fahrtrichtung macht"]'::jsonb,
 '["it better protects the head, neck, and spine in a frontal collision","it''s cheaper","it''s easier to install","direction makes no difference at all"]'::jsonb,
 'er den Kopf, Nacken und die Wirbelsäule bei einem Frontalaufprall besser schützt',
 'it better protects the head, neck, and spine in a frontal collision',
 NULL, NULL, 148),

-- Sondertransporte & breite Fahrzeuge
('B','Sondertransporte',
 'Ein Schwertransport mit Begleitfahrzeugen (Blinklicht, "Achtung Schwertransport")...',
 'An oversized load transport with escort vehicles (flashing lights, "caution oversized load")...',
 '["erfordert besondere Vorsicht und ggf. das Anhalten/Warten, bis er passiert hat","kann normal überholt werden wie jedes andere Fahrzeug","hat keine besonderen Rechte","betrifft nur die Autobahn"]'::jsonb,
 '["requires special caution and possibly stopping/waiting until it has passed","can be overtaken normally like any other vehicle","has no special standing","only applies on the motorway"]'::jsonb,
 'erfordert besondere Vorsicht und ggf. das Anhalten/Warten, bis er passiert hat',
 'requires special caution and possibly stopping/waiting until it has passed',
 NULL, NULL, 149),

('B','Sondertransporte',
 'Landwirtschaftliche Fahrzeuge (Traktoren) auf der Straße...',
 'Agricultural vehicles (tractors) on the road...',
 '["sind oft langsamer und erfordern Geduld beim Überholen an geeigneten Stellen","dürfen grundsätzlich nicht auf normalen Straßen fahren","haben immer Vorfahrt vor PKW","fahren immer mindestens 50 km/h"]'::jsonb,
 '["are often slower and require patience, overtaking only at suitable spots","are generally not allowed on regular roads","always have priority over cars","always drive at least 50 km/h"]'::jsonb,
 'sind oft langsamer und erfordern Geduld beim Überholen an geeigneten Stellen',
 'are often slower and require patience, overtaking only at suitable spots',
 NULL, NULL, 150),

-- Verkehrsinseln & gleichrangige Straßen
('B','Verkehrsinseln',
 'Eine Verkehrsinsel in der Mitte einer Kreuzung dient unter anderem dazu...',
 'A traffic island in the middle of an intersection serves, among other things, to...',
 '["Fußgängern das Überqueren in zwei Etappen zu ermöglichen und den Verkehr zu ordnen","als reines Dekorationselement","Autos das Wenden zu erleichtern","Fahrradfahrern das Parken zu ermöglichen"]'::jsonb,
 '["let pedestrians cross in two stages and help organize traffic flow","serve as a purely decorative element","make U-turns easier for cars","let cyclists park there"]'::jsonb,
 'Fußgängern das Überqueren in zwei Etappen zu ermöglichen und den Verkehr zu ordnen',
 'let pedestrians cross in two stages and help organize traffic flow',
 NULL, NULL, 151),

('B','Verkehrsinseln',
 'Treffen an einer Kreuzung zwei gleichrangige Straßen ohne jede Beschilderung aufeinander, gilt...',
 'When two equally ranked roads meet at an intersection with no signage at all, the rule is...',
 '["rechts vor links","der Größere hat Vorfahrt","wer zuerst hupt, hat Vorfahrt","freie Wahl, wer zuerst fährt"]'::jsonb,
 '["right before left","the larger vehicle has priority","whoever honks first has priority","free choice of who goes first"]'::jsonb,
 'rechts vor links','right before left',
 NULL, NULL, 152)

ON CONFLICT (license_class, order_index) DO NOTHING;
