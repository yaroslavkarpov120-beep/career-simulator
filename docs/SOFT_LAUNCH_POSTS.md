# Готовые посты для soft launch

Production URL: **https://career-simulator-beryl.vercel.app**

---

## Telegram / школьный чат (короткий)

```
🎯 Career Simulator — бесплатный профориентатор онлайн

20 вопросов → 5 профессий с зарплатой по вашему региону, AI-risk и планом на 30 дней.
Каталог: 1000+ профессий.

Для подростков 12+ (до 16 — лучше с родителем).
Это не замена психолога, а старт разговора о будущем.

👉 https://career-simulator-beryl.vercel.app/simulate
Демо без регистрации: /demo
```

---

## Telegram (длинный, для родителей)

```
Ищете способ поговорить с ребёнком о карьере без давления?

Career Simulator — 20 профессиональных вопросов, на выходе 5 подходящих профессий:
• зарплата для Москвы / Алматы / Ташкента и др.
• AI-risk — насколько профессию могут автоматизировать к 2030
• roadmap — что изучать в ближайшие 30 дней

1000+ профессий в каталоге, 4 языка интерфейса.
Бесплатно: 1 симуляция в день.

⚠️ Оценки ориентировочные, не карьерная консультация. 12+

https://career-simulator-beryl.vercel.app
```

---

## Instagram / Reels (сценарий 30 сек)

1. **0–3 сек:** «Какую профессию выбрать в 2026? 20 вопросов — 5 ответов»
2. **3–15 сек:** экран `/simulate`, быстро листать шаги
3. **15–25 сек:** `/results` — зарплата + AI-risk на карточке
4. **25–30 сек:** CTA «Ссылка в био» → career-simulator-beryl.vercel.app

---

## B2B (учителю / классному)

```
Career Simulator для урока профориентации:

• ученики проходят симуляцию на телефоне (20 мин)
• обсуждаете top-5 и AI-risk в классе
• отчёты по классу — в разработке (waitlist)

B2B waitlist: https://career-simulator-beryl.vercel.app/b2b
```

---

## UptimeRobot (1 раз настроить)

1. [uptimerobot.com](https://uptimerobot.com) → **Add Monitor**
2. Type: HTTP(s)
3. URL: `https://career-simulator-beryl.vercel.app/api/health`
4. Interval: 5 minutes
5. Alert: email или Telegram bot

---

## Vercel Analytics

1. [vercel.com](https://vercel.com) → проект **career-simulator** → **Analytics** → Enable
2. События в коде: `simulate_complete`, `catalog_view`, `share_download`

Опционально Plausible/GA4: см. [`OPTIONAL_DOMAIN_ANALYTICS.md`](./OPTIONAL_DOMAIN_ANALYTICS.md)
