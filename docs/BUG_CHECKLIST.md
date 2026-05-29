# Чеклист багов (pre-release)

| ID | Приоритет | Страница | Описание | Статус |
|----|-----------|----------|----------|--------|
| B01 | P0 | /simulate | Wizard должен завершаться без блокировки на шаге 15 | fixed |
| B02 | P0 | / | Белый экран при ошибке JS | fixed (ErrorBoundary) |
| B03 | P1 | /professions | Не грузить 217 карточек сразу | fixed (index + page) |
| B04 | P1 | /profession/[id] | 404 для неизвестного id | open |
| B05 | P2 | README | Устаревшее «7 шагов» | fixed |
| B06 | P2 | kk/uz | Контент профессий fallback ru | known |

## Smoke URLs (после деплоя)

- [ ] `GET /` 200
- [ ] `GET /simulate` 200
- [ ] `GET /professions` 200
- [ ] `GET /profession/software-engineer` 200
- [ ] `POST /api/simulate` 200 (valid body)
- [ ] `GET /privacy` `GET /terms` `GET /about` 200
