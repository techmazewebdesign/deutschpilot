-- ============================================================
-- DeutschPilot – vocabulary starter set, 40 words (10 per level A1-B2)
-- ============================================================

INSERT INTO public.vocabulary_words (level, category, word_de, word_en, example_de, example_en, order_index) VALUES

-- A1
('A1','Alltag','die Wohnung','the apartment','Meine Wohnung ist klein aber gemütlich.','My apartment is small but cozy.',1),
('A1','Alltag','der Freund / die Freundin','the friend','Mein Freund kommt heute zu Besuch.','My friend is coming to visit today.',2),
('A1','Alltag','das Wasser','the water','Ich trinke gern Wasser.','I like to drink water.',3),
('A1','Alltag','arbeiten','to work','Ich arbeite von Montag bis Freitag.','I work Monday to Friday.',4),
('A1','Alltag','die Zeit','the time','Ich habe heute keine Zeit.','I don''t have time today.',5),
('A1','Alltag','das Geld','the money','Ich brauche mehr Geld.','I need more money.',6),
('A1','Alltag','sprechen','to speak','Ich spreche ein bisschen Deutsch.','I speak a little German.',7),
('A1','Alltag','der Tag','the day','Heute ist ein guter Tag.','Today is a good day.',8),
('A1','Alltag','essen','to eat','Wir essen um sechs Uhr.','We eat at six o''clock.',9),
('A1','Alltag','die Familie','the family','Meine Familie wohnt in Berlin.','My family lives in Berlin.',10),

-- A2
('A2','Alltag','die Erfahrung','the experience','Ich habe viel Erfahrung im Büro.','I have a lot of office experience.',1),
('A2','Alltag','sich freuen','to be happy/glad','Ich freue mich auf das Wochenende.','I''m looking forward to the weekend.',2),
('A2','Alltag','die Nachricht','the message / the news','Ich habe eine Nachricht bekommen.','I received a message.',3),
('A2','Alltag','erklären','to explain','Kannst du mir das erklären?','Can you explain that to me?',4),
('A2','Alltag','die Gelegenheit','the opportunity','Das ist eine gute Gelegenheit.','That''s a good opportunity.',5),
('A2','Alltag','sich beeilen','to hurry','Wir müssen uns beeilen!','We have to hurry!',6),
('A2','Alltag','die Verspätung','the delay','Der Zug hat 20 Minuten Verspätung.','The train is 20 minutes late.',7),
('A2','Alltag','vermissen','to miss (someone/something)','Ich vermisse meine Familie.','I miss my family.',8),
('A2','Alltag','die Entscheidung','the decision','Das war eine schwierige Entscheidung.','That was a difficult decision.',9),
('A2','Alltag','sich vorstellen','to imagine / to introduce oneself','Ich kann mir das gut vorstellen.','I can easily imagine that.',10),

-- B1
('B1','Meinung & Diskussion','die Meinung','the opinion','Meiner Meinung nach ist das richtig.','In my opinion, that is correct.',1),
('B1','Meinung & Diskussion','widersprechen','to contradict/disagree','Ich möchte dir nicht widersprechen, aber...','I don''t want to contradict you, but...',2),
('B1','Meinung & Diskussion','die Auswirkung','the effect/impact','Das hat große Auswirkungen auf die Umwelt.','This has a big impact on the environment.',3),
('B1','Meinung & Diskussion','berücksichtigen','to take into account','Wir müssen alle Faktoren berücksichtigen.','We need to take all factors into account.',4),
('B1','Meinung & Diskussion','die Verantwortung','the responsibility','Er trägt die Verantwortung für das Projekt.','He bears responsibility for the project.',5),
('B1','Meinung & Diskussion','vermeiden','to avoid','Wir sollten Konflikte vermeiden.','We should avoid conflicts.',6),
('B1','Meinung & Diskussion','die Voraussetzung','the prerequisite/condition','Deutschkenntnisse sind eine Voraussetzung.','German skills are a prerequisite.',7),
('B1','Meinung & Diskussion','sich einigen','to come to an agreement','Wir haben uns auf einen Termin geeinigt.','We agreed on a date.',8),
('B1','Meinung & Diskussion','betonen','to emphasize','Sie betonte, wie wichtig das ist.','She emphasized how important that is.',9),
('B1','Meinung & Diskussion','der Vorteil / der Nachteil','the advantage / disadvantage','Jede Lösung hat Vor- und Nachteile.','Every solution has advantages and disadvantages.',10),

-- B2
('B2','Abstrakt & Formell','die Auseinandersetzung','the debate/confrontation','Es kam zu einer heftigen Auseinandersetzung.','A heated debate broke out.',1),
('B2','Abstrakt & Formell','gewährleisten','to ensure/guarantee','Der Vertrag gewährleistet den Schutz beider Seiten.','The contract ensures protection for both sides.',2),
('B2','Abstrakt & Formell','die Voraussicht','foresight','Mit etwas Voraussicht hätte man das vermeiden können.','With some foresight, that could have been avoided.',3),
('B2','Abstrakt & Formell','sich auszeichnen','to stand out/excel','Sie zeichnet sich durch Genauigkeit aus.','She stands out for her precision.',4),
('B2','Abstrakt & Formell','die Komplexität','the complexity','Die Komplexität des Themas wird oft unterschätzt.','The complexity of the topic is often underestimated.',5),
('B2','Abstrakt & Formell','zurückführen auf','to attribute to/trace back to','Der Erfolg lässt sich auf gute Planung zurückführen.','The success can be attributed to good planning.',6),
('B2','Abstrakt & Formell','die Beeinträchtigung','the impairment/hindrance','Lärm kann eine Beeinträchtigung der Konzentration sein.','Noise can be an impairment to concentration.',7),
('B2','Abstrakt & Formell','ausschlaggebend','decisive','Das war der ausschlaggebende Faktor.','That was the decisive factor.',8),
('B2','Abstrakt & Formell','die Zurückhaltung','restraint/reticence','Er reagierte mit auffallender Zurückhaltung.','He reacted with noticeable restraint.',9),
('B2','Abstrakt & Formell','sich abzeichnen','to become apparent/take shape','Ein neuer Trend zeichnet sich ab.','A new trend is becoming apparent.',10)

ON CONFLICT (level, order_index) DO NOTHING;
