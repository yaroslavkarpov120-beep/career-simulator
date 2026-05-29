# QA каталога (30 профессий)

Выборка для дней 2–3 плана: по 2–3 профессии из каждой категории.

| Категория | ID для проверки |
|-----------|-----------------|
| IT | `software-engineer`, `data-analyst`, `cybersecurity-specialist` |
| Medicine | `general-practitioner`, `nurse`, `pharmacist` |
| Creative | `graphic-designer`, `ux-designer`, `game-designer` |
| Engineering | `civil-engineer`, `mechanical-engineer` |
| Business | `product-manager`, `accountant`, `marketing-manager` |
| Education | `teacher`, `tutor` |
| Law | `lawyer`, `paralegal` |
| Trades | `electrician`, `welder` |
| Hospitality | `chef`, `hotel-manager` |
| Media | `journalist`, `video-editor` |
| Science | `biologist`, `chemist` |
| Public | `social-worker`, `firefighter` |
| Sports | `fitness-trainer`, `coach` |

## Чеклист на профессию
- [ ] Зарплата в разумном диапазоне для RU/KZ/UZ
- [ ] AI-risk 0–100 и объяснение не пустое
- [ ] Day timeline ≥ 4 пункта
- [ ] Roadmap ≥ 5 шагов
- [ ] Нет дословного дубликата с другой профессией в той же категории

## Команды
```bash
npm run validate:professions
npm run build
# опционально LLM для приоритетных id:
OPENAI_API_KEY=sk-... npm run generate:professions -- --ids=software-engineer,data-analyst
```
