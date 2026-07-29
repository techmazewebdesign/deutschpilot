-- ============================================================
-- DeutschPilot – Driving Theory (Klasse B) batch 6, 20 more questions
-- Same rules as batches 1-5: original prep questions on well-
-- established German traffic-law topics, not verbatim official content.
-- ============================================================

INSERT INTO public.driving_theory_questions
  (license_class, category, question_de, question_en, options_de, options_en, correct_answer_de, correct_answer_en, explanation_de, explanation_en, order_index)
VALUES

-- Wildwechsel & Tiere
('B','Wildwechsel & Tiere',
 'Ein Schild mit einem springenden Reh warnt vor...',
 'A sign showing a leaping deer warns of...',
 '["Wildwechsel — Tiere können plötzlich die Straße überqueren","einem nahen Zoo","einer Jagdsaison ohne Bezug zur Straße","Kühen auf der Fahrbahn"]'::jsonb,
 '["animal crossings — animals may suddenly cross the road","a nearby zoo","a hunting season unrelated to the road","cows on the roadway"]'::jsonb,
 'Wildwechsel — Tiere können plötzlich die Straße überqueren',
 'animal crossings — animals may suddenly cross the road',
 NULL, NULL, 120),

('B','Wildwechsel & Tiere',
 'Taucht plötzlich ein Tier auf der Fahrbahn auf, solltest du...',
 'If an animal suddenly appears on the road, you should...',
 '["kontrolliert bremsen, aber ein gefährliches Ausweichmanöver vermeiden","immer scharf ausweichen, egal was dahinter ist","beschleunigen, um schneller vorbeizukommen","die Augen schließen"]'::jsonb,
 '["brake in a controlled way, but avoid a dangerous swerve","always swerve sharply, regardless of what''s beyond","accelerate to get past faster","close your eyes"]'::jsonb,
 'kontrolliert bremsen, aber ein gefährliches Ausweichmanöver vermeiden',
 'brake in a controlled way, but avoid a dangerous swerve',
 'Ein Ausweichmanöver in den Gegenverkehr oder von der Straße kann gefährlicher sein als der Zusammenstoß selbst.',
 'Swerving into oncoming traffic or off the road can be more dangerous than the collision itself.',
 121),

('B','Wildwechsel & Tiere',
 'Nach einem Unfall mit einem Wildtier solltest du...',
 'After an accident with a wild animal, you should...',
 '["die Unfallstelle sichern und die Polizei informieren","einfach weiterfahren","das Tier ohne Meldung mitnehmen","nur den Jäger, nie die Polizei rufen"]'::jsonb,
 '["secure the scene and inform the police","just drive on","take the animal without reporting it","only call a hunter, never the police"]'::jsonb,
 'die Unfallstelle sichern und die Polizei informieren',
 'secure the scene and inform the police',
 NULL, NULL, 122),

-- Halter- & Fahrerhaftung
('B','Halter- & Fahrerhaftung',
 'Der Fahrzeughalter (auch wenn er nicht selbst fährt) trägt in Deutschland...',
 'The registered vehicle owner (even if not driving) bears, in Germany...',
 '["eine eigene rechtliche Verantwortung für das Fahrzeug (Halterhaftung)","gar keine Verantwortung, nur der Fahrer haftet","Verantwortung nur bei eigenem Verschulden","Verantwortung nur bei geliehenen Fahrzeugen"]'::jsonb,
 '["their own legal responsibility for the vehicle (owner liability)","no responsibility at all — only the driver is liable","responsibility only if personally at fault","responsibility only for borrowed vehicles"]'::jsonb,
 'eine eigene rechtliche Verantwortung für das Fahrzeug (Halterhaftung)',
 'their own legal responsibility for the vehicle (owner liability)',
 NULL, NULL, 123),

('B','Halter- & Fahrerhaftung',
 'Leihst du dein Auto einer anderen Person, die einen Unfall verursacht...',
 'If you lend your car to someone who causes an accident...',
 '["kann dies auch Auswirkungen auf deine eigene Versicherung/Schadensfreiheitsklasse haben","betrifft dich in keiner Weise","ist ausschließlich Problem des Fahrers","ist rechtlich irrelevant, wenn du nicht dabei warst"]'::jsonb,
 '["it can also affect your own insurance/no-claims record","doesn''t affect you in any way","is exclusively the driver''s problem","is legally irrelevant if you weren''t present"]'::jsonb,
 'kann dies auch Auswirkungen auf deine eigene Versicherung/Schadensfreiheitsklasse haben',
 'it can also affect your own insurance/no-claims record',
 NULL, NULL, 124),

-- Sichtbehinderte Kreuzungen
('B','Sicht an Kreuzungen',
 'An einer Kreuzung mit eingeschränkter Sicht (z. B. durch parkende Autos oder Hecken) solltest du...',
 'At an intersection with limited visibility (e.g. due to parked cars or hedges), you should...',
 '["besonders langsam heranfahren und dich vortasten","normal weiterfahren, da du Vorfahrt hast","hupen statt zu bremsen","dich auf den Rückspiegel des Vordermanns verlassen"]'::jsonb,
 '["approach especially slowly and edge forward carefully","continue normally since you have the right of way","honk instead of braking","rely on the mirror of the car ahead"]'::jsonb,
 'besonders langsam heranfahren und dich vortasten',
 'approach especially slowly and edge forward carefully',
 NULL, NULL, 125),

('B','Sicht an Kreuzungen',
 'Parken in unmittelbarer Nähe von Kreuzungen (innerhalb bestimmter Mindestabstände)...',
 'Parking in the immediate vicinity of intersections (within certain minimum distances)...',
 '["ist verboten, da es die Sicht für andere Verkehrsteilnehmer versperrt","ist überall erlaubt","ist nur nachts verboten","betrifft nur LKW"]'::jsonb,
 '["is prohibited, since it blocks visibility for other road users","is allowed everywhere","is only prohibited at night","only applies to trucks"]'::jsonb,
 'ist verboten, da es die Sicht für andere Verkehrsteilnehmer versperrt',
 'is prohibited, since it blocks visibility for other road users',
 NULL, NULL, 126),

-- Saisonale Reifen
('B','Saisonale Reifen',
 'Die "situative Winterreifenpflicht" bedeutet konkret, dass bei winterlichen Bedingungen...',
 'The "situational winter tire requirement" specifically means that in wintry conditions...',
 '["Fahren ohne geeignete Winter-/Ganzjahresreifen eine Ordnungswidrigkeit sein kann","niemand fahren darf","nur LKW betroffen sind","es keine Konsequenzen gibt"]'::jsonb,
 '["driving without suitable winter/all-season tires can be an administrative offense","no one may drive at all","only trucks are affected","there are no consequences"]'::jsonb,
 'Fahren ohne geeignete Winter-/Ganzjahresreifen eine Ordnungswidrigkeit sein kann',
 'driving without suitable winter/all-season tires can be an administrative offense',
 NULL, NULL, 127),

('B','Saisonale Reifen',
 'Sommerreifen bei winterlichen Straßenverhältnissen (Schnee, Eis) bieten im Vergleich zu Winterreifen...',
 'Summer tires in wintry road conditions (snow, ice), compared to winter tires, offer...',
 '["deutlich weniger Grip und einen längeren Bremsweg","denselben Grip","mehr Grip bei Kälte","keinen relevanten Unterschied"]'::jsonb,
 '["significantly less grip and a longer braking distance","the same grip","more grip in cold conditions","no relevant difference"]'::jsonb,
 'deutlich weniger Grip und einen längeren Bremsweg',
 'significantly less grip and a longer braking distance',
 'Die Gummimischung von Sommerreifen wird bei niedrigen Temperaturen hart und verliert Haftung.',
 'Summer tire rubber compound hardens in cold temperatures and loses grip.',
 128),

-- Fahranfänger & Probezeit
('B','Fahranfänger & Probezeit',
 'Die Probezeit für neue Führerscheininhaber in Deutschland dauert in der Regel...',
 'The probationary period for new license holders in Germany typically lasts...',
 '["zwei Jahre","ein Jahr","fünf Jahre","es gibt keine Probezeit"]'::jsonb,
 '["two years","one year","five years","there is no probationary period"]'::jsonb,
 'zwei Jahre','two years',
 NULL, NULL, 129),

('B','Fahranfänger & Probezeit',
 'Ein schwerwiegender oder zwei weniger schwerwiegende Verstöße während der Probezeit können führen zu...',
 'A serious violation, or two less serious ones, during the probationary period can lead to...',
 '["einem verpflichtenden Aufbauseminar und Verlängerung der Probezeit","keiner Konsequenz, da man neu ist","einem sofortigen, dauerhaften Fahrverbot ohne Vorwarnung","einer automatischen Höherstufung des Führerscheins"]'::jsonb,
 '["a mandatory seminar and an extended probationary period","no consequence at all, since you''re new","an immediate, permanent driving ban with no warning","an automatic upgrade of the license"]'::jsonb,
 'einem verpflichtenden Aufbauseminar und Verlängerung der Probezeit',
 'a mandatory seminar and an extended probationary period',
 NULL, NULL, 130),

-- Verkehrsschilder Zusatz
('B','Verkehrsschilder vertieft',
 'Ein Zusatzzeichen unter einem Verkehrsschild (z. B. "PKW frei" oder eine Zeitangabe)...',
 'An additional sign plate below a traffic sign (e.g. "cars exempt" or a time range)...',
 '["schränkt oder erweitert die Bedeutung des Hauptschilds","hat rein dekorative Funktion","gilt nur für LKW","widerspricht immer dem Hauptschild"]'::jsonb,
 '["restricts or extends the meaning of the main sign","is purely decorative","only applies to trucks","always contradicts the main sign"]'::jsonb,
 'schränkt oder erweitert die Bedeutung des Hauptschilds',
 'restricts or extends the meaning of the main sign',
 NULL, NULL, 131),

('B','Verkehrsschilder vertieft',
 'Ein Schild mit durchgestrichenem Ortsnamen zeigt...',
 'A sign showing a place name with a diagonal line through it indicates...',
 '["das Ende des Ortsgebiets (i. d. R. Ende der 50 km/h Zone)","den Beginn des Ortsgebiets","ein Überholverbot","eine Einbahnstraße"]'::jsonb,
 '["the end of the built-up area (typically end of the 50 km/h zone)","the start of the built-up area","a no-overtaking zone","a one-way street"]'::jsonb,
 'das Ende des Ortsgebiets (i. d. R. Ende der 50 km/h Zone)',
 'the end of the built-up area (typically end of the 50 km/h zone)',
 NULL, NULL, 132),

-- Ökonomisches & sicheres Fahren
('B','Sicheres Fahren allgemein',
 'Der "Sicherheitsabstand nach hinten" (also zu einem drängelnden Fahrzeug) sollte...',
 'The "safety margin to the rear" (i.e. to a tailgating vehicle) should be handled by...',
 '["möglichst gelassen bleiben und nicht provoziert reagieren, z. B. durch abruptes Bremsen","abruptes Bremsen, um den anderen zu erschrecken","beschleunigen, um Abstand zu gewinnen, koste es was es wolle","Handzeichen aus dem Fenster"]'::jsonb,
 '["staying as calm as possible and not reacting provocatively, e.g. by braking abruptly","braking abruptly to startle the other driver","accelerating to gain distance at any cost","hand signals out the window"]'::jsonb,
 'möglichst gelassen bleiben und nicht provoziert reagieren, z. B. durch abruptes Bremsen',
 'staying as calm as possible and not reacting provocatively, e.g. by braking abruptly',
 NULL, NULL, 133),

('B','Sicheres Fahren allgemein',
 'Multitasking am Steuer (z. B. Essen, Make-up, komplexe Bedienung des Navis) während der Fahrt...',
 'Multitasking while driving (e.g. eating, applying makeup, complex navigation input)...',
 '["lenkt erheblich ab und erhöht das Unfallrisiko","hat keinen Effekt, solange man erfahren ist","ist nur bei hoher Geschwindigkeit riskant","betrifft nur Fahranfänger"]'::jsonb,
 '["significantly distracts and increases accident risk","has no effect as long as you''re an experienced driver","is only risky at high speed","only applies to new drivers"]'::jsonb,
 'lenkt erheblich ab und erhöht das Unfallrisiko',
 'significantly distracts and increases accident risk',
 NULL, NULL, 134),

('B','Sicheres Fahren allgemein',
 'Der Schulterblick vor einem Spurwechsel dient dazu...',
 'A shoulder check before changing lanes serves to...',
 '["den toten Winkel abzudecken, den Spiegel allein nicht zeigen","den Verkehrsspiegel zu ersetzen","nur bei Regen nötig zu sein","nur auf der Autobahn relevant zu sein"]'::jsonb,
 '["cover the blind spot that the mirror alone doesn''t show","replace the need for mirrors entirely","only be necessary in the rain","only be relevant on the motorway"]'::jsonb,
 'den toten Winkel abzudecken, den Spiegel allein nicht zeigen',
 'cover the blind spot that the mirror alone doesn''t show',
 NULL, NULL, 135),

('B','Sicheres Fahren allgemein',
 'Eine defensive Fahrweise bedeutet vor allem...',
 'Defensive driving mainly means...',
 '["vorausschauend fahren und Fehler anderer einkalkulieren","immer die maximal erlaubte Geschwindigkeit ausnutzen","sich nie an andere Verkehrsteilnehmer anzupassen","möglichst wenig auf den Verkehr zu achten"]'::jsonb,
 '["driving with foresight and anticipating others'' mistakes","always using the maximum allowed speed","never adapting to other road users","paying as little attention to traffic as possible"]'::jsonb,
 'vorausschauend fahren und Fehler anderer einkalkulieren',
 'driving with foresight and anticipating others'' mistakes',
 NULL, NULL, 136),

('B','Sicheres Fahren allgemein',
 'Alkoholabbau im Körper erfolgt in etwa...',
 'Alcohol is metabolized by the body at roughly...',
 '["0,1 bis 0,2 Promille pro Stunde — Kaffee oder eine kalte Dusche beschleunigen das nicht","sofort nach dem Trinken vollständig","1 Promille pro Stunde","gar nicht, bis man schläft"]'::jsonb,
 '["0.1 to 0.2 per mille per hour — coffee or a cold shower does not speed this up","fully immediately after drinking","1 per mille per hour","not at all until you sleep"]'::jsonb,
 '0,1 bis 0,2 Promille pro Stunde — Kaffee oder eine kalte Dusche beschleunigen das nicht',
 '0.1 to 0.2 per mille per hour — coffee or a cold shower does not speed this up',
 'Ein verbreiteter Irrglaube ist, dass man den Alkoholabbau beschleunigen kann — das stimmt nicht.',
 'A common myth is that you can speed up alcohol metabolism — this is not true.',
 137)

ON CONFLICT (license_class, order_index) DO NOTHING;
