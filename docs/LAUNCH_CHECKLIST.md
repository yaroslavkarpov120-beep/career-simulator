# Go-live checklist (soft launch)

Production: **https://career-simulator-beryl.vercel.app**

## Build & data

- [x] `npm run validate:professions` — ≥1000 профессий
- [x] `npm run build` — без ошибок
- [x] `./scripts/smoke.sh` на production URL

## Legal & trust

- [x] `/privacy`, `/terms`, `/about` доступны
- [x] Disclaimer в шапке и футере
- [x] Возраст 12+ в Privacy, Terms, About

## Product

- [x] Wizard 20 шагов → 5 профессий
- [x] Каталог `/professions` — 1000 ролей
- [x] Share PNG — `/profession/*`
- [x] Rate limit 1/день (сервер + localStorage)

## Infra

- [x] Env vars на Vercel (`NEXT_PUBLIC_APP_URL`, `RATE_LIMIT_FREE_PER_DAY`)
- [x] HTTPS (vercel.app)
- [x] `/api/health` для uptime monitor
- [x] Vercel Web Analytics (`@vercel/analytics`) — включить в Dashboard → Analytics
- [ ] UptimeRobot monitor → `https://career-simulator-beryl.vercel.app/api/health` (5 min)
- [ ] Свой домен (опционально)

## Growth — soft launch

- [x] OG image и meta (20 вопросов, 1000+ профессий)
- [x] Готовые посты → [`SOFT_LAUNCH_POSTS.md`](./SOFT_LAUNCH_POSTS.md)
- [ ] Отправить 3–5 постов (Telegram, школьные чаты)
- [ ] Plausible/GA4 (опционально): `NEXT_PUBLIC_ANALYTICS_ID` + redeploy

## Команда перед анонсом

```bash
./scripts/smoke.sh https://career-simulator-beryl.vercel.app
```

Ручная проверка: `/simulate` (20 шагов) → `/results` → `/profession/software-engineer`.

## Post-launch (v1.1)

- Stripe Premium
- LLM enrich топ-50 профессий
- kk/uz полный контент профессий
