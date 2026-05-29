# Go-live checklist (soft launch)

## Build & data

- [x] `npm run validate:professions` — ≥200 профессий (217)
- [x] `npm run build` — без ошибок
- [x] `./scripts/smoke.sh` на production URL (локально: `./scripts/start-prod.sh` + smoke OK)

## Legal & trust

- [x] `/privacy`, `/terms`, `/about` доступны
- [x] Disclaimer в шапке и футере
- [ ] Возраст 12+ указан в Terms/About

## Product

- [x] Wizard 15 шагов → 5 профессий (smoke `/simulate`, `/results`)
- [x] Каталог `/professions` — smoke 200
- [x] Share PNG — страница `/profession/*` smoke OK
- [x] Rate limit 1/день для бесплатных (сервер + localStorage)

## Infra

- [ ] Env vars на хостинге (см. DEPLOY.md) — **ты: Vercel Settings**
- [ ] HTTPS и домен — **ты: Vercel Domains**
- [ ] Uptime monitor на `/`

## Growth

- [x] OG image и meta tags (`opengraph-image.tsx`, `sitemap.ts`, `robots.ts`)
- [x] Аналитика (компонент `Analytics`, env `NEXT_PUBLIC_ANALYTICS_ID`)
- [ ] 3–5 сценариев для соцсетей (см. VALIDATION.md)

## Post-launch (v1.1)

- Stripe Premium
- LLM enrich топ-50 профессий
- kk/uz контент профессий
