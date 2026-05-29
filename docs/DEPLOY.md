# Деплой Career Simulator

См. пошаговую инструкцию: [DEPLOY_MANUAL.md](./DEPLOY_MANUAL.md).

## Vercel (рекомендуется)

1. Подключи репозиторий к [Vercel](https://vercel.com).
3. Build command: `npm run validate:professions && npm run build` (или как в `vercel.json`; Node 18+)
4. Output: Next.js default

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | yes | `https://your-domain.com` |
| `OPENAI_API_KEY` | no | Серверная генерация; без ключа — mock |
| `NEXT_PUBLIC_ANALYTICS_ID` | no | Plausible domain или GA4 id |
| `NEXT_PUBLIC_SUPABASE_URL` | no | Cloud saves |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | no | Cloud saves |
| `RATE_LIMIT_FREE_PER_DAY` | no | Default `1` |

### Staging

- Branch `staging` → Preview URL в Vercel
- Прогони `./scripts/smoke.sh https://preview-url.vercel.app`

### Production

- Merge в `main` → production deploy
- Привязать домен, включить HTTPS
- Обновить `NEXT_PUBLIC_APP_URL`

## Локальный production smoke

```bash
npm run build
./scripts/start-prod.sh
./scripts/smoke.sh http://localhost:3456
```

## Локальный dev (macOS)

`./scripts/dev.sh` или `ЗАПУСК.command` → http://localhost:3456
