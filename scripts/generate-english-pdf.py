#!/usr/bin/env python3
"""Generate English course PDF (A1-C1) in the style of Anastasia Rychagova."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# ── Fonts ──────────────────────────────────────────────────────────────────
BASE = "/usr/share/fonts/truetype/liberation/"
pdfmetrics.registerFont(TTFont("Sans",       BASE + "LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Bold",  BASE + "LiberationSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Italic",BASE + "LiberationSans-Italic.ttf"))
pdfmetrics.registerFont(TTFont("Mono",       BASE + "LiberationMono-Regular.ttf"))

# ── Colors ─────────────────────────────────────────────────────────────────
BG_DARK   = colors.HexColor("#0a0f14")
BRAND     = colors.HexColor("#14b8a6")
BRAND_LT  = colors.HexColor("#99f6e4")
MUTED     = colors.HexColor("#8b9cb3")
WHITE     = colors.white
CARD_BG   = colors.HexColor("#121a24")

LEVEL_COLORS = {
    "A1": colors.HexColor("#10b981"),
    "A2": colors.HexColor("#0891b2"),
    "B1": colors.HexColor("#3b82f6"),
    "B2": colors.HexColor("#8b5cf6"),
    "C1": colors.HexColor("#f59e0b"),
}

# ── Styles ─────────────────────────────────────────────────────────────────
def s(name, **kw):
    defaults = dict(fontName="Sans", fontSize=10, leading=14,
                    textColor=colors.HexColor("#e8eef4"), spaceAfter=4)
    defaults.update(kw)
    return ParagraphStyle(name, **defaults)

ST = {
    "cover_title":   s("ct",  fontName="Sans-Bold", fontSize=36, leading=42,
                        textColor=WHITE, alignment=TA_CENTER, spaceAfter=12),
    "cover_sub":     s("cs",  fontName="Sans",      fontSize=16, leading=22,
                        textColor=BRAND_LT, alignment=TA_CENTER, spaceAfter=8),
    "cover_note":    s("cn",  fontName="Sans",      fontSize=11,
                        textColor=MUTED, alignment=TA_CENTER, spaceAfter=4),
    "level_title":   s("lt",  fontName="Sans-Bold", fontSize=26, leading=32,
                        textColor=WHITE, spaceAfter=6),
    "level_desc":    s("ld",  fontName="Sans-Italic", fontSize=12,
                        textColor=MUTED, spaceAfter=20),
    "lesson_title":  s("lst", fontName="Sans-Bold", fontSize=17, leading=22,
                        textColor=WHITE, spaceAfter=4),
    "lesson_sub":    s("lss", fontName="Sans-Italic", fontSize=11,
                        textColor=MUTED, spaceAfter=14),
    "section_label": s("sl",  fontName="Sans-Bold", fontSize=9,
                        textColor=MUTED, spaceBefore=14, spaceAfter=6),
    "grammar_title": s("gt",  fontName="Sans-Bold", fontSize=13,
                        textColor=BRAND_LT, spaceAfter=6),
    "body":          s("bd",  fontName="Sans",      fontSize=10, leading=16,
                        textColor=colors.HexColor("#c8d8e8"), spaceAfter=4),
    "struct":        s("st",  fontName="Mono",      fontSize=10, leading=15,
                        textColor=BRAND, spaceAfter=4),
    "ex_en":         s("een", fontName="Sans-Bold", fontSize=10, leading=14,
                        textColor=WHITE, spaceAfter=1),
    "ex_ru":         s("eru", fontName="Sans-Italic", fontSize=9, leading=13,
                        textColor=MUTED, spaceAfter=6),
    "vocab_word":    s("vw",  fontName="Sans-Bold", fontSize=11,
                        textColor=WHITE, spaceAfter=0),
    "vocab_trans":   s("vt",  fontName="Sans",      fontSize=9,
                        textColor=MUTED, spaceAfter=1),
    "vocab_ex":      s("ve",  fontName="Sans-Italic", fontSize=9,
                        textColor=colors.HexColor("#7a9ab0"), spaceAfter=8),
    "q_text":        s("qt",  fontName="Sans-Bold", fontSize=10, leading=14,
                        textColor=WHITE, spaceAfter=4),
    "q_sentence":    s("qs",  fontName="Sans",      fontSize=11, leading=16,
                        textColor=BRAND_LT, spaceAfter=4),
    "q_option":      s("qo",  fontName="Sans",      fontSize=10, leading=14,
                        textColor=colors.HexColor("#c8d8e8"), spaceAfter=2),
    "q_answer":      s("qa",  fontName="Sans-Bold", fontSize=10,
                        textColor=colors.HexColor("#6ee7b7"), spaceAfter=2),
    "q_explain":     s("qe",  fontName="Sans-Italic", fontSize=9, leading=13,
                        textColor=MUTED, spaceAfter=10),
    "page_num":      s("pn",  fontName="Sans",      fontSize=9,
                        textColor=MUTED, alignment=TA_CENTER),
}

# ── Course data ─────────────────────────────────────────────────────────────
COURSE = [
  {
    "id": "A1", "label": "Beginner",
    "desc": "Первые шаги: глагол to be, знакомства, числа, семья и цвета",
    "lessons": [
      {
        "icon": "📚", "title": "Verb To Be", "titleRu": "Глагол «to be»",
        "duration": 15,
        "grammar": {
          "title": "Глагол «to be» — am / is / are",
          "explanation": "Глагол «to be» — основа английского языка, означает «быть / являться». "
                         "В отличие от русского, его нельзя пропускать!",
          "structure": "I → am  |  He / She / It → is  |  You / We / They → are",
          "examples": [
            ("I am a student.", "Я студент."),
            ("She is happy.", "Она счастлива."),
            ("They are friends.", "Они друзья."),
            ("It is cold today.", "Сегодня холодно."),
            ("We are from Russia.", "Мы из России."),
          ],
        },
        "vocabulary": [
          ("student",  "[ˈstjuːdənt]", "студент",    "I am a student."),
          ("teacher",  "[ˈtiːtʃər]",   "учитель",    "She is a teacher."),
          ("happy",    "[ˈhæpi]",       "счастливый", "He is happy."),
          ("tired",    "[ˈtaɪərd]",     "усталый",    "I am tired."),
          ("hungry",   "[ˈhʌŋɡri]",    "голодный",   "They are hungry."),
        ],
        "exercises": [
          ("I ___ a student.",      ["am","is","are","be"],   "am",   "С «I» используется «am»."),
          ("She ___ a teacher.",    ["am","is","are","be"],   "is",   "He/She/It → is."),
          ("They ___ from Moscow.", ["are","is","am","be"],   "are",  "We/They → are."),
          ("We is friends.",        ["Правильно","Неправильно"],"Неправильно","We ARE friends."),
          ("«Он устал»",            ["He am tired.","He is tired.","He are tired."],"He is tired.","He → is."),
        ],
      },
      {
        "icon": "👋", "title": "Introductions", "titleRu": "Знакомства",
        "duration": 15,
        "grammar": {
          "title": "Как познакомиться по-английски",
          "explanation": "Фразы для знакомства — первое, что нужно выучить. "
                         "Используй «My name is...» и «I'm from...» для представления себя.",
          "structure": "My name is [имя]. / I'm [имя].  |  I'm from [место].  |  Nice to meet you!",
          "examples": [
            ("My name is Anna.", "Меня зовут Анна."),
            ("I'm from Moscow.", "Я из Москвы."),
            ("I'm 20 years old.", "Мне 20 лет."),
            ("Nice to meet you!", "Приятно познакомиться!"),
            ("What's your name?", "Как тебя зовут?"),
          ],
        },
        "vocabulary": [
          ("name",    "[neɪm]",      "имя",                  "My name is Alex."),
          ("age",     "[eɪdʒ]",      "возраст",              "What is your age?"),
          ("city",    "[ˈsɪti]",     "город",                "I live in this city."),
          ("country", "[ˈkʌntri]",   "страна",               "Russia is a big country."),
          ("meet",    "[miːt]",       "встречать/знакомиться","Nice to meet you!"),
        ],
        "exercises": [
          ("Как спросить «Как тебя зовут?»",
           ["What's your name?","Where are you from?","How old are you?"],
           "What's your name?", "Стандартный вопрос об имени."),
          ("My name ___ Anna.", ["is","am","are"], "is", "name → третье лицо → is."),
          ("«Я из Лондона»",
           ["I am from London.","I is from London.","My from London."],
           "I am from London.", "I + am + from + место."),
          ("«Приятно познакомиться»",
           ["Nice to meet you!","Hello, friend!","Good morning!"],
           "Nice to meet you!", "Стандартная фраза при знакомстве."),
          ("I am 25 years old.",["Правильно","Неправильно"],"Правильно",
           "I am + возраст + years old — правильно!"),
        ],
      },
      {
        "icon": "🕐", "title": "Numbers & Time", "titleRu": "Числа и время",
        "duration": 20,
        "grammar": {
          "title": "Числа и время по-английски",
          "explanation": "Для чтения времени: «It's [час] o'clock» для полных часов, "
                         "«half past» для получаса, «quarter to/past» для четверти.",
          "structure": "What time is it?  |  It's [hour] o'clock  |  It's half past [hour]  |  It's quarter to/past [hour]",
          "examples": [
            ("It's three o'clock.", "Сейчас три часа."),
            ("It's half past five.", "Сейчас половина шестого."),
            ("It's quarter to eight.", "Сейчас без четверти восемь."),
            ("It's ten past two.", "Сейчас десять минут третьего."),
            ("What time is it?", "Который час?"),
          ],
        },
        "vocabulary": [
          ("one",     "[wʌn]",        "один",      "I have one book."),
          ("ten",     "[ten]",        "десять",    "Ten minutes."),
          ("twenty",  "[ˈtwenti]",    "двадцать",  "Twenty dollars."),
          ("half",    "[hɑːf]",       "половина",  "Half past six."),
          ("quarter", "[ˈkwɔːrtər]",  "четверть",  "Quarter past three."),
        ],
        "exercises": [
          ("«Сейчас три часа»",
           ["It's three o'clock.","It's three hour.","It are three o'clock."],
           "It's three o'clock.", "It's [число] o'clock."),
          ("«half past five» =",
           ["Половина шестого","Пять часов","Четверть шестого"],
           "Половина шестого", "5:30 = половина шестого."),
          ("___ time is it?", ["What","When","Where"], "What", "What time is it?"),
          ("«quarter to eight» =",
           ["7:45","8:15","8:45"], "7:45", "Без четверти восемь = 7:45."),
          ("15 по-английски",
           ["fifteen","fifty","fiveteen"], "fifteen", "15 = fifteen."),
        ],
      },
      {
        "icon": "👨‍👩‍👧‍👦", "title": "My Family", "titleRu": "Моя семья",
        "duration": 15,
        "grammar": {
          "title": "Притяжательные местоимения",
          "explanation": "В английском для обозначения принадлежности используются притяжательные "
                         "местоимения. Они стоят перед существительным и не изменяются по родам.",
          "structure": "I→my  |  You→your  |  He→his  |  She→her  |  We→our  |  They→their",
          "examples": [
            ("This is my mother.", "Это моя мама."),
            ("His brother is 10 years old.", "Его брату 10 лет."),
            ("Her sister lives in London.", "Её сестра живёт в Лондоне."),
            ("Our family is big.", "Наша семья большая."),
            ("Their grandmother is kind.", "Их бабушка добрая."),
          ],
        },
        "vocabulary": [
          ("mother",      "[ˈmʌðər]",     "мама",     "My mother is 45."),
          ("father",      "[ˈfɑːðər]",    "папа",     "His father is a doctor."),
          ("sister",      "[ˈsɪstər]",    "сестра",   "I have one sister."),
          ("brother",     "[ˈbrʌðər]",    "брат",     "Her brother is tall."),
          ("grandmother", "[ˈɡrænmʌðər]", "бабушка",  "Our grandmother cooks well."),
        ],
        "exercises": [
          ("___ sister is beautiful. (она)",
           ["Her","His","My","Their"], "Her", "She → her."),
          ("I love ___ family.",["my","me","I"], "my", "I → my."),
          ("«Его папа — врач»",
           ["His father is a doctor.","Her father is a doctor.","My father is a doctor."],
           "His father is a doctor.", "He → his."),
          ("Our family are very big.",["Правильно","Неправильно"],"Неправильно",
           "Family — ед.ч.: Our family IS very big."),
          ("«her grandmother» =",
           ["её бабушка","его бабушка","моя бабушка"],
           "её бабушка", "her = её."),
        ],
      },
      {
        "icon": "🎨", "title": "Colors & Objects", "titleRu": "Цвета и предметы",
        "duration": 15,
        "grammar": {
          "title": "This / That / These / Those",
          "explanation": "This — этот/эта (рядом, ед.ч.), That — тот/та (далеко), "
                         "These — эти (рядом, мн.ч.), Those — те (далеко, мн.ч.).",
          "structure": "This is [предмет].  |  That is [предмет].  |  These are [предметы].  |  Those are [предметы].",
          "examples": [
            ("This is a red pen.", "Это красная ручка."),
            ("That is a blue book.", "То — синяя книга."),
            ("These are white chairs.", "Это белые стулья."),
            ("Those are black cars.", "Те — чёрные машины."),
            ("What color is this?", "Какого цвета это?"),
          ],
        },
        "vocabulary": [
          ("red",    "[red]",      "красный",         "This is a red apple."),
          ("blue",   "[bluː]",     "синий / голубой", "The sky is blue."),
          ("green",  "[ɡriːn]",   "зелёный",         "The grass is green."),
          ("black",  "[blæk]",    "чёрный",           "I have a black bag."),
          ("yellow", "[ˈjeloʊ]",  "жёлтый",           "Bananas are yellow."),
        ],
        "exercises": [
          ("«This is» =",
           ["Это (близко, ед.ч.)","Те (далеко, мн.ч.)","Эти (близко, мн.ч.)"],
           "Это (близко, ед.ч.)", "This is = один предмет рядом."),
          ("___ are blue pens. (эти, рядом)",
           ["These","Those","This","That"], "These", "These = эти (близко, мн.ч.)."),
          ("«Небо синее»",
           ["The sky is blue.","Sky blue is.","The sky is green."],
           "The sky is blue.", "Правильный порядок слов."),
          ("«Это жёлтый банан»",
           ["This is a yellow banana.","This is yellow a banana.","These is a yellow banana."],
           "This is a yellow banana.", "This is + a + прил. + сущ."),
          ("Those is black cats.",["Правильно","Неправильно"],"Неправильно",
           "Those ARE black cats."),
        ],
      },
    ],
  },
  {
    "id": "A2", "label": "Elementary",
    "desc": "Настоящее и прошедшее время, еда, путешествия, повседневная жизнь",
    "lessons": [
      {
        "icon": "☀️", "title": "Present Simple", "titleRu": "Простое настоящее",
        "duration": 20,
        "grammar": {
          "title": "Present Simple — постоянные факты и привычки",
          "explanation": "Используется для постоянных фактов, привычных действий и расписания. "
                         "В 3-м лице ед.ч. (he/she/it) к глаголу добавляется -s или -es.",
          "structure": "I/You/We/They + verb  |  He/She/It + verb+s  |  DON'T / DOESN'T + verb",
          "examples": [
            ("I work every day.", "Я работаю каждый день."),
            ("She works in a hospital.", "Она работает в больнице."),
            ("They don't like coffee.", "Они не любят кофе."),
            ("He doesn't play football.", "Он не играет в футбол."),
            ("Do you speak English?", "Ты говоришь по-английски?"),
          ],
        },
        "vocabulary": [
          ("work",  "[wɜːrk]",   "работать",         "I work from home."),
          ("study", "[ˈstʌdi]",  "учиться/изучать",  "She studies English."),
          ("live",  "[lɪv]",     "жить",             "We live in Moscow."),
          ("like",  "[laɪk]",    "любить/нравиться", "I like music."),
          ("speak", "[spiːk]",   "говорить",         "He speaks three languages."),
        ],
        "exercises": [
          ("She ___ English every day.",
           ["study","studies","studying","studied"],"studies","She→studies (y→ies)."),
          ("They ___ coffee. (отрицание)",
           ["don't like","doesn't like","didn't like"],"don't like","They → don't."),
          ("«Ты живёшь в Москве?»",
           ["Do you live in Moscow?","Does you live?","Are you live?"],
           "Do you live in Moscow?","Do + you + infinitive."),
          ("He don't work on Sundays.",
           ["Правильно","Неправильно"],"Неправильно","He DOESN'T work."),
          ("«Они живут в Лондоне»",
           ["They live in London.","They lives in London.","They living in London."],
           "They live in London.","They + live (без -s)."),
        ],
      },
      {
        "icon": "⏳", "title": "Present Continuous", "titleRu": "Настоящее продолжённое",
        "duration": 20,
        "grammar": {
          "title": "Present Continuous — что происходит прямо сейчас",
          "explanation": "Описывает действие, которое происходит в данный момент. "
                         "Образуется: am/is/are + глагол с окончанием -ing.",
          "structure": "I am + verb-ing  |  He/She/It is + verb-ing  |  We/You/They are + verb-ing",
          "examples": [
            ("I am reading a book.", "Я читаю книгу (сейчас)."),
            ("She is cooking dinner.", "Она готовит ужин (сейчас)."),
            ("They are watching TV.", "Они смотрят телевизор (сейчас)."),
            ("He isn't sleeping.", "Он не спит (сейчас)."),
            ("Are you listening?", "Ты слушаешь?"),
          ],
        },
        "vocabulary": [
          ("read",   "[riːd]",    "читать",             "I am reading now."),
          ("watch",  "[wɒtʃ]",   "смотреть",           "She is watching a film."),
          ("cook",   "[kʊk]",    "готовить (еду)",      "He is cooking."),
          ("run",    "[rʌn]",    "бегать/бежать",       "They are running."),
          ("listen", "[ˈlɪsən]", "слушать",            "I am listening to music."),
        ],
        "exercises": [
          ("She ___ dinner now.",
           ["is cooking","cooks","are cooking"],"is cooking","She → is + cooking."),
          ("We ___ a film right now.",
           ["are watching","is watching","watch"],"are watching","We → are + watching."),
          ("«Он не бегает сейчас»",
           ["He isn't running.","He doesn't running.","He not running."],
           "He isn't running.","He is → He isn't."),
          ("«Они слушают музыку»",
           ["They are listening to music.","They is listening.","They listen music now."],
           "They are listening to music.","They + are + listening + to."),
          ("I am reading book right now.",
           ["Правильно","Неправильно"],"Неправильно","Нужен артикль: a book."),
        ],
      },
      {
        "icon": "⏪", "title": "Past Simple", "titleRu": "Простое прошедшее",
        "duration": 25,
        "grammar": {
          "title": "Past Simple — действия в прошлом",
          "explanation": "Описывает завершённые действия в прошлом. Правильные глаголы: + ed. "
                         "Неправильные имеют особые формы: go→went, see→saw, buy→bought.",
          "structure": "verb + -ed (правильные)  |  особая форма (неправильные)  |  DIDN'T + verb",
          "examples": [
            ("I worked yesterday.", "Вчера я работал."),
            ("She went to the cinema.", "Она ходила в кино."),
            ("They didn't come to the party.", "Они не пришли на вечеринку."),
            ("Did you see that film?", "Ты видел этот фильм?"),
            ("He bought a new car.", "Он купил новую машину."),
          ],
        },
        "vocabulary": [
          ("went",   "[went]",  "ходил/поехал (go→went)",   "She went to school."),
          ("saw",    "[sɔː]",   "видел (see→saw)",          "I saw a great film."),
          ("bought", "[bɔːt]",  "купил (buy→bought)",       "He bought flowers."),
          ("had",    "[hæd]",   "имел/был (have→had)",      "We had a good time."),
          ("said",   "[sed]",   "сказал (say→said)",        "She said hello."),
        ],
        "exercises": [
          ("Past Simple от «go»:",
           ["went","goed","goes"],"went","go — неправильный глагол. Past: went."),
          ("She ___ to school yesterday. (отрицание)",
           ["didn't go","didn't went","doesn't go"],"didn't go","didn't + infinitive."),
          ("«Ты видел этот фильм?»",
           ["Did you see this film?","Do you see?","Did you saw?"],
           "Did you see this film?","Did + subject + infinitive."),
          ("Past Simple от «buy»:",
           ["bought","buyed","buys"],"bought","buy — неправильный. Past: bought."),
          ("They didn't went to the party.",
           ["Правильно","Неправильно"],"Неправильно","didn't GO (не went)."),
        ],
      },
      {
        "icon": "🍽️", "title": "Food & Restaurants", "titleRu": "Еда и рестораны",
        "duration": 20,
        "grammar": {
          "title": "Заказ в ресторане: Would you like...?",
          "explanation": "«Would like» — вежливый способ предлагать или заказывать. "
                         "Would you like...? = «Не хотели бы вы...?»",
          "structure": "Would you like [noun]?  |  I would like [noun].  |  I'll have [noun].",
          "examples": [
            ("Would you like some coffee?", "Не хотите кофе?"),
            ("I would like a table for two.", "Я бы хотел столик на двоих."),
            ("I'll have the pasta, please.", "Мне пасту, пожалуйста."),
            ("Could I have the menu?", "Можно мне меню?"),
            ("The bill, please.", "Счёт, пожалуйста."),
          ],
        },
        "vocabulary": [
          ("menu",      "[ˈmenjuː]",  "меню",     "Could I see the menu?"),
          ("order",     "[ˈɔːrdər]",  "заказ",    "Are you ready to order?"),
          ("bill",      "[bɪl]",      "счёт",     "The bill, please."),
          ("waiter",    "[ˈweɪtər]",  "официант", "The waiter brought food."),
          ("delicious", "[dɪˈlɪʃəs]","вкусный",  "This pizza is delicious!"),
        ],
        "exercises": [
          ("Как вежливо предложить кофе?",
           ["Would you like some coffee?","Do you want coffee?","Coffee or not?"],
           "Would you like some coffee?","Would you like — вежливое предложение."),
          ("I ___ like the pasta, please.",
           ["would","will","should"],"would","I would like = я бы хотел."),
          ("Как попросить счёт?",
           ["The bill, please.","The money, please.","I want pay."],
           "The bill, please.","The bill = счёт."),
          ("«Это очень вкусно»",
           ["This is delicious!","This delicious!","This is taste!"],
           "This is delicious!","Delicious = вкусный."),
          ("I'll have the soup.",
           ["Правильно","Неправильно"],"Правильно","I'll have — разговорный заказ."),
        ],
      },
      {
        "icon": "✈️", "title": "Travel & Transport", "titleRu": "Путешествия",
        "duration": 20,
        "grammar": {
          "title": "Направления: How do I get to...?",
          "explanation": "Чтобы спросить дорогу: «How do I get to...?» или «Where is...?». "
                         "Для указания направления: turn left/right, go straight.",
          "structure": "How do I get to [место]?  |  Turn left/right.  |  Take the [transport] to [место].",
          "examples": [
            ("How do I get to the station?", "Как добраться до станции?"),
            ("Turn left at the traffic lights.", "Поверните налево на светофоре."),
            ("Take the metro to the city centre.", "Поезжайте на метро до центра."),
            ("It's about 10 minutes by foot.", "Это примерно 10 минут пешком."),
            ("Is there a bus stop nearby?", "Есть ли рядом остановка?"),
          ],
        },
        "vocabulary": [
          ("airport",  "[ˈeərpɔːrt]", "аэропорт", "The flight leaves from the airport."),
          ("ticket",   "[ˈtɪkɪt]",    "билет",    "I need to buy a ticket."),
          ("passport", "[ˈpɑːspɔːrt]","паспорт",  "Don't forget your passport!"),
          ("hotel",    "[hoʊˈtel]",   "отель",    "We stayed in a nice hotel."),
          ("luggage",  "[ˈlʌɡɪdʒ]",  "багаж",    "My luggage is heavy."),
        ],
        "exercises": [
          ("«Как добраться до аэропорта?»",
           ["How do I get to the airport?","Where goes the airport?","How I go airport?"],
           "How do I get to the airport?","How do I get to...?"),
          ("Don't forget your ___! (паспорт)",
           ["passport","ticket","luggage"],"passport","Паспорт = passport."),
          ("«Turn left» =",
           ["Поверните налево","Поверните направо","Идите прямо"],
           "Поверните налево","Left = налево, right = направо."),
          ("«Мне нужно купить билет»",
           ["I need to buy a ticket.","I need buy a ticket.","I want ticket."],
           "I need to buy a ticket.","Need to + infinitive."),
          ("My luggage are very heavy.",
           ["Правильно","Неправильно"],"Неправильно","Luggage — ед.ч.: IS heavy."),
        ],
      },
    ],
  },
  {
    "id": "B1", "label": "Intermediate",
    "desc": "Present Perfect, условные предложения, модальные и фразовые глаголы",
    "lessons": [
      {
        "icon": "✅", "title": "Present Perfect", "titleRu": "Настоящее совершённое",
        "duration": 25,
        "grammar": {
          "title": "Present Perfect: have/has + Past Participle",
          "explanation": "Связывает прошлое с настоящим. Используется для жизненного опыта, "
                         "недавних событий. Ключевые слова: ever, never, already, yet, just.",
          "structure": "I/You/We/They + have + past participle  |  He/She/It + has + past participle",
          "examples": [
            ("I have visited London.", "Я бывал(а) в Лондоне."),
            ("She has never eaten sushi.", "Она никогда не ела суши."),
            ("Have you ever seen a volcano?", "Ты когда-нибудь видел вулкан?"),
            ("He has just arrived.", "Он только что прибыл."),
            ("They haven't finished yet.", "Они ещё не закончили."),
          ],
        },
        "vocabulary": [
          ("ever",    "[ˈevər]",    "когда-нибудь",         "Have you ever been to Japan?"),
          ("never",   "[ˈnevər]",   "никогда",              "I have never tried skydiving."),
          ("already", "[ɔːlˈredi]", "уже",                  "She has already eaten."),
          ("yet",     "[jet]",       "ещё/уже (вопр./отриц.)","Have you finished yet?"),
          ("just",    "[dʒʌst]",    "только что",           "I have just arrived."),
        ],
        "exercises": [
          ("She ___ never ___ to China.",
           ["has/been","have/been","has/went"],"has/been","She→has, be→been."),
          ("I ___ (just arrived).",
           ["have just arrived","has just arrived","just arrived"],
           "have just arrived","I + have + just + arrived."),
          ("«yet» в «Have you finished yet?» =",
           ["уже (в вопросе)","никогда","только что"],
           "уже (в вопросе)","Yet в вопросах = уже."),
          ("«Я никогда не пробовал суши»",
           ["I have never tried sushi.","I never tried sushi.","I have never try sushi."],
           "I have never tried sushi.","Have + never + past participle."),
          ("He have already eaten.",
           ["Правильно","Неправильно"],"Неправильно","He → HAS (не have)."),
        ],
      },
      {
        "icon": "🔮", "title": "Second Conditional", "titleRu": "Второй тип условных",
        "duration": 25,
        "grammar": {
          "title": "Second Conditional: воображаемые ситуации",
          "explanation": "Используется для нереальных или маловероятных ситуаций в настоящем/будущем. "
                         "«Если бы я был...», «Если бы у меня было...».",
          "structure": "If + Past Simple, ... would + infinitive",
          "examples": [
            ("If I had money, I would travel the world.", "Если бы у меня были деньги, я бы путешествовал."),
            ("If she were free, she would help you.", "Если бы она была свободна, она бы помогла."),
            ("I would buy a house if I won the lottery.", "Я бы купил дом, если бы выиграл в лотерею."),
            ("What would you do if you lost your phone?", "Что бы ты сделал, если бы потерял телефон?"),
            ("If I were you, I would talk to her.", "На твоём месте я бы поговорил с ней."),
          ],
        },
        "vocabulary": [
          ("would",   "[wʊd]",       "бы (модальный глагол)", "I would go if I could."),
          ("imagine", "[ɪˈmædʒɪn]", "воображать",           "Imagine you had a million dollars."),
          ("lottery", "[ˈlɒtəri]",  "лотерея",             "What if you won the lottery?"),
          ("wish",    "[wɪʃ]",       "желать/хотеть",        "I wish I could fly."),
          ("dream",   "[driːm]",     "мечта/мечтать",        "My dream is to travel the world."),
        ],
        "exercises": [
          ("If I ___ more time, I would read more.",
           ["had","have","will have"],"had","If + past simple. If I HAD..."),
          ("Правильное предложение:",
           ["If she were rich, she would travel.","If she is rich, she would travel.",
            "If she were rich, she will travel."],
           "If she were rich, she would travel.","If + were + would + infinitive."),
          ("Second Conditional описывает:",
           ["Воображаемые/нереальные ситуации","Реальные условия","Прошлые сожаления"],
           "Воображаемые/нереальные ситуации","Нереальное настоящее/будущее."),
          ("I ___ a car if I had money.",
           ["would buy","will buy","bought"],"would buy","would + infinitive."),
          ("If I would have time, I would call you.",
           ["Правильно","Неправильно"],"Неправильно",
           "После if нет would! If I HAD time..."),
        ],
      },
      {
        "icon": "🔑", "title": "Modal Verbs", "titleRu": "Модальные глаголы",
        "duration": 25,
        "grammar": {
          "title": "Модальные глаголы: can, must, should, may, might",
          "explanation": "Выражают возможность, необходимость, разрешение и предположение. "
                         "После них всегда стоит инфинитив без «to».",
          "structure": "Subject + modal verb + infinitive (без to)",
          "examples": [
            ("You must study harder.", "Тебе нужно учиться усерднее."),
            ("She should rest.", "Ей следует отдохнуть."),
            ("Can I open the window?", "Можно открыть окно?"),
            ("They might come tomorrow.", "Они, возможно, придут завтра."),
            ("You may leave now.", "Вы можете уходить."),
          ],
        },
        "vocabulary": [
          ("must",   "[mʌst]",  "должен (сильная обязанность)", "You must wear a seatbelt."),
          ("should", "[ʃʊd]",   "следует (совет)",              "You should see a doctor."),
          ("can",    "[kæn]",   "мочь (способность/разрешение)","She can speak French."),
          ("might",  "[maɪt]",  "возможно (~50%)",              "It might rain today."),
          ("may",    "[meɪ]",   "можно (вежливое разрешение)",  "May I sit here?"),
        ],
        "exercises": [
          ("You ___ eat more vegetables. (совет)",
           ["should","must","can","might"],"should","Should — для советов."),
          ("«Возможно, завтра пойдёт дождь»",
           ["It might rain tomorrow.","It must rain.","It should rain."],
           "It might rain tomorrow.","Might = возможно (~50%)."),
          ("You ___ not smoke here. (запрет)",
           ["must","should","can"],"must","Must not = категорически запрещено."),
          ("She can to swim very well.",
           ["Правильно","Неправильно"],"Неправильно",
           "После модальных нет to! She can SWIM."),
          ("«Можно мне сесть здесь?»",
           ["May I sit here?","Must I sit here?","Should I sit here?"],
           "May I sit here?","May = вежливое разрешение."),
        ],
      },
      {
        "icon": "🔗", "title": "Phrasal Verbs", "titleRu": "Фразовые глаголы",
        "duration": 20,
        "grammar": {
          "title": "Фразовые глаголы: глагол + предлог/наречие",
          "explanation": "Сочетания глагола с предлогом или наречием, имеющие новое значение. "
                         "Очень распространены в разговорном английском.",
          "structure": "verb + particle = новое значение",
          "examples": [
            ("I give up! This is too difficult.", "Сдаюсь! Это слишком сложно."),
            ("She looks for her keys every morning.", "Она каждое утро ищет ключи."),
            ("Please turn off the lights.", "Пожалуйста, выключи свет."),
            ("He gave back the money.", "Он вернул деньги."),
            ("We'll look into the problem.", "Мы рассмотрим эту проблему."),
          ],
        },
        "vocabulary": [
          ("give up",    "[ɡɪv ʌp]",      "сдаться/бросить",      "Don't give up!"),
          ("look for",   "[lʊk fɔːr]",    "искать",               "I'm looking for my phone."),
          ("turn off",   "[tɜːrn ɒf]",    "выключить",            "Turn off the TV."),
          ("turn on",    "[tɜːrn ɒn]",    "включить",             "Turn on the light."),
          ("get up",     "[ɡet ʌp]",      "вставать (с постели)", "I get up at 7 am."),
          ("look after", "[lʊk ˈɑːftər]", "заботиться",           "She looks after her sister."),
        ],
        "exercises": [
          ("«give up» =",
           ["сдаться/бросить","подарить","поднять вверх"],
           "сдаться/бросить","Give up = сдаться. Don't give up!"),
          ("I'm ___ my keys everywhere. (искать)",
           ["looking for","looking after","looking at"],
           "looking for","Look for = искать."),
          ("«Выключи телевизор»",
           ["Turn off the TV.","Turn on the TV.","Turn up the TV."],
           "Turn off the TV.","Turn off = выключить."),
          ("«look after» =",
           ["присматривать/заботиться","искать","смотреть в сторону"],
           "присматривать/заботиться","Look after = заботиться."),
          ("«Turn on» значит «выключить»?",
           ["Да","Нет — «включить»"],"Нет — «включить»",
           "Turn on = включить. Turn OFF = выключить."),
        ],
      },
      {
        "icon": "⚖️", "title": "Making Comparisons", "titleRu": "Сравнения",
        "duration": 20,
        "grammar": {
          "title": "Степени сравнения прилагательных",
          "explanation": "Comparative: прил. + -er ИЛИ more + прил. "
                         "Superlative: the + прил. + -est ИЛИ the most + прил.",
          "structure": "Short: tall→taller→the tallest  |  Long: beautiful→more→the most beautiful",
          "examples": [
            ("She is taller than her brother.", "Она выше своего брата."),
            ("This is the most beautiful city.", "Это самый красивый город."),
            ("English is easier than Japanese.", "Английский проще, чем японский."),
            ("He is the best student in the class.", "Он лучший студент в классе."),
            ("Summer is hotter than winter.", "Лето жарче зимы."),
          ],
        },
        "vocabulary": [
          ("tall / taller / the tallest",             "[tɔːl]",      "высокий/выше/самый высокий", "She is taller than me."),
          ("good / better / the best",                "[ɡʊd]",       "хороший/лучше/лучший",        "This is the best pizza."),
          ("bad / worse / the worst",                 "[bæd]",       "плохой/хуже/худший",          "Today is the worst day."),
          ("big / bigger / the biggest",              "[bɪɡ]",       "большой/больше/самый большой","Russia is the biggest country."),
          ("beautiful / more / the most beautiful",   "[ˈbjuːtɪfəl]","красивый/красивее/самый",     "Paris is more beautiful."),
        ],
        "exercises": [
          ("Сравнительная степень от «tall»:",
           ["taller","tallest","more tall"],"taller","Короткие прил.: + er."),
          ("This is ___ place I have ever seen.",
           ["the most beautiful","more beautiful","beautifulest"],
           "the most beautiful","Длинные прил.: the most +."),
          ("Превосходная степень от «good»:",
           ["the best","the goodest","better"],"the best",
           "good → better → the best (неправильное)."),
          ("«Москва больше Лондона»",
           ["Moscow is bigger than London.","Moscow is more big.","Moscow bigger London."],
           "Moscow is bigger than London.","Big → bigger (удваиваем g)."),
          ("She is the most tall person in the room.",
           ["Правильно","Неправильно"],"Неправильно",
           "Tall — короткое: the tallest."),
        ],
      },
    ],
  },
  {
    "id": "B2", "label": "Upper-Intermediate",
    "desc": "Passive voice, Third Conditional, Reported Speech и идиомы",
    "lessons": [
      {
        "icon": "🔄", "title": "Passive Voice", "titleRu": "Пассивный залог",
        "duration": 25,
        "grammar": {
          "title": "Passive Voice: когда действие важнее деятеля",
          "explanation": "Используется, когда нас больше интересует результат, а не тот, кто действовал. "
                         "Образуется: be + Past Participle.",
          "structure": "be (в нужном времени) + Past Participle  |  by + деятель (необязательно)",
          "examples": [
            ("The book was written in 1984.", "Книга была написана в 1984 году."),
            ("This bridge is used by thousands.", "Этот мост используется тысячами людей."),
            ("The project is being reviewed.", "Проект сейчас рассматривается."),
            ("The report will be sent tomorrow.", "Отчёт будет отправлен завтра."),
            ("The windows were cleaned yesterday.", "Вчера окна были вымыты."),
          ],
        },
        "vocabulary": [
          ("written",       "[ˈrɪtən]",          "написан (write→written)",    "This song was written in 1990."),
          ("built",         "[bɪlt]",            "построен (build→built)",     "This bridge was built in 1850."),
          ("discovered",    "[dɪˈskʌvərd]",      "открыт/обнаружен",          "Penicillin was discovered in 1928."),
          ("manufactured",  "[ˌmænjuˈfæktʃərd]", "произведён",                "This car is manufactured in Germany."),
          ("published",     "[ˈpʌblɪʃt]",        "опубликован",               "The article was published last week."),
        ],
        "exercises": [
          ("Passive от «They clean the office every day»:",
           ["The office is cleaned every day.","The office was cleaned.","The office cleaned."],
           "The office is cleaned every day.","Present Passive: is/are + past participle."),
          ("The letter ___ tomorrow. (пассив, будущее)",
           ["will be sent","will send","is sent"],"will be sent",
           "Future Passive: will be + past participle."),
          ("Passive от «Someone built this house in 1900»:",
           ["This house was built in 1900.","This house is built in 1900.","This house built."],
           "This house was built in 1900.","Past Passive: was/were + past participle."),
          ("English is spoke all over the world.",
           ["Правильно","Неправильно"],"Неправильно",
           "Speak → SPOKEN. English is SPOKEN."),
          ("Passive Voice — это:",
           ["Залог: подлежащее испытывает действие",
            "Залог: подлежащее совершает действие",
            "Специальное время глагола"],
           "Залог: подлежащее испытывает действие","Страдательный залог."),
        ],
      },
      {
        "icon": "😔", "title": "Third Conditional", "titleRu": "Третий тип условных",
        "duration": 25,
        "grammar": {
          "title": "Third Conditional: сожаления о прошлом",
          "explanation": "Описывает воображаемые ситуации в прошлом — то, чего не произошло. "
                         "Выражает сожаление.",
          "structure": "If + Past Perfect, ... would have + Past Participle",
          "examples": [
            ("If she had studied harder, she would have passed.", "Если бы она учились усерднее, она бы сдала."),
            ("If I had known, I would have told you.", "Если бы я знал, я бы тебе сказал."),
            ("He wouldn't have been late if he had left earlier.", "Он бы не опоздал, если бы вышел раньше."),
            ("If they had invited me, I would have come.", "Если бы они пригласили меня, я бы пришёл."),
            ("What would you have done?", "Что бы ты сделал?"),
          ],
        },
        "vocabulary": [
          ("had known",       "[hæd nəʊn]",   "знал бы (если бы знал)",     "If I had known..."),
          ("would have gone", "[wʊd həv ɡɒn]","пошёл бы",                   "I would have gone if..."),
          ("had studied",     "[hæd ˈstʌdid]","учился бы (если бы учился)", "If she had studied..."),
          ("regret",          "[rɪˈɡret]",    "сожаление/сожалеть",         "I regret not saying goodbye."),
          ("otherwise",       "[ˈʌðərwaɪz]",  "иначе/в противном случае",   "Study, otherwise you'll fail."),
        ],
        "exercises": [
          ("If I ___ about the party, I would have come.",
           ["had known","knew","have known"],"had known","If + Past Perfect."),
          ("Правильное предложение:",
           ["If she had studied, she would have passed.",
            "If she studied, she would have passed.",
            "If she had studied, she would pass."],
           "If she had studied, she would have passed.","had + pp → would have + pp."),
          ("Third Conditional — это:",
           ["Воображаемые ситуации в прошлом",
            "Реальные условия в будущем",
            "Воображаемые ситуации в настоящем"],
           "Воображаемые ситуации в прошлом","Нереальное прошлое, сожаления."),
          ("He would ___ if he had tried harder.",
           ["have won","won","win"],"have won","would have + past participle."),
          ("If you would have called me, I would have come.",
           ["Правильно","Неправильно"],"Неправильно",
           "В условии нельзя would have. If you HAD CALLED..."),
        ],
      },
      {
        "icon": "💬", "title": "Reported Speech", "titleRu": "Косвенная речь",
        "duration": 25,
        "grammar": {
          "title": "Reported Speech: передача чужих слов",
          "explanation": "Используется для передачи слов другого человека. "
                         "Времена сдвигаются назад: Present→Past, Future→Conditional.",
          "structure": "He said (that)...  |  She told me (that)...  |  He asked if...  |  She asked me to...",
          "examples": [
            ("\"I am tired\" → She said she was tired.", "«Я устала» → Она сказала, что устала."),
            ("\"I will call\" → He said he would call.", "«Я позвоню» → Он сказал, что позвонит."),
            ("\"Are you ready?\" → She asked if I was ready.", "«Ты готов?» → Она спросила, готов ли я."),
            ("\"Come here!\" → He told me to come there.", "«Иди сюда!» → Он попросил прийти туда."),
            ("\"I don't know\" → She said she didn't know.", "«Я не знаю» → Она сказала, что не знает."),
          ],
        },
        "vocabulary": [
          ("said",    "[sed]",      "сказал (say→said)",          "He said he was happy."),
          ("told",    "[toʊld]",   "рассказал (tell→told)",      "She told me to wait."),
          ("asked",   "[ɑːskt]",   "спросил/попросил",           "He asked if I was free."),
          ("whether", "[ˈweðər]",  "ли (союз для вопросов)",     "She asked whether I liked it."),
          ("that",    "[ðæt]",     "что (союз в косв. речи)",    "He said that he was tired."),
        ],
        "exercises": [
          ("«I am happy» в косвенной речи (she said):",
           ["She said she was happy.","She said she is happy.","She said I was happy."],
           "She said she was happy.","am → was (сдвиг)."),
          ("She asked ___ I was ready. (вопрос да/нет)",
           ["if","what","that"],"if","Вопросы да/нет → asked if/whether."),
          ("«He will call» в косвенной речи:",
           ["He said he would call.","He said he will call.","He said he calls."],
           "He said he would call.","will → would."),
          ("«Come here!» в косвенной речи:",
           ["She told me to come there.","She said me to come here.","She asked to come here."],
           "She told me to come there.","Команды: told + me + to + inf."),
          ("He said that he didn't know the answer.",
           ["Правильно","Неправильно"],"Правильно",
           "don't → didn't. Правильно!"),
        ],
      },
      {
        "icon": "🗣️", "title": "English Idioms", "titleRu": "Английские идиомы",
        "duration": 20,
        "grammar": {
          "title": "Популярные английские идиомы",
          "explanation": "Идиомы — устойчивые выражения, значение которых нельзя понять из отдельных слов. "
                         "Знание идиом делает твой английский живым и натуральным!",
          "structure": "Идиомы нужно запоминать как единое выражение",
          "examples": [
            ("It's raining cats and dogs.", "Льёт как из ведра."),
            ("Break a leg!", "Удачи! (перед выступлением)"),
            ("Hit the nail on the head.", "Попасть в точку."),
            ("It costs an arm and a leg.", "Это стоит бешеных денег."),
            ("Under the weather.", "Плохо себя чувствовать."),
          ],
        },
        "vocabulary": [
          ("raining cats and dogs", "", "льёт как из ведра",        "Take an umbrella — it's raining cats and dogs!"),
          ("break a leg",           "", "удачи! (перед выступлением)","Break a leg at your exam!"),
          ("cost an arm and a leg", "", "стоить очень дорого",       "That car costs an arm and a leg."),
          ("under the weather",     "", "плохо себя чувствовать",    "I'm feeling under the weather today."),
          ("piece of cake",         "", "пустяк / проще простого",   "The test was a piece of cake!"),
          ("bite the bullet",       "", "стиснуть зубы, взять себя в руки","Just bite the bullet and do it."),
        ],
        "exercises": [
          ("«It's raining cats and dogs» =",
           ["Льёт как из ведра","Животные на улице","Плохая погода"],
           "Льёт как из ведра","Очень сильный дождь."),
          ("Что скажешь другу перед экзаменом?",
           ["Break a leg!","Good luck!","Hit the nail!"],
           "Break a leg!","Break a leg! — удача перед важным событием."),
          ("«Piece of cake» =",
           ["Это проще простого","Кусок пирога","Это дорого"],
           "Это проще простого","Очень легко, пустяк."),
          ("I'm feeling ___ the weather. (плохо себя чувствую)",
           ["under","over","above"],"under","Under the weather = плохо себя чувствовать."),
          ("«That car costs an arm and a leg» =",
           ["Машина очень дорогая","Машина повредила","Странная машина"],
           "Машина очень дорогая","Cost an arm and a leg = очень дорого."),
        ],
      },
    ],
  },
  {
    "id": "C1", "label": "Advanced",
    "desc": "Смешанные условные, инверсия и расщеплённые предложения",
    "lessons": [
      {
        "icon": "🧠", "title": "Mixed Conditionals", "titleRu": "Смешанные условные",
        "duration": 30,
        "grammar": {
          "title": "Mixed Conditionals: прошлое условие → настоящий результат",
          "explanation": "Смешивают типы условных. Самый частый вариант: "
                         "прошлое условие (Past Perfect) + настоящий результат (would + infinitive).",
          "structure": "If + Past Perfect (прошлое условие), would + infinitive (настоящий результат)",
          "examples": [
            ("If she had studied medicine, she would be a doctor now.", "Если бы она изучала медицину, она была бы врачом сейчас."),
            ("If he hadn't eaten so much, he wouldn't be ill now.", "Если бы он не ел так много, он бы не болел сейчас."),
            ("If I had saved money, I would be able to travel now.", "Если бы я копил деньги, я бы мог путешествовать."),
            ("She would speak better English if she had practised more.", "Она говорила бы лучше, если бы практиковалась."),
            ("If he had taken the job, he wouldn't be unemployed now.", "Если бы он принял работу, он бы не был безработным."),
          ],
        },
        "vocabulary": [
          ("currently",    "[ˈkɜːrəntli]",         "в настоящее время",  "She is currently a manager."),
          ("consequence",  "[ˈkɒnsɪkwəns]",        "последствие",        "What are the consequences?"),
          ("regret",       "[rɪˈɡret]",             "сожалеть",           "I regret not studying harder."),
          ("hypothetical", "[ˌhaɪpəˈθetɪkəl]",     "гипотетический",     "This is a hypothetical situation."),
          ("outcome",      "[ˈaʊtkʌm]",             "результат/исход",    "The outcome depends on your choices."),
        ],
        "exercises": [
          ("Правильный Mixed Conditional:",
           ["If she had studied, she would be a doctor now.",
            "If she studied, she would be a doctor now.",
            "If she had studied, she would have been a doctor."],
           "If she had studied, she would be a doctor now.",
           "Прошлое (had studied) + настоящий результат (would be now)."),
          ("If he ___ money, he ___ able to travel now.",
           ["had saved/would be","saved/would be","had saved/would have been"],
           "had saved/would be","Past Perfect + would + infinitive."),
          ("В чём разница 3rd vs Mixed Conditional?",
           ["Mixed: прошлое → настоящий результат; 3rd: прошлое → прошлый результат",
            "Mixed: настоящее → прошлый результат",
            "Нет разницы"],
           "Mixed: прошлое → настоящий результат; 3rd: прошлое → прошлый результат",
           "3rd: would have done. Mixed: would do сейчас."),
          ("If I had worked harder, I would have a better job now.",
           ["Правильно","Неправильно"],"Правильно",
           "Прошлое (had worked) → настоящее (would have). Верно!"),
          ("«Если бы она тренировалась, она была бы спортсменом сейчас»",
           ["If she had trained, she would be an athlete now.",
            "If she trained, she would be an athlete.",
            "If she had trained, she would have been an athlete."],
           "If she had trained, she would be an athlete now.",
           "If + Past Perfect → would + inf + now."),
        ],
      },
      {
        "icon": "🔀", "title": "Inversion", "titleRu": "Инверсия",
        "duration": 30,
        "grammar": {
          "title": "Инверсия: продвинутые конструкции для акцента",
          "explanation": "Изменение обычного порядка слов для эмфазы. "
                         "Используется после never, rarely, hardly, not only в формальной речи.",
          "structure": "Never / Rarely / Hardly / Not only + вспомогательный глагол + подлежащее + основной глагол",
          "examples": [
            ("Never have I seen such beauty.", "Никогда ещё я не видел такой красоты."),
            ("Hardly had she arrived when the phone rang.", "Едва она прибыла, как зазвонил телефон."),
            ("Not only did he fail, but he also gave up.", "Он не только провалился, но ещё и сдался."),
            ("Rarely do we get such opportunities.", "Редко нам выпадают такие возможности."),
            ("Only then did I understand.", "Только тогда я понял."),
          ],
        },
        "vocabulary": [
          ("never",    "[ˈnevər]",  "никогда",     "Never have I eaten better food."),
          ("hardly",   "[ˈhɑːrdli]","едва/почти не","Hardly had I sat down when..."),
          ("rarely",   "[ˈreərli]", "редко",        "Rarely do we see this."),
          ("not only", "[nɒt ˈoʊnli]","не только", "Not only did she sing..."),
          ("emphasis", "[ˈemfəsɪs]","акцент/эмфаза","We use inversion for emphasis."),
        ],
        "exercises": [
          ("Правильная инверсия для «I have never seen this»:",
           ["Never have I seen this.","Never I have seen this.","Never I seen this."],
           "Never have I seen this.","Never + вспомогательный + подлежащее."),
          ("Hardly ___ I arrived when she called.",
           ["had","have","did"],"had","Hardly + had + subject (Past Perfect)."),
          ("Когда используется инверсия?",
           ["После отрицательных наречий для эмфазы",
            "Только в вопросах",
            "В повседневной разговорной речи"],
           "После отрицательных наречий для эмфазы",
           "Never, rarely, hardly, not only + инверсия."),
          ("Правильная инверсия для «We rarely get such news»:",
           ["Rarely do we get such news.","Rarely we get such news.","Rarely get we such news."],
           "Rarely do we get such news.","Rarely + do + we + get."),
          ("Not only did she sing, but she also danced.",
           ["Правильно","Неправильно"],"Правильно",
           "Not only + did + she + sing. Правильно!"),
        ],
      },
      {
        "icon": "✨", "title": "Cleft Sentences", "titleRu": "Расщеплённые предложения",
        "duration": 30,
        "grammar": {
          "title": "Cleft Sentences: выделение информации",
          "explanation": "Используются для акцента на определённой части информации. "
                         "Самые популярные: «It is/was... who/that...» и «What... is...».",
          "structure": "It is/was + элемент + who/that...  |  What + subject + verb + is/was + элемент",
          "examples": [
            ("It was Tom who called you.", "Это именно Том тебе звонил."),
            ("It was yesterday that I saw him.", "Именно вчера я его видел."),
            ("What I need is a break.", "Мне нужен отдых."),
            ("It's money that they're after.", "Именно денег они и хотят."),
            ("What surprised me was her reaction.", "Меня удивила именно её реакция."),
          ],
        },
        "vocabulary": [
          ("emphasise", "[ˈemfəsaɪz]",  "подчёркивать/акцентировать","We use cleft sentences to emphasise."),
          ("focus",     "[ˈfoʊkəs]",    "фокус/акцент",             "The focus is on grammar."),
          ("contrast",  "[ˈkɒntrɑːst]", "контраст/сравнение",       "Let's contrast these sentences."),
          ("highlight", "[ˈhaɪlaɪt]",   "выделять/подчёркивать",    "Cleft sentences highlight key info."),
          ("structure", "[ˈstrʌktʃər]", "структура",                "The structure is fixed."),
        ],
        "exercises": [
          ("Cleft sentence для «Anna wrote the book» (акцент на Anna):",
           ["It was Anna who wrote the book.",
            "It was Anna wrote the book.",
            "Anna it was wrote the book."],
           "It was Anna who wrote the book.",
           "It was + выделяемое слово + who/that."),
          ("___ I need is more time.",
           ["What","That","It"],"What","What I need is... = то, что мне нужно."),
          ("Зачем используются cleft sentences?",
           ["Для акцента на определённой части информации",
            "Для образования вопросов",
            "Для образования пассивного залога"],
           "Для акцента на определённой части информации","Выделяют важную информацию."),
          ("«It was yesterday that I met her» акцентирует:",
           ["Время (вчера)","Человека (её)","Действие (встретил)"],
           "Время (вчера)","It was YESTERDAY that — акцент на времени."),
          ("What surprised me was her confidence.",
           ["Правильно","Неправильно"],"Правильно",
           "What + clause + was + выделяемый элемент. Верно!"),
        ],
      },
    ],
  },
]

# ── PDF builder ────────────────────────────────────────────────────────────
W, H = A4
MARGIN = 2.0 * cm
doc = SimpleDocTemplate(
    "/home/user/english-course.pdf",
    pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN, bottomMargin=MARGIN,
)

def dark_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG_DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.restoreState()

story = []

# ── Cover page ─────────────────────────────────────────────────────────────
story.append(Spacer(1, 4*cm))
story.append(Paragraph("🇬🇧  Английский язык", ST["cover_title"]))
story.append(Spacer(1, 0.5*cm))
story.append(Paragraph("Полный курс от A1 до C1", ST["cover_sub"]))
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph("Грамматика · Словарный запас · Упражнения", ST["cover_note"]))
story.append(Spacer(1, 0.3*cm))
story.append(Paragraph("5 уровней  ·  18 уроков  ·  90 упражнений", ST["cover_note"]))
story.append(Spacer(1, 3*cm))

# level overview table
level_data = [["Уровень", "Название", "Описание", "Уроков"]]
for lvl in COURSE:
    level_data.append([lvl["id"], lvl["label"], lvl["desc"][:55] + "…", str(len(lvl["lessons"]))])
tbl = Table(level_data, colWidths=[2*cm, 3.5*cm, 9*cm, 1.8*cm])
tbl.setStyle(TableStyle([
    ("BACKGROUND",   (0,0), (-1,0), colors.HexColor("#1a2535")),
    ("TEXTCOLOR",    (0,0), (-1,0), BRAND_LT),
    ("FONTNAME",     (0,0), (-1,0), "Sans-Bold"),
    ("FONTSIZE",     (0,0), (-1,0), 9),
    ("FONTNAME",     (0,1), (-1,-1),"Sans"),
    ("FONTSIZE",     (0,1), (-1,-1), 9),
    ("TEXTCOLOR",    (0,1), (-1,-1), colors.HexColor("#c8d8e8")),
    ("BACKGROUND",   (0,1), (-1,-1), colors.HexColor("#0d1620")),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.HexColor("#0d1620"), colors.HexColor("#111c28")]),
    ("GRID",         (0,0), (-1,-1), 0.5, colors.HexColor("#1e3040")),
    ("PADDING",      (0,0), (-1,-1), 6),
    ("ALIGN",        (3,0), (3,-1), "CENTER"),
]))
story.append(tbl)
story.append(PageBreak())

# ── Levels & lessons ───────────────────────────────────────────────────────
for lvl in COURSE:
    lc = LEVEL_COLORS[lvl["id"]]
    lc_hex = lc.hexval() if hasattr(lc, "hexval") else "#14b8a6"

    # Level header page
    story.append(Spacer(1, 1*cm))

    # colored badge row
    badge_data = [[f"  {lvl['id']}  ", f"{lvl['label']}"]]
    badge_tbl = Table(badge_data, colWidths=[2*cm, 14*cm])
    badge_tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0),(0,0), lc),
        ("TEXTCOLOR",   (0,0),(0,0), WHITE),
        ("FONTNAME",    (0,0),(0,0), "Sans-Bold"),
        ("FONTSIZE",    (0,0),(0,0), 22),
        ("BACKGROUND",  (1,0),(1,0), colors.HexColor("#0d1620")),
        ("TEXTCOLOR",   (1,0),(1,0), WHITE),
        ("FONTNAME",    (1,0),(1,0), "Sans-Bold"),
        ("FONTSIZE",    (1,0),(1,0), 22),
        ("PADDING",     (0,0),(-1,-1), 8),
        ("VALIGN",      (0,0),(-1,-1),"MIDDLE"),
    ]))
    story.append(badge_tbl)
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph(lvl["desc"], ST["level_desc"]))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1e3040")))
    story.append(Spacer(1, 0.5*cm))

    for lesson in lvl["lessons"]:
        # Lesson title block
        lesson_block = []
        lesson_block.append(Spacer(1, 0.6*cm))
        lesson_block.append(Paragraph(
            f"{lesson['icon']}  {lesson['title']}",
            ST["lesson_title"]
        ))
        lesson_block.append(Paragraph(lesson["titleRu"], ST["lesson_sub"]))

        # Grammar
        g = lesson["grammar"]
        lesson_block.append(Paragraph("ГРАММАТИКА", ST["section_label"]))
        lesson_block.append(Paragraph(g["title"], ST["grammar_title"]))
        lesson_block.append(Paragraph(g["explanation"], ST["body"]))
        lesson_block.append(Spacer(1, 0.3*cm))
        lesson_block.append(Paragraph("Структура:", ST["section_label"]))

        struct_data = [[g["structure"]]]
        struct_tbl = Table(struct_data, colWidths=[16*cm])
        struct_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0),(0,0), colors.HexColor("#0d1a26")),
            ("TEXTCOLOR",  (0,0),(0,0), lc),
            ("FONTNAME",   (0,0),(0,0), "Mono"),
            ("FONTSIZE",   (0,0),(0,0), 9),
            ("PADDING",    (0,0),(0,0), 10),
            ("GRID",       (0,0),(0,0), 0.5, colors.HexColor("#1e3040")),
        ]))
        lesson_block.append(struct_tbl)
        lesson_block.append(Spacer(1, 0.3*cm))

        lesson_block.append(Paragraph("Примеры:", ST["section_label"]))
        ex_data = [[en, ru] for en, ru in g["examples"]]
        ex_tbl = Table(ex_data, colWidths=[8*cm, 8*cm])
        ex_tbl.setStyle(TableStyle([
            ("FONTNAME",     (0,0),(0,-1), "Sans-Bold"),
            ("FONTNAME",     (1,0),(1,-1), "Sans-Italic"),
            ("FONTSIZE",     (0,0),(-1,-1), 9),
            ("TEXTCOLOR",    (0,0),(0,-1), WHITE),
            ("TEXTCOLOR",    (1,0),(1,-1), MUTED),
            ("BACKGROUND",   (0,0),(-1,-1), colors.HexColor("#0d1620")),
            ("ROWBACKGROUNDS",(0,0),(-1,-1),
             [colors.HexColor("#0d1620"), colors.HexColor("#111c28")]),
            ("GRID",         (0,0),(-1,-1), 0.3, colors.HexColor("#1e3040")),
            ("PADDING",      (0,0),(-1,-1), 6),
            ("LEFTPADDING",  (0,0),(-1,-1), 8),
        ]))
        lesson_block.append(ex_tbl)

        # Vocabulary
        lesson_block.append(Spacer(1, 0.5*cm))
        lesson_block.append(Paragraph("СЛОВАРЬ", ST["section_label"]))
        vocab = lesson["vocabulary"]
        vcols = 2
        vocab_rows = []
        for i in range(0, len(vocab), vcols):
            row = []
            for j in range(vcols):
                if i + j < len(vocab):
                    w, tr, tv, ex = vocab[i+j]
                    cell = f"<b>{w}</b>"
                    if tr:
                        cell += f"  <font color='#8b9cb3' size='8'>{tr}</font>"
                    cell += f"<br/><font color='#14b8a6'>{tv}</font>"
                    cell += f"<br/><i><font color='#7a9ab0' size='8'>{ex}</font></i>"
                    row.append(Paragraph(cell, ParagraphStyle(
                        "vc", fontName="Sans", fontSize=10, leading=14,
                        textColor=WHITE, spaceAfter=0
                    )))
                else:
                    row.append("")
            vocab_rows.append(row)
        v_tbl = Table(vocab_rows, colWidths=[8*cm, 8*cm])
        v_tbl.setStyle(TableStyle([
            ("BACKGROUND",    (0,0),(-1,-1), colors.HexColor("#0d1620")),
            ("ROWBACKGROUNDS",(0,0),(-1,-1),
             [colors.HexColor("#0d1620"), colors.HexColor("#111c28")]),
            ("GRID",          (0,0),(-1,-1), 0.3, colors.HexColor("#1e3040")),
            ("PADDING",       (0,0),(-1,-1), 8),
            ("VALIGN",        (0,0),(-1,-1), "TOP"),
        ]))
        lesson_block.append(v_tbl)

        # Exercises
        lesson_block.append(Spacer(1, 0.5*cm))
        lesson_block.append(Paragraph("УПРАЖНЕНИЯ", ST["section_label"]))
        for ei, (q, opts, ans, expl) in enumerate(lesson["exercises"], 1):
            lesson_block.append(Paragraph(f"{ei}. {q}", ST["q_text"]))
            opt_lines = "   ".join([
                f"{'✓ ' if o == ans else '○ '}{o}" for o in opts
            ])
            lesson_block.append(Paragraph(opt_lines, ST["q_option"]))
            lesson_block.append(Paragraph(f"✓ Ответ: {ans}", ST["q_answer"]))
            lesson_block.append(Paragraph(expl, ST["q_explain"]))

        lesson_block.append(HRFlowable(
            width="100%", thickness=0.5,
            color=colors.HexColor("#1e3040"), spaceAfter=4
        ))

        story.append(KeepTogether(lesson_block[:6]))
        story.extend(lesson_block[6:])
        story.append(PageBreak())

doc.build(story, onFirstPage=dark_bg, onLaterPages=dark_bg)
print("Done: /home/user/english-course.pdf")
