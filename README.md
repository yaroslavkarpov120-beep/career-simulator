# Career Simulator

Симулятор карьеры для подростков и студентов: **20 вопросов** → **5 профессий**, каталог **1000+ ролей**, зарплаты по региону СНГ, AI-risk и roadmap.

## Запуск локально

```bash
./scripts/dev.sh
# или двойной клик: ЗАПУСК.command
```

Открой **http://localhost:3456**

Перезапуск: `./scripts/stop.sh && ./scripts/dev.sh`

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run build` | Production build |
| `npm run validate:professions` | Проверка каталога (≥1000) |
| `npm run build:catalog` | Пересборка `src/data/professions.json` |
| `./scripts/smoke.sh [url]` | Smoke-тест маршрутов |
| `./scripts/prepare-deploy.sh` | validate + build перед деплоем |
| `./scripts/push-github.sh ЛОГИН` | push на GitHub после создания репо |

## Деплой в интернет

**Пошагово:** [docs/DEPLOY_MANUAL.md](docs/DEPLOY_MANUAL.md) (GitHub → Vercel → smoke).

Кратко: [docs/DEPLOY.md](docs/DEPLOY.md). Опционально домен и аналитика: [docs/OPTIONAL_DOMAIN_ANALYTICS.md](docs/OPTIONAL_DOMAIN_ANALYTICS.md).

## Документация

- [SCOPE v1.0](docs/SCOPE_V1.md) — что входит в релиз
- [DEPLOY_MANUAL](docs/DEPLOY_MANUAL.md) — **ручной деплой по шагам**
- [DEPLOY](docs/DEPLOY.md) — Vercel и env
- [MANUAL_SETUP](docs/MANUAL_SETUP.md) — локально, профессии, waitlist
- [LAUNCH_CHECKLIST](docs/LAUNCH_CHECKLIST.md) — go-live
- [VALIDATION](docs/VALIDATION.md) — интервью с пользователями

## Wizard (20 шагов)

Возраст → класс → интересы → избегание → навык → страна/город → зарплата → формат работы → приоритеты → стресс → расписание.

## Структура

- `src/data/professions.json` — каталог профессий
- `src/lib/professions-loader.ts` — подбор и сборка карточек
- `src/app/professions/` — каталог с поиском
- `src/app/api/simulate/` — API симуляции

## API

`POST /api/simulate` — тело по `wizardInputSchema` в `src/lib/schemas.ts`
