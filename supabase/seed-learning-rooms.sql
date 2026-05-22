-- ============================================================
-- DeutschPilot Learning Rooms Seed
-- Idempotent: safe to run multiple times
-- ============================================================

-- --------------------------------------------------------
-- 1. RECEPTION
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'reception', 1,
    'Reception',
    'Rezeption',
    'Welcome to DeutschPilot. Complete your onboarding to start your German learning journey.',
    'Willkommen bei DeutschPilot. Erledige deine ersten Schritte, um deine Deutschlernreise zu beginnen.',
    'Set up your profile and preferences before entering the school.',
    'Richte dein Profil und deine Einstellungen ein, bevor du die Schule betrittst.',
    1
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'reception'), 'complete-profile',   'Complete profile',      'Profil vervollständigen',       'Fill in your name, current level, and learning goals.',                         'Trage deinen Namen, dein aktuelles Niveau und deine Lernziele ein.',                    1),
    ((SELECT id FROM learning_rooms WHERE slug = 'reception'), 'confirm-email',      'Confirm email',         'E-Mail bestätigen',             'Verify your email address to secure your account.',                              'Bestätige deine E-Mail-Adresse, um dein Konto zu sichern.',                             2),
    ((SELECT id FROM learning_rooms WHERE slug = 'reception'), 'choose-language',    'Choose interface language', 'Bevorzugte Sprache wählen', 'Select the language you want to use for the platform interface.',               'Wähle die Sprache, die du für die Plattform-Oberfläche verwenden möchtest.',           3)
ON CONFLICT (room_id, task_key) DO NOTHING;

-- --------------------------------------------------------
-- 2. CONSULTATION
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'consultation', 2,
    'Consultation',
    'Beratungsraum',
    'Meet with our learning advisor to define your personal learning path.',
    'Triff dich mit unserem Lernberater, um deinen persönlichen Lernpfad zu definieren.',
    'Identify your goals, current level, and weekly commitment.',
    'Identifiziere deine Ziele, dein aktuelles Niveau und deinen wöchentlichen Zeitplan.',
    2
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'consultation'), 'select-goal',       'Select learning goal',     'Lernziel wählen',             'Choose what you want to achieve with your German studies.',                  'Wähle, was du mit deinem Deutschlernen erreichen möchtest.',              1),
    ((SELECT id FROM learning_rooms WHERE slug = 'consultation'), 'select-level',      'Select current level',     'Aktuelles Niveau wählen',     'Indicate your current German proficiency level.',                             'Gib dein aktuelles Deutschkenntnisniveau an.',                             2),
    ((SELECT id FROM learning_rooms WHERE slug = 'consultation'), 'select-time',       'Select weekly learning time', 'Wöchentliche Lernzeit wählen', 'Decide how many hours per week you can dedicate to learning.',               'Entscheide, wie viele Stunden pro Woche du dem Lernen widmen kannst.',     3)
ON CONFLICT (room_id, task_key) DO NOTHING;

-- --------------------------------------------------------
-- 3. PLACEMENT TEST
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'placement-test', 3,
    'Placement Test',
    'Einstufungstest',
    'Take a quick assessment to determine your current German level.',
    'Mache eine kurze Bewertung, um dein aktuelles Deutschniveau zu ermitteln.',
    'Get an accurate picture of your strengths and weaknesses in German.',
    'Erhalte ein genaues Bild deiner Stärken und Schwächen im Deutschen.',
    3
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'placement-test'), 'start-test',        'Start placement test',      'Einstufungstest starten',    'Begin the placement test when you are ready.',                               'Beginne den Einstufungstest, wenn du bereit bist.',                         1),
    ((SELECT id FROM learning_rooms WHERE slug = 'placement-test'), 'complete-test',     'Complete placement test',   'Einstufungstest abschließen', 'Answer all questions to the best of your ability.',                         'Beantworte alle Fragen so gut du kannst.',                                   2),
    ((SELECT id FROM learning_rooms WHERE slug = 'placement-test'), 'save-result',       'Save result',               'Ergebnis speichern',         'Review and confirm your test result.',                                       'Überprüfe und bestätige dein Testergebnis.',                                 3)
ON CONFLICT (room_id, task_key) DO NOTHING;

-- --------------------------------------------------------
-- 4. COURSE SELECTION
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'course-selection', 4,
    'Course Selection',
    'Kursauswahl',
    'Browse and select the course that matches your level and goals.',
    'Stöbere und wähle den Kurs aus, der zu deinem Niveau und deinen Zielen passt.',
    'Find the perfect course to start your structured German learning.',
    'Finde den perfekten Kurs, um dein strukturiertes Deutschlernen zu beginnen.',
    4
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'course-selection'), 'view-recommended',  'View recommended course',   'Empfohlenen Kurs ansehen',   'See the course we recommend based on your placement test.',                  'Sieh dir den Kurs an, den wir dir basierend auf deinem Einstufungstest empfehlen.', 1),
    ((SELECT id FROM learning_rooms WHERE slug = 'course-selection'), 'choose-course',     'Choose course',             'Kurs auswählen',             'Select the course you want to enroll in.',                                  'Wähle den Kurs aus, in den du eintreten möchtest.',                         2),
    ((SELECT id FROM learning_rooms WHERE slug = 'course-selection'), 'start-course',      'Start course',              'Kurs beginnen',              'Begin your first lesson in the selected course.',                           'Beginne deine erste Lektion im ausgewählten Kurs.',                          3)
ON CONFLICT (room_id, task_key) DO NOTHING;

-- --------------------------------------------------------
-- 5. CLASSROOM
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'classroom', 5,
    'Classroom',
    'Klassenzimmer',
    'Enter the classroom to study structured lessons with clear explanations.',
    'Betritt das Klassenzimmer, um strukturierte Lektionen mit klaren Erklärungen zu lernen.',
    'Learn German grammar, vocabulary, and conversation step by step.',
    'Lerne Schritt für Schritt deutsche Grammatik, Wortschatz und Konversation.',
    5
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'classroom'), 'open-first-lesson', 'Open first lesson',         'Erste Lektion öffnen',       'Access your first lesson in the course.',                                     'Greife auf deine erste Lektion im Kurs zu.',                                 1),
    ((SELECT id FROM learning_rooms WHERE slug = 'classroom'), 'read-content',      'Read lesson content',       'Lektionsinhalt lesen',       'Study the lesson material carefully.',                                        'Arbeite das Lektionsmaterial sorgfältig durch.',                             2),
    ((SELECT id FROM learning_rooms WHERE slug = 'classroom'), 'mark-completed',    'Mark lesson completed',     'Lektion als abgeschlossen markieren', 'Confirm that you have finished the lesson.',                        'Bestätige, dass du die Lektion abgeschlossen hast.',                         3)
ON CONFLICT (room_id, task_key) DO NOTHING;

-- --------------------------------------------------------
-- 6. EXERCISE ROOM
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'exercises', 6,
    'Exercise Room',
    'Übungsraum',
    'Practice what you learned with targeted exercises and quizzes.',
    'Übe das Gelernte mit gezielten Übungen und Quizfragen.',
    'Reinforce your knowledge through interactive practice.',
    'Festige dein Wissen durch interaktives Üben.',
    6
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'exercises'), 'complete-quiz',           'Complete quiz',                'Quiz abschließen',                'Test your understanding with a short quiz.',                        'Teste dein Verständnis mit einem kurzen Quiz.',                              1),
    ((SELECT id FROM learning_rooms WHERE slug = 'exercises'), 'complete-vocabulary',     'Complete vocabulary exercise', 'Wortschatz-Übung abschließen',    'Practice new words and phrases.',                                    'Übe neue Wörter und Redewendungen.',                                         2),
    ((SELECT id FROM learning_rooms WHERE slug = 'exercises'), 'save-score',              'Save score',                   'Punktestand speichern',           'Record your exercise results.',                                    'Speichere deine Übungsergebnisse.',                                          3)
ON CONFLICT (room_id, task_key) DO NOTHING;

-- --------------------------------------------------------
-- 7. SPEAKING ROOM
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'speaking', 7,
    'Speaking Room',
    'Sprechraum',
    'Practice speaking German in guided conversation scenarios.',
    'Übe das Sprechen von Deutsch in geführten Gesprächsszenarien.',
    'Build confidence in spoken German through structured practice.',
    'Baue Vertrauen im mündlichen Deutsch durch strukturiertes Üben auf.',
    7
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'speaking'), 'practice-introduction',   'Practice introduction',        'Vorstellung üben',               'Learn to introduce yourself confidently in German.',                'Lerne dich selbstbewusst auf Deutsch vorzustellen.',                         1),
    ((SELECT id FROM learning_rooms WHERE slug = 'speaking'), 'practice-conversation',     'Practice daily conversation',  'Alltagsgespräch üben',           'Practice common everyday conversations.',                             'Übe häufige Alltagsgespräche.',                                              2),
    ((SELECT id FROM learning_rooms WHERE slug = 'speaking'), 'save-speaking-status',    'Save speaking practice status', 'Sprechübungsstatus speichern',   'Record your speaking practice progress.',                             'Speichere deinen Fortschritt bei den Sprechübungen.',                        3)
ON CONFLICT (room_id, task_key) DO NOTHING;

-- --------------------------------------------------------
-- 8. WRITING ROOM
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'writing', 8,
    'Writing Room',
    'Schreibraum',
    'Develop your German writing skills with guided exercises.',
    'Entwickle deine Deutsch-Schreibfähigkeiten mit geführten Übungen.',
    'Learn to write clear, correct German texts step by step.',
    'Lerne Schritt für Schritt klare und korrekte deutsche Texte zu schreiben.',
    8
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'writing'), 'write-short-text',        'Write short text',             'Kurzen Text schreiben',          'Compose a short paragraph or email in German.',                     'Verfasse einen kurzen Absatz oder eine E-Mail auf Deutsch.',                 1),
    ((SELECT id FROM learning_rooms WHERE slug = 'writing'), 'submit-writing',          'Submit writing',               'Schreibung einreichen',          'Send in your writing for review.',                                  'Reiche deine Schreibung zur Überprüfung ein.',                               2),
    ((SELECT id FROM learning_rooms WHERE slug = 'writing'), 'save-writing-status',     'Save writing practice status', 'Schreibübungsstatus speichern',  'Record your writing practice progress.',                            'Speichere deinen Fortschritt bei den Schreibübungen.',                       3)
ON CONFLICT (room_id, task_key) DO NOTHING;

-- --------------------------------------------------------
-- 9. SELF-LEARNING CENTER
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'self-learning', 9,
    'Self-Learning Center',
    'Selbstlernzentrum',
    'Access vocabulary lists, grammar summaries, and reference materials.',
    'Greife auf Wortschatzlisten, Grammatikzusammenfassungen und Nachschlagematerial zu.',
    'Study independently with curated learning materials.',
    'Lerne selbstständig mit kuratierten Lernmaterialien.',
    9
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'self-learning'), 'open-vocabulary',     'Open vocabulary list',         'Wortschatzliste öffnen',         'Review key vocabulary for your level.',                               'Überarbeite den wichtigen Wortschatz für dein Niveau.',                      1),
    ((SELECT id FROM learning_rooms WHERE slug = 'self-learning'), 'open-grammar',        'Open grammar summary',         'Grammatikzusammenfassung öffnen', 'Consult grammar rules and explanations.',                            'Konsultiere Grammatikregeln und Erklärungen.',                               2),
    ((SELECT id FROM learning_rooms WHERE slug = 'self-learning'), 'save-material-status', 'Save material as completed',  'Material als abgeschlossen markieren', 'Confirm you have reviewed the materials.',                       'Bestätige, dass du die Materialien durchgearbeitet hast.',                   3)
ON CONFLICT (room_id, task_key) DO NOTHING;

-- --------------------------------------------------------
-- 10. COMMUNITY LOUNGE
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'community-lounge', 10,
    'Community Lounge',
    'Community-Lounge',
    'Connect with fellow learners in the DeutschPilot community.',
    'Verbinde dich mit anderen Lernenden in der DeutschPilot-Community.',
    'Share experiences, ask questions, and learn together.',
    'Teile Erfahrungen, stelle Fragen und lerne gemeinsam.',
    10
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'community-lounge'), 'read-rules',        'Read community rules',         'Community-Regeln lesen',         'Understand the guidelines for respectful interaction.',               'Verstehe die Richtlinien für respektvolles Miteinander.',                    1),
    ((SELECT id FROM learning_rooms WHERE slug = 'community-lounge'), 'join-placeholder',  'Join community placeholder',   'Community-Beitritt (Platzhalter)', 'Indicate your interest in joining the community.',                   'Zeige dein Interesse am Community-Beitritt an.',                             2),
    ((SELECT id FROM learning_rooms WHERE slug = 'community-lounge'), 'save-status',       'Save status',                  'Status speichern',               'Record your community participation status.',                         'Speichere deinen Community-Teilnahmestatus.',                                 3)
ON CONFLICT (room_id, task_key) DO NOTHING;

-- --------------------------------------------------------
-- 11. TEACHER FEEDBACK
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'teacher-feedback', 11,
    'Teacher Feedback Room',
    'Lehrer-Feedback',
    'Receive personalized feedback from your teacher on your progress.',
    'Erhalte personalisiertes Feedback von deinem Lehrer zu deinem Fortschritt.',
    'Get expert guidance to overcome your specific challenges.',
    'Erhalte Experten-Rat, um deine spezifischen Herausforderungen zu meistern.',
    11
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'teacher-feedback'), 'view-feedback',     'View feedback placeholder',    'Feedback ansehen (Platzhalter)', 'Check for any teacher feedback on your work.',                        'Prüfe, ob es Feedback von deinem Lehrer zu deiner Arbeit gibt.',             1),
    ((SELECT id FROM learning_rooms WHERE slug = 'teacher-feedback'), 'request-feedback',  'Request feedback placeholder', 'Feedback anfordern (Platzhalter)', 'Ask your teacher for feedback on a specific topic.',                  'Bitte deinen Lehrer um Feedback zu einem bestimmten Thema.',                 2),
    ((SELECT id FROM learning_rooms WHERE slug = 'teacher-feedback'), 'save-status',       'Save status',                  'Status speichern',               'Record your feedback request status.',                                'Speichere den Status deiner Feedback-Anfrage.',                              3)
ON CONFLICT (room_id, task_key) DO NOTHING;

-- --------------------------------------------------------
-- 12. SUPPORT
-- --------------------------------------------------------
INSERT INTO learning_rooms (slug, room_number, title_en, title_de, description_en, description_de, purpose_en, purpose_de, unlock_order)
VALUES (
    'support', 12,
    'Support Room',
    'Support',
    'Find help and contact support whenever you need assistance.',
    'Finde Hilfe und kontaktiere den Support, wann immer du Unterstützung brauchst.',
    'Get answers to technical and learning questions.',
    'Erhalte Antworten auf technische und lernbezogene Fragen.',
    12
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO room_tasks (room_id, task_key, title_en, title_de, description_en, description_de, order_index)
VALUES
    ((SELECT id FROM learning_rooms WHERE slug = 'support'), 'open-support-info',   'Open support information',     'Support-Informationen öffnen',   'Browse the support center and FAQs.',                                 'Stöbere im Support-Center und in den FAQs.',                                 1),
    ((SELECT id FROM learning_rooms WHERE slug = 'support'), 'contact-support',     'Contact support',              'Support kontaktieren',           'Reach out to our support team for personalized help.',              'Wende dich an unser Support-Team für personalisierte Hilfe.',                2),
    ((SELECT id FROM learning_rooms WHERE slug = 'support'), 'save-status',         'Save status',                  'Status speichern',               'Record that you have reviewed support options.',                      'Speichere, dass du die Support-Optionen überprüft hast.',                  3)
ON CONFLICT (room_id, task_key) DO NOTHING;
