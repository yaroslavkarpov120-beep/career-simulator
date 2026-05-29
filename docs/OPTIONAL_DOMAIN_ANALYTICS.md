# Опционально после деплоя: домен, аналитика, uptime

## Свой домен

1. **Vercel** → Project → Settings → **Domains** → Add.
2. У регистратора добавь DNS-записи из Vercel (CNAME / A).
3. Дождись SSL (Valid).
4. `NEXT_PUBLIC_APP_URL=https://ваш-домен.com` → Redeploy.
5. `./scripts/smoke.sh https://ваш-домен.com`

---

## Plausible

1. [plausible.io](https://plausible.io) → Add website.
2. Vercel: `NEXT_PUBLIC_ANALYTICS_ID=ваш-домен.com`
3. Redeploy → события `simulate_complete`, `catalog_view`.

---

## Google Analytics 4

1. GA4 → Measurement ID `G-XXXXXXXXXX`.
2. Vercel: `NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX`
3. Redeploy → Realtime.

---

## UptimeRobot

1. [uptimerobot.com](https://uptimerobot.com) → HTTP monitor на `https://ваш-домен/`, 5 min.

---

## Waitlist в production

Email B2B/Premium сейчас в localStorage. Для production: Formspree, Supabase или API в `premium/page.tsx` и `b2b/page.tsx`.
