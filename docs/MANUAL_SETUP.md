# Ручная настройка и публикация

Пошагово: что сделать своими руками, без автоматизации из Cursor.

---

## 1. Запуск локально (проверка перед выкладкой)

1. Открой **Терминал** (macOS).
2. Перейди в папку проекта:
   ```bash
   cd "/Users/admin/Cursor Yaroslav 2/career-simulator"
   ```
3. Запусти:
   ```bash
   ./scripts/dev.sh
   ```
   Или двойной клик по **`ЗАПУСК.command`**.
4. В консоли будет ссылка, например `http://localhost:3456` или `3457` — открой её в браузере.
5. Пройди цепочку: главная → **Симуляция** (15 шагов) → результаты → карточка профессии → **Каталог**.

Остановка сервера:
```bash
./scripts/stop.sh
```

---

## 2. Выкладка в интернет (GitHub + Vercel)

### 2.1. Репозиторий на GitHub

1. Зайди на [github.com](https://github.com) → **New repository**.
2. Имя, например `career-simulator`, **без** README (чтобы не было конфликта).
3. В терминале (из папки **родителя**, если репозиторий — вся папка `Cursor Yaroslav 2`, или из `career-simulator`, если только она):

   **Вариант A — только папка career-simulator:**
   ```bash
   cd "/Users/admin/Cursor Yaroslav 2/career-simulator"
   git init
   git add .
   git commit -m "Career Simulator v1.0"
   git branch -M main
   git remote add origin https://github.com/ВАШ_ЛОГИН/career-simulator.git
   git push -u origin main
   ```

   **Вариант B — весь workspace:**
   ```bash
   cd "/Users/admin/Cursor Yaroslav 2"
   git init
   git add career-simulator
   git commit -m "Add Career Simulator"
   git remote add origin https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПО.git
   git push -u origin main
   ```

### 2.2. Проект на Vercel

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → импорт репозитория.
2. **Root Directory:** если репозиторий — только `career-simulator`, оставь `.`; если монорепо — укажи `career-simulator`.
3. **Framework:** Next.js (подхватится сам).
4. **Build Command:** `npm run validate:professions && npm run build` (как в `vercel.json`).
5. **Environment Variables** (Settings → Environment Variables):

   | Имя | Значение | Обязательно |
   |-----|----------|-------------|
   | `NEXT_PUBLIC_APP_URL` | `https://ваш-домен.vercel.app` | да |
   | `RATE_LIMIT_FREE_PER_DAY` | `1` | нет |
   | `OPENAI_API_KEY` | ключ OpenAI | нет (без него — mock) |
   | `NEXT_PUBLIC_ANALYTICS_ID` | домен Plausible или `G-...` GA4 | нет |

6. **Deploy**. Дождись зелёной галочки.
7. Скопируй production URL и **обнови** `NEXT_PUBLIC_APP_URL` на этот URL → **Redeploy**.

### 2.3. Свой домен (по желанию)

1. Vercel → Project → **Settings** → **Domains** → добавь домен.
2. У регистратора DNS: CNAME на `cname.vercel-dns.com` (Vercel покажет точные записи).
3. Снова выстави `NEXT_PUBLIC_APP_URL=https://ваш-домен.com` и redeploy.

### 2.4. Проверка после деплоя

На Mac в терминале:
```bash
cd "/Users/admin/Cursor Yaroslav 2/career-simulator"
./scripts/smoke.sh https://ваш-проект.vercel.app
```

Должно быть `All smoke checks passed.`

---

## 3. Ручное добавление новой профессии в каталог

Все профессии собираются из **`scripts/build-catalog.mjs`**.

### Шаг 1 — запись в список

Открой `scripts/build-catalog.mjs`, найди массив `PROFESSIONS` и добавь строку через `entry(...)`:

```javascript
entry(
  "my-new-job",           // id латиницей, через дефис (URL: /profession/my-new-job)
  "Название на русском",
  "English Title",
  "it",                   // категория: it | medicine | creative | engineering | business | ...
  40,                     // ai_risk_percent 0–100
  80000,                  // зарплата min (база RU, потом масштабируется по региону)
  150000,                 // зарплата max
  {
    featured: false,      // true — попадёт в sitemap и на главную
    interests: ["code", "design"],  // опционально, иначе из категории
  }
),
```

**Правила id:** только `a-z`, цифры, дефис; уникальный; не менять id у уже опубликённых профессий.

### Шаг 2 — пересборка JSON

```bash
cd "/Users/admin/Cursor Yaroslav 2/career-simulator"
node scripts/build-catalog.mjs
npm run validate:professions
```

Должно быть: `OK: N professions validated` (N ≥ 200).

### Шаг 3 — уникальные тексты (опционально)

Шаблонные тексты подставятся автоматически. Чтобы улучшить через OpenAI:

```bash
export OPENAI_API_KEY="sk-..."
node scripts/generate-professions.mjs
```

Или только нужные id (если скрипт поддерживает аргументы — смотри начало `generate-professions.mjs`).

Ручная правка без AI: открой `src/data/professions.json`, найди объект по `"id": "my-new-job"`, отредактируй `locales.ru` / `locales.en` (`summary`, `day_timeline`, `roadmap`, `ai_risk_explanation`). После правки в JSON снова запусти `npm run validate:professions`.

### Шаг 4 — проверка в браузере

```bash
./scripts/dev.sh
```

Открой:
- `http://localhost:ПОРТ/professions` — профессия в списке
- `http://localhost:ПОРТ/profession/my-new-job` — карточка открывается

---

## 4. Переменные окружения локально

1. Скопируй пример:
   ```bash
   cp .env.example .env.local
   ```
2. Отредактируй `.env.local` (файл не коммитить в git).
3. Перезапусти `./scripts/dev.sh`.

---

## 5. Аналитика (вручную)

1. **Plausible:** зарегистрируй сайт → скопируй domain → в Vercel: `NEXT_PUBLIC_ANALYTICS_ID=ваш-домен.plausible.io` (или как в кабинете Plausible).
2. **GA4:** создай поток → Measurement ID `G-XXXX` → тот же env на Vercel.
3. Redeploy. В браузере пройди симуляцию и открой каталог — в кабинете аналитики появятся события `simulate_complete`, `catalog_view` и др.

---

## 6. Waitlist B2B / Premium (куда попадают заявки)

**Production:** задай Formspree в `.env.local` / Vercel:

- `NEXT_PUBLIC_FORMSPREE_B2B` — id формы B2B
- `NEXT_PUBLIC_FORMSPREE_PREMIUM` — id формы Premium

Без env — fallback в **localStorage** (демо):

- Premium: `career-simulator-premium-waitlist`
- B2B: `career-simulator-b2b-waitlist`

**PDF отчёт:** Premium → «Скачать PDF» (печать в PDF в браузере).

**Разовая оплата:** `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` — URL Stripe Payment Link.

**LLM контент:** `OPENAI_API_KEY=sk-... npm run generate:featured` — обогащает до 50 featured профессий.

---

## 7. Чеклист перед объявлением soft launch

См. [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md). Минимум:

- [ ] `./scripts/smoke.sh` на production URL — OK  
- [ ] Privacy / Terms открываются  
- [ ] Симуляция даёт 5 профессий  
- [ ] 5 интервью записаны в [INTERVIEW_LOG.md](./INTERVIEW_LOG.md) (или решение «ship anyway»)

---

## Частые проблемы

| Симптом | Решение |
|---------|---------|
| Белый экран / 500 локально | `./scripts/stop.sh`, `rm -rf .next`, `./scripts/dev.sh` |
| Smoke FAIL на 3456, сервер на 3457 | `./scripts/smoke.sh` без URL — подхватит `.dev-port` или свободный порт |
| `npm: command not found` | Используй `./scripts/dev.sh` (встроенный Node в `.tools/node`) |
| `generate:professions` exit 127 | Запускай через `node scripts/generate-professions.mjs` после `source scripts/ensure-node.sh` |
| Профессия 404 | Проверь id в `professions.json` и что выполнен `build-catalog.mjs` |
