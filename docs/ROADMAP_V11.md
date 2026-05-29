# Roadmap v1.1 — выбранный фокус

**Решение (soft launch):** приоритет **B2C метрики** — доверие к AI-risk, waitlist Premium, PDF для родителей, SEO каталога.

B2B пилот в школе — **v1.2** после 5+ интервью и production URL.

## Порядок v1.1 (реализовано в коде)

1. Waitlist B2B/Premium → Formspree (env) + fallback localStorage
2. Tooltip AI-risk + методология на `/about#methodology`
3. PDF-отчёт (печать в PDF) + опциональная Stripe Payment Link
4. `npm run generate:featured` — LLM enrich featured профессий
5. Sitemap: все 217 `/profession/[id]`

## v1.2 (следующий этап)

- Stripe Checkout API (подписка)
- Сравнение 2 профессий
- Промокод класса для школ
- kk/uz контент профессий

## Метрики успеха v1.1

- ≥100 симуляций/нед на production
- ≥20 email в Premium waitlist
- ≥3 интервью с NPS ≥7
