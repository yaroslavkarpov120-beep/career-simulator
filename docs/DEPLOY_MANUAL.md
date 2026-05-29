# Ручной деплой Career Simulator

Пошаговая инструкция: GitHub → Vercel → env → smoke → soft launch.

## 0. Проверка перед выкладкой

```bash
cd "/Users/admin/Cursor Yaroslav 2/career-simulator"
./scripts/prepare-deploy.sh
```

Ожидаем: `OK: 217 professions validated` и успешный `next build`.

---

## 1. GitHub

1. [github.com/new](https://github.com/new) → имя `career-simulator`, **без** README.
2. В терминале:

```bash
cd "/Users/admin/Cursor Yaroslav 2/career-simulator"
git init   # если ещё не init
git add .
git commit -m "Career Simulator v1.0 — soft launch"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/career-simulator.git
git push -u origin main
```

Не коммить: `.env.local`, `.next/`, ключи API.

---

## 2. Vercel

1. [vercel.com/new](https://vercel.com/new) → Import репозитория.
2. Настройки:

| Поле | Значение |
|------|----------|
| Root Directory | `.` |
| Build Command | `npm run validate:professions && npm run build` |
| Framework | Next.js |
| Node.js | 20 |

3. **Deploy** → скопируй URL `https://....vercel.app`.

Конфиг дублируется в [`vercel.json`](../vercel.json).

---

## 3. Environment Variables

Vercel → **Settings** → **Environment Variables** → Production (+ Preview по желанию):

| Переменная | Значение |
|------------|----------|
| `NEXT_PUBLIC_APP_URL` | `https://ваш-проект.vercel.app` |
| `RATE_LIMIT_FREE_PER_DAY` | `1` |
| `OPENAI_API_KEY` | опционально |
| `NEXT_PUBLIC_ANALYTICS_ID` | опционально |

**Redeploy** после добавления переменных.

---

## 4. Smoke на production

```bash
./scripts/smoke.sh https://ваш-проект.vercel.app
```

Или сохрани URL в файл и запусти без аргумента:

```bash
echo "https://ваш-проект.vercel.app" > .production-url
./scripts/smoke.sh
```

---

## 5. Ручная проверка в браузере

- `/` → `/simulate` (15 шагов) → `/results` (5 профессий)
- `/professions` — поиск, пагинация
- `/profession/software-engineer` — карточка, share PNG
- `/privacy`, `/terms`, `/about`
- Disclaimer в шапке и футере

Чеклист: [`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md).

---

## 6. Домен (опционально)

1. Vercel → **Domains** → добавь домен.
2. DNS у регистратора (CNAME на Vercel).
3. Обнови `NEXT_PUBLIC_APP_URL` → **Redeploy**.
4. `./scripts/smoke.sh https://ваш-домен.com`

Подробнее: [`OPTIONAL_DOMAIN_ANALYTICS.md`](./OPTIONAL_DOMAIN_ANALYTICS.md).

---

## 7. Аналитика и uptime (опционально)

См. [`OPTIONAL_DOMAIN_ANALYTICS.md`](./OPTIONAL_DOMAIN_ANALYTICS.md).

---

## Частые проблемы

| Симптом | Решение |
|---------|---------|
| Build failed | Vercel Build Logs; проверь Root Directory |
| OG на localhost | `NEXT_PUBLIC_APP_URL` + Redeploy |
| Smoke FAIL 3456 vs 3457 | `./scripts/smoke.sh` без URL — авто-порт |
| 500 локально | `./scripts/stop.sh && rm -rf .next && ./scripts/dev.sh` |

См. также [`MANUAL_SETUP.md`](./MANUAL_SETUP.md).
