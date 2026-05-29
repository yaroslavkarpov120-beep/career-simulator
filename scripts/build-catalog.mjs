#!/usr/bin/env node
/**
 * Builds data/professions-seed.json and src/data/professions.json + professions-index.json
 * Run: node scripts/build-catalog.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { expandProfessions, TARGET_TOTAL } from "./catalog-role-banks.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");

const CATEGORIES = {
  it: { interests: ["code", "math", "analytics"], lifestyle: ["remote"] },
  medicine: { interests: ["medicine", "science", "people"], lifestyle: [] },
  creative: { interests: ["design", "creativity", "music"], lifestyle: ["creativity"] },
  engineering: { interests: ["engineering", "math", "science"], lifestyle: [] },
  business: { interests: ["business", "marketing", "analytics"], lifestyle: [] },
  education: { interests: ["people", "languages", "science"], lifestyle: ["stability"] },
  law: { interests: ["law", "people", "languages"], lifestyle: ["stability"] },
  trades: { interests: ["engineering", "people"], lifestyle: ["stability"] },
  hospitality: { interests: ["people", "languages", "sports"], lifestyle: ["travel"] },
  media: { interests: ["marketing", "creativity", "languages"], lifestyle: ["creativity"] },
  science: { interests: ["science", "math", "analytics"], lifestyle: [] },
  public: { interests: ["people", "law"], lifestyle: ["stability"] },
  sports: { interests: ["sports", "people"], lifestyle: [] },
};

function entry(id, ru, en, category, ai, min, max, extra = {}) {
  const cat = CATEGORIES[category];
  return {
    id,
    title: { ru, en },
    category,
    tags: {
      interests: extra.interests ?? cat.interests,
      skills: extra.skills ?? [],
      avoidPenalties: extra.avoidPenalties ?? {},
      stages: extra.stages ?? ["school_11", "student"],
      lifestyle: extra.lifestyle ?? cat.lifestyle,
    },
    salaryBase: { min, max },
    ai_risk_percent: ai,
    featured: extra.featured ?? false,
  };
}

const BASE_PROFESSIONS = [
  // IT (25)
  entry("software-engineer", "Разработчик ПО", "Software Engineer", "it", 45, 100000, 200000, { featured: true, interests: ["code", "math", "engineering"] }),
  entry("frontend-developer", "Frontend-разработчик", "Frontend Developer", "it", 48, 90000, 180000, { interests: ["code", "design"] }),
  entry("backend-developer", "Backend-разработчик", "Backend Developer", "it", 44, 95000, 190000, { interests: ["code", "math"] }),
  entry("fullstack-developer", "Fullstack-разработчик", "Fullstack Developer", "it", 46, 100000, 195000, { interests: ["code", "design"] }),
  entry("mobile-developer", "Мобильный разработчик", "Mobile Developer", "it", 43, 95000, 185000, { interests: ["code", "games"] }),
  entry("devops-engineer", "DevOps-инженер", "DevOps Engineer", "it", 40, 110000, 210000, { interests: ["code", "engineering"] }),
  entry("qa-engineer", "QA-инженер / тестировщик", "QA Engineer", "it", 55, 70000, 140000, { interests: ["code", "analytics"] }),
  entry("data-analyst", "Аналитик данных", "Data Analyst", "it", 42, 90000, 140000, { featured: true, interests: ["analytics", "math", "code"] }),
  entry("data-scientist", "Data Scientist", "Data Scientist", "it", 38, 120000, 220000, { interests: ["science", "math", "code"] }),
  entry("ml-engineer", "ML-инженер", "ML Engineer", "it", 35, 130000, 250000, { interests: ["science", "code", "math"] }),
  entry("cybersecurity-analyst", "Специалист по кибербезопасности", "Cybersecurity Analyst", "it", 32, 100000, 200000, { interests: ["code", "engineering"] }),
  entry("cloud-architect", "Cloud-архитектор", "Cloud Architect", "it", 36, 140000, 260000, { interests: ["code", "engineering"] }),
  entry("database-administrator", "Администратор БД", "Database Administrator", "it", 41, 90000, 170000, { interests: ["code", "analytics"] }),
  entry("system-administrator", "Системный администратор", "System Administrator", "it", 50, 65000, 130000, { interests: ["code", "engineering"] }),
  entry("network-engineer", "Сетевой инженер", "Network Engineer", "it", 38, 80000, 150000, { interests: ["engineering", "code"] }),
  entry("embedded-developer", "Embedded-разработчик", "Embedded Developer", "it", 34, 95000, 180000, { interests: ["engineering", "code"] }),
  entry("blockchain-developer", "Blockchain-разработчик", "Blockchain Developer", "it", 42, 110000, 220000, { interests: ["code", "business"] }),
  entry("game-developer", "Разработчик игр", "Game Developer", "it", 38, 70000, 180000, { featured: true, interests: ["games", "code"] }),
  entry("product-manager", "Продакт-менеджер", "Product Manager", "it", 35, 120000, 220000, { featured: true, interests: ["business", "code", "analytics"] }),
  entry("ux-designer", "UX-дизайнер", "UX Designer", "it", 28, 80000, 150000, { featured: true, interests: ["design", "code"] }),
  entry("ui-designer", "UI-дизайнер", "UI Designer", "it", 35, 75000, 140000, { interests: ["design", "creativity"] }),
  entry("technical-writer", "Технический писатель", "Technical Writer", "it", 52, 60000, 120000, { interests: ["languages", "code"] }),
  entry("scrum-master", "Scrum Master", "Scrum Master", "it", 45, 90000, 160000, { interests: ["people", "business"] }),
  entry("it-support-specialist", "Специалист техподдержки", "IT Support Specialist", "it", 58, 45000, 90000, { interests: ["code", "people"] }),
  entry("business-analyst", "Бизнес-аналитик", "Business Analyst", "it", 40, 85000, 150000, { interests: ["business", "analytics"] }),

  // Medicine (20)
  entry("nurse", "Медсестра / медбрат", "Nurse", "medicine", 18, 45000, 90000, { featured: true, avoidPenalties: { blood: -5, night_shifts: -2 } }),
  entry("doctor-general", "Врач-терапевт", "General Practitioner", "medicine", 15, 80000, 180000, { interests: ["medicine", "science", "people"] }),
  entry("dentist", "Стоматолог", "Dentist", "medicine", 12, 90000, 200000, { interests: ["medicine", "science"] }),
  entry("pharmacist", "Фармацевт", "Pharmacist", "medicine", 25, 50000, 100000, { interests: ["medicine", "science"] }),
  entry("paramedic", "Фельдшер скорой помощи", "Paramedic", "medicine", 10, 50000, 95000, { avoidPenalties: { blood: -3, night_shifts: -2 } }),
  entry("veterinarian", "Ветеринар", "Veterinarian", "medicine", 14, 55000, 120000, { interests: ["medicine", "science", "people"] }),
  entry("medical-laboratory-tech", "Лаборант", "Medical Laboratory Technician", "medicine", 30, 40000, 75000, { interests: ["science", "medicine"] }),
  entry("radiology-technician", "Рентгенолог / лучевая диагностика", "Radiology Technician", "medicine", 22, 50000, 95000, { interests: ["medicine", "science"] }),
  entry("physiotherapist", "Физиотерапевт", "Physiotherapist", "medicine", 16, 45000, 90000, { interests: ["medicine", "sports", "people"] }),
  entry("psychologist", "Психолог", "Psychologist", "medicine", 20, 50000, 120000, { featured: true, interests: ["people", "medicine", "science"] }),
  entry("psychiatrist", "Психиатр", "Psychiatrist", "medicine", 12, 90000, 200000, { interests: ["medicine", "science"] }),
  entry("nutritionist", "Диетолог", "Nutritionist", "medicine", 28, 45000, 100000, { interests: ["medicine", "science", "people"] }),
  entry("midwife", "Акушерка", "Midwife", "medicine", 14, 50000, 95000, { interests: ["medicine", "people"] }),
  entry("dental-hygienist", "Гигиенист стоматологии", "Dental Hygienist", "medicine", 20, 40000, 80000, { interests: ["medicine", "people"] }),
  entry("optometrist", "Оптометрист", "Optometrist", "medicine", 18, 50000, 100000, { interests: ["medicine", "science"] }),
  entry("speech-therapist", "Логопед", "Speech Therapist", "medicine", 15, 40000, 85000, { interests: ["medicine", "people", "education"] }),
  entry("occupational-therapist", "Эрготерапевт", "Occupational Therapist", "medicine", 14, 45000, 90000, { interests: ["medicine", "people"] }),
  entry("surgeon-assistant", "Операционная медсестра", "Surgical Nurse", "medicine", 12, 55000, 100000, { avoidPenalties: { blood: -4 } }),
  entry("anesthesiologist", "Анестезиолог", "Anesthesiologist", "medicine", 10, 100000, 220000, { interests: ["medicine", "science"] }),
  entry("medical-receptionist", "Администратор клиники", "Medical Receptionist", "medicine", 35, 35000, 65000, { interests: ["people", "medicine"] }),

  // Creative (20)
  entry("graphic-designer", "Графический дизайнер", "Graphic Designer", "creative", 40, 50000, 110000, { interests: ["design", "creativity"] }),
  entry("illustrator", "Иллюстратор", "Illustrator", "creative", 38, 40000, 100000, { interests: ["design", "creativity", "drawing"] }),
  entry("animator", "Аниматор", "Animator", "creative", 42, 55000, 130000, { interests: ["creativity", "games", "design"] }),
  entry("photographer", "Фотограф", "Photographer", "creative", 35, 35000, 120000, { interests: ["creativity", "design"] }),
  entry("fashion-designer", "Дизайнер одежды", "Fashion Designer", "creative", 32, 45000, 130000, { interests: ["design", "creativity"] }),
  entry("interior-designer", "Дизайнер интерьера", "Interior Designer", "creative", 30, 55000, 140000, { interests: ["design", "engineering"] }),
  entry("architect", "Архитектор", "Architect", "creative", 25, 70000, 160000, { interests: ["design", "engineering", "math"] }),
  entry("landscape-architect", "Ландшафтный архитектор", "Landscape Architect", "creative", 22, 60000, 130000, { interests: ["design", "science"] }),
  entry("video-editor", "Видеомонтажёр", "Video Editor", "creative", 48, 45000, 110000, { interests: ["creativity", "marketing"] }),
  entry("sound-designer", "Звукорежиссёр", "Sound Designer", "creative", 35, 50000, 120000, { interests: ["music", "creativity"] }),
  entry("music-producer", "Музыкальный продюсер", "Music Producer", "creative", 40, 40000, 150000, { interests: ["music", "creativity"] }),
  entry("dancer", "Танцор / хореограф", "Dancer / Choreographer", "creative", 15, 30000, 100000, { interests: ["sports", "creativity", "music"] }),
  entry("actor", "Актёр", "Actor", "creative", 18, 25000, 200000, { interests: ["creativity", "people"] }),
  entry("art-director", "Арт-директор", "Art Director", "creative", 30, 80000, 180000, { interests: ["design", "marketing", "creativity"] }),
  entry("3d-artist", "3D-художник", "3D Artist", "creative", 45, 55000, 140000, { interests: ["design", "games", "creativity"] }),
  entry("content-creator", "Контент-мейкер", "Content Creator", "creative", 52, 40000, 120000, { featured: true, interests: ["creativity", "marketing"] }),
  entry("copywriter", "Копирайтер", "Copywriter", "creative", 55, 45000, 110000, { interests: ["creativity", "marketing", "languages"] }),
  entry("brand-designer", "Бренд-дизайнер", "Brand Designer", "creative", 38, 60000, 130000, { interests: ["design", "marketing"] }),
  entry("game-artist", "Художник игр", "Game Artist", "creative", 42, 60000, 150000, { interests: ["games", "design", "creativity"] }),
  entry("set-designer", "Художник-постановщик", "Set Designer", "creative", 20, 45000, 110000, { interests: ["creativity", "design"] }),

  // Engineering (18)
  entry("civil-engineer", "Инженер-строитель", "Civil Engineer", "engineering", 22, 70000, 140000, { interests: ["engineering", "math"] }),
  entry("mechanical-engineer", "Инженер-механик", "Mechanical Engineer", "engineering", 25, 75000, 150000, { interests: ["engineering", "math"] }),
  entry("electrical-engineer", "Инженер-электрик", "Electrical Engineer", "engineering", 28, 70000, 145000, { interests: ["engineering", "math"] }),
  entry("robotics-engineer", "Инженер по робототехнике", "Robotics Engineer", "engineering", 30, 90000, 180000, { interests: ["engineering", "code", "science"] }),
  entry("aerospace-engineer", "Инженер авиакосмической отрасли", "Aerospace Engineer", "engineering", 20, 90000, 200000, { interests: ["engineering", "science", "math"] }),
  entry("automotive-engineer", "Автомобильный инженер", "Automotive Engineer", "engineering", 32, 75000, 160000, { interests: ["engineering", "math"] }),
  entry("chemical-engineer", "Инженер-химик", "Chemical Engineer", "engineering", 24, 70000, 150000, { interests: ["science", "engineering"] }),
  entry("environmental-engineer", "Эколог-инженер", "Environmental Engineer", "engineering", 18, 60000, 130000, { interests: ["science", "engineering"] }),
  entry("industrial-engineer", "Инженер по организации производства", "Industrial Engineer", "engineering", 35, 65000, 130000, { interests: ["engineering", "business"] }),
  entry("surveying-engineer", "Инженер-геодезист", "Surveying Engineer", "engineering", 20, 55000, 110000, { interests: ["engineering", "math"] }),
  entry("energy-engineer", "Инженер энергетики", "Energy Engineer", "engineering", 26, 75000, 155000, { interests: ["engineering", "science"] }),
  entry("hvac-engineer", "Инженер ОВиК", "HVAC Engineer", "engineering", 30, 60000, 120000, { interests: ["engineering"] }),
  entry("quality-engineer", "Инженер по качеству", "Quality Engineer", "engineering", 40, 60000, 120000, { interests: ["engineering", "analytics"] }),
  entry("mining-engineer", "Горный инженер", "Mining Engineer", "engineering", 22, 80000, 170000, { interests: ["engineering", "science"] }),
  entry("marine-engineer", "Судовой инженер", "Marine Engineer", "engineering", 18, 70000, 150000, { interests: ["engineering"] }),
  entry("biomedical-engineer", "Биомедицинский инженер", "Biomedical Engineer", "engineering", 22, 80000, 160000, { interests: ["engineering", "medicine", "science"] }),
  entry("materials-engineer", "Инженер-материаловед", "Materials Engineer", "engineering", 24, 70000, 140000, { interests: ["science", "engineering"] }),
  entry("petroleum-engineer", "Инженер нефтегазовой отрасли", "Petroleum Engineer", "engineering", 28, 100000, 220000, { interests: ["engineering", "science"] }),

  // Business (20)
  entry("marketing-manager", "Digital-маркетолог", "Digital Marketing Manager", "business", 48, 60000, 130000, { featured: true, interests: ["marketing", "business"] }),
  entry("sales-manager", "Менеджер по продажам", "Sales Manager", "business", 42, 50000, 150000, { interests: ["business", "people"], avoidPenalties: { sales: -2 } }),
  entry("hr-specialist", "HR-специалист", "HR Specialist", "business", 38, 55000, 120000, { interests: ["people", "business"] }),
  entry("accountant", "Бухгалтер", "Accountant", "business", 55, 45000, 100000, { interests: ["math", "business", "analytics"] }),
  entry("financial-analyst", "Финансовый аналитик", "Financial Analyst", "business", 45, 70000, 150000, { interests: ["analytics", "business", "math"] }),
  entry("investment-analyst", "Инвестиционный аналитик", "Investment Analyst", "business", 40, 90000, 200000, { interests: ["business", "analytics", "math"] }),
  entry("project-manager", "Проектный менеджер", "Project Manager", "business", 35, 80000, 160000, { interests: ["business", "people"] }),
  entry("operations-manager", "Операционный менеджер", "Operations Manager", "business", 38, 70000, 140000, { interests: ["business", "analytics"] }),
  entry("logistics-manager", "Логист", "Logistics Manager", "business", 42, 55000, 120000, { interests: ["business", "engineering"] }),
  entry("supply-chain-specialist", "Специалист цепочки поставок", "Supply Chain Specialist", "business", 45, 60000, 130000, { interests: ["business", "analytics"] }),
  entry("entrepreneur", "Предприниматель", "Entrepreneur", "business", 30, 0, 500000, { interests: ["business", "marketing", "creativity"] }),
  entry("real-estate-agent", "Риелтор", "Real Estate Agent", "business", 35, 40000, 200000, { interests: ["business", "people", "sales"] }),
  entry("insurance-agent", "Страховой агент", "Insurance Agent", "business", 50, 40000, 120000, { interests: ["business", "people"] }),
  entry("bank-teller", "Специалист банка", "Bank Teller", "business", 60, 40000, 75000, { interests: ["business", "people"] }),
  entry("economist", "Экономист", "Economist", "business", 40, 60000, 130000, { interests: ["analytics", "business", "math"] }),
  entry("consultant", "Бизнес-консультант", "Business Consultant", "business", 35, 80000, 200000, { interests: ["business", "analytics", "people"] }),
  entry("event-manager", "Ивент-менеджер", "Event Manager", "business", 32, 45000, 110000, { interests: ["marketing", "people", "creativity"] }),
  entry("procurement-specialist", "Закупщик", "Procurement Specialist", "business", 48, 50000, 110000, { interests: ["business", "analytics"] }),
  entry("customer-success-manager", "Customer Success", "Customer Success Manager", "business", 40, 60000, 130000, { interests: ["people", "business"] }),
  entry("office-manager", "Офис-менеджер", "Office Manager", "business", 55, 40000, 80000, { interests: ["business", "people"], avoidPenalties: { routine: -1 } }),

  // Education (15)
  entry("teacher", "Учитель / педагог", "Teacher", "education", 22, 40000, 80000, { featured: true, interests: ["people", "education"] }),
  entry("school-principal", "Директор школы", "School Principal", "education", 15, 80000, 150000, { interests: ["people", "education", "business"] }),
  entry("tutor", "Репетитор", "Tutor", "education", 25, 30000, 120000, { interests: ["people", "education", "languages"] }),
  entry("university-lecturer", "Преподаватель вуза", "University Lecturer", "education", 18, 60000, 140000, { interests: ["science", "education", "people"] }),
  entry("kindergarten-teacher", "Воспитатель", "Kindergarten Teacher", "education", 20, 35000, 70000, { interests: ["people", "education"] }),
  entry("special-education-teacher", "Дефектолог", "Special Education Teacher", "education", 12, 45000, 90000, { interests: ["people", "education", "medicine"] }),
  entry("librarian", "Библиотекарь", "Librarian", "education", 30, 35000, 65000, { interests: ["languages", "education", "people"] }),
  entry("museum-educator", "Музейный педагог", "Museum Educator", "education", 18, 40000, 80000, { interests: ["education", "creativity", "people"] }),
  entry("career-counselor", "Профориентолог", "Career Counselor", "education", 22, 45000, 95000, { interests: ["people", "education", "business"] }),
  entry("sports-coach-school", "Тренер в школе", "School Sports Coach", "education", 15, 35000, 80000, { interests: ["sports", "education", "people"] }),
  entry("music-teacher", "Учитель музыки", "Music Teacher", "education", 18, 40000, 90000, { interests: ["music", "education", "people"] }),
  entry("art-teacher", "Учитель ИЗО", "Art Teacher", "education", 20, 38000, 75000, { interests: ["creativity", "education", "design"] }),
  entry("language-teacher", "Учитель иностранного языка", "Language Teacher", "education", 28, 40000, 95000, { interests: ["languages", "education", "people"] }),
  entry("edtech-specialist", "Специалист EdTech", "EdTech Specialist", "education", 35, 70000, 140000, { interests: ["education", "code", "creativity"] }),
  entry("school-psychologist", "Школьный психолог", "School Psychologist", "education", 18, 45000, 90000, { interests: ["people", "education", "medicine"] }),

  // Law (12)
  entry("lawyer", "Юрист", "Lawyer", "law", 20, 70000, 200000, { interests: ["law", "people", "languages"] }),
  entry("paralegal", "Помощник юриста", "Paralegal", "law", 35, 40000, 80000, { interests: ["law", "analytics"] }),
  entry("judge-assistant", "Судебный секретарь", "Court Clerk", "law", 25, 45000, 90000, { interests: ["law", "people"] }),
  entry("notary", "Нотариус", "Notary", "law", 18, 60000, 150000, { interests: ["law", "business"] }),
  entry("legal-consultant", "Юридический консультант", "Legal Consultant", "law", 22, 65000, 160000, { interests: ["law", "business"] }),
  entry("compliance-officer", "Комплаенс-специалист", "Compliance Officer", "law", 30, 70000, 150000, { interests: ["law", "business", "analytics"] }),
  entry("patent-attorney", "Патентный поверенный", "Patent Attorney", "law", 15, 90000, 220000, { interests: ["law", "science", "engineering"] }),
  entry("immigration-consultant", "Миграционный консультант", "Immigration Consultant", "law", 25, 50000, 120000, { interests: ["law", "languages", "people"] }),
  entry("mediator", "Медиатор", "Mediator", "law", 12, 55000, 130000, { interests: ["law", "people"] }),
  entry("prosecutor-assistant", "Помощник прокурора", "Prosecutor Assistant", "law", 15, 50000, 110000, { interests: ["law", "people"] }),
  entry("corporate-lawyer", "Корпоративный юрист", "Corporate Lawyer", "law", 18, 90000, 250000, { interests: ["law", "business"] }),
  entry("human-rights-advocate", "Правозащитник", "Human Rights Advocate", "law", 10, 40000, 100000, { interests: ["law", "people", "public"] }),

  // Trades (20)
  entry("electrician", "Электрик", "Electrician", "trades", 25, 50000, 120000, { interests: ["engineering"] }),
  entry("plumber", "Сантехник", "Plumber", "trades", 20, 45000, 110000, { interests: ["engineering"] }),
  entry("welder", "Сварщик", "Welder", "trades", 22, 50000, 115000, { interests: ["engineering"] }),
  entry("carpenter", "Плотник / столяр", "Carpenter", "trades", 18, 45000, 100000, { interests: ["engineering", "creativity"] }),
  entry("auto-mechanic", "Автомеханик", "Auto Mechanic", "trades", 28, 45000, 110000, { interests: ["engineering"] }),
  entry("hvac-technician", "Монтажник климатических систем", "HVAC Technician", "trades", 30, 50000, 115000, { interests: ["engineering"] }),
  entry("painter-decorator", "Маляр-штукатур", "Painter / Decorator", "trades", 15, 40000, 95000, { interests: ["creativity", "engineering"] }),
  entry("roofer", "Кровельщик", "Roofer", "trades", 12, 45000, 100000, { interests: ["engineering"] }),
  entry("mason", "Каменщик", "Mason", "trades", 10, 45000, 105000, { interests: ["engineering"] }),
  entry("locksmith", "Слесарь / замочник", "Locksmith", "trades", 25, 40000, 90000, { interests: ["engineering"] }),
  entry("elevator-technician", "Лифтёр", "Elevator Technician", "trades", 20, 55000, 120000, { interests: ["engineering"] }),
  entry("solar-installer", "Монтажник солнечных панелей", "Solar Panel Installer", "trades", 22, 50000, 115000, { interests: ["engineering", "science"] }),
  entry("drone-operator", "Оператор БПЛА", "Drone Operator", "trades", 35, 45000, 110000, { interests: ["engineering", "code"] }),
  entry("jeweler", "Ювелир", "Jeweler", "trades", 15, 45000, 130000, { interests: ["creativity", "design"] }),
  entry("tailor", "Портной", "Tailor", "trades", 20, 35000, 90000, { interests: ["creativity", "design"] }),
  entry("barber", "Барбер", "Barber", "trades", 12, 35000, 100000, { interests: ["people", "creativity"] }),
  entry("hairdresser", "Парикмахер", "Hairdresser", "trades", 15, 30000, 90000, { interests: ["people", "creativity"] }),
  entry("makeup-artist", "Визажист", "Makeup Artist", "trades", 25, 35000, 120000, { interests: ["creativity", "people"] }),
  entry("nail-technician", "Мастер маникюра", "Nail Technician", "trades", 20, 30000, 80000, { interests: ["creativity", "people"] }),
  entry("tattoo-artist", "Тату-мастер", "Tattoo Artist", "trades", 10, 40000, 150000, { interests: ["creativity", "design"] }),

  // Hospitality (15)
  entry("chef", "Шеф-повар", "Chef", "hospitality", 15, 50000, 150000, { interests: ["creativity", "people"] }),
  entry("cook", "Повар", "Cook", "hospitality", 18, 35000, 80000, { interests: ["people"] }),
  entry("bartender", "Бармен", "Bartender", "hospitality", 20, 30000, 90000, { interests: ["people", "creativity"] }),
  entry("barista", "Бариста", "Barista", "hospitality", 25, 28000, 65000, { interests: ["people"] }),
  entry("hotel-manager", "Менеджер отеля", "Hotel Manager", "hospitality", 22, 55000, 130000, { interests: ["business", "people", "languages"] }),
  entry("concierge", "Консьерж", "Concierge", "hospitality", 18, 35000, 80000, { interests: ["people", "languages"] }),
  entry("tour-guide", "Гид", "Tour Guide", "hospitality", 12, 30000, 80000, { interests: ["languages", "people", "travel"] }),
  entry("travel-agent", "Турагент", "Travel Agent", "hospitality", 40, 35000, 90000, { interests: ["travel", "people", "business"] }),
  entry("flight-attendant", "Бортпроводник", "Flight Attendant", "hospitality", 25, 50000, 120000, { interests: ["travel", "people", "languages"] }),
  entry("restaurant-manager", "Управляющий рестораном", "Restaurant Manager", "hospitality", 28, 50000, 120000, { interests: ["business", "people"] }),
  entry("sommelier", "Сомелье", "Sommelier", "hospitality", 15, 45000, 110000, { interests: ["people", "creativity"] }),
  entry("pastry-chef", "Кондитер", "Pastry Chef", "hospitality", 18, 40000, 100000, { interests: ["creativity", "people"] }),
  entry("housekeeper", "Горничная / хозяйственный сервис", "Housekeeper", "hospitality", 35, 25000, 55000, { interests: ["people"] }),
  entry("catering-manager", "Кейтеринг-менеджер", "Catering Manager", "hospitality", 25, 45000, 110000, { interests: ["business", "people", "creativity"] }),
  entry("host-hostess", "Хостес", "Host / Hostess", "hospitality", 30, 28000, 60000, { interests: ["people"] }),

  // Media (15)
  entry("journalist", "Журналист", "Journalist", "media", 35, 40000, 120000, { interests: ["languages", "creativity", "people"] }),
  entry("editor", "Редактор", "Editor", "media", 40, 45000, 110000, { interests: ["languages", "creativity"] }),
  entry("pr-manager", "PR-менеджер", "PR Manager", "media", 32, 55000, 140000, { interests: ["marketing", "people", "languages"] }),
  entry("smm-manager", "SMM-менеджер", "SMM Manager", "media", 45, 45000, 110000, { interests: ["marketing", "creativity"] }),
  entry("podcaster", "Подкастер", "Podcaster", "media", 40, 30000, 150000, { interests: ["creativity", "marketing", "music"] }),
  entry("radio-host", "Радиоведущий", "Radio Host", "media", 30, 40000, 100000, { interests: ["music", "people", "creativity"] }),
  entry("tv-producer", "Телепродюсер", "TV Producer", "media", 28, 60000, 150000, { interests: ["creativity", "business", "media"] }),
  entry("news-anchor", "Телеведущий новостей", "News Anchor", "media", 25, 70000, 200000, { interests: ["languages", "people"] }),
  entry("translator", "Переводчик", "Translator", "media", 55, 45000, 120000, { interests: ["languages", "people"] }),
  entry("interpreter", "Устный переводчик", "Interpreter", "media", 40, 50000, 130000, { interests: ["languages", "people"] }),
  entry("fact-checker", "Фактчекер", "Fact Checker", "media", 35, 40000, 90000, { interests: ["languages", "analytics", "science"] }),
  entry("media-planner", "Медиапланер", "Media Planner", "media", 42, 50000, 120000, { interests: ["marketing", "analytics"] }),
  entry("documentary-filmmaker", "Документалист", "Documentary Filmmaker", "media", 20, 35000, 120000, { interests: ["creativity", "people"] }),
  entry("social-media-analyst", "Аналитик соцсетей", "Social Media Analyst", "media", 48, 50000, 115000, { interests: ["marketing", "analytics"] }),
  entry("influencer-manager", "Менеджер блогеров", "Influencer Manager", "media", 38, 45000, 130000, { interests: ["marketing", "business", "creativity"] }),

  // Science (15)
  entry("biologist", "Биолог", "Biologist", "science", 15, 50000, 120000, { interests: ["science", "medicine"] }),
  entry("chemist", "Химик", "Chemist", "science", 18, 55000, 130000, { interests: ["science", "math"] }),
  entry("physicist", "Физик", "Physicist", "science", 12, 60000, 150000, { interests: ["science", "math"] }),
  entry("ecologist", "Эколог", "Ecologist", "science", 14, 45000, 100000, { interests: ["science", "engineering"] }),
  entry("geologist", "Геолог", "Geologist", "science", 16, 60000, 140000, { interests: ["science", "engineering"] }),
  entry("meteorologist", "Метеоролог", "Meteorologist", "science", 25, 50000, 110000, { interests: ["science", "math"] }),
  entry("archaeologist", "Археолог", "Archaeologist", "science", 8, 40000, 100000, { interests: ["science", "history"] }),
  entry("research-assistant", "Научный ассистент", "Research Assistant", "science", 20, 35000, 75000, { interests: ["science", "analytics"] }),
  entry("lab-technician", "Лаборант (наука)", "Lab Technician", "science", 28, 40000, 85000, { interests: ["science"] }),
  entry("statistician", "Статистик", "Statistician", "science", 35, 60000, 140000, { interests: ["math", "science", "analytics"] }),
  entry("astronomer", "Астроном", "Astronomer", "science", 10, 55000, 130000, { interests: ["science", "math"] }),
  entry("marine-biologist", "Морской биолог", "Marine Biologist", "science", 12, 50000, 120000, { interests: ["science", "medicine"] }),
  entry("forensic-scientist", "Криминалист", "Forensic Scientist", "science", 15, 55000, 130000, { interests: ["science", "law"] }),
  entry("agronomist", "Агроном", "Agronomist", "science", 18, 45000, 100000, { interests: ["science", "engineering"] }),
  entry("food-scientist", "Пищевой технолог", "Food Scientist", "science", 22, 50000, 115000, { interests: ["science", "medicine"] }),

  // Public / safety (12)
  entry("firefighter", "Пожарный", "Firefighter", "public", 8, 45000, 95000, { interests: ["people", "sports"], avoidPenalties: { night_shifts: -1 } }),
  entry("police-officer", "Полицейский", "Police Officer", "public", 10, 50000, 110000, { interests: ["people", "law", "sports"] }),
  entry("military-officer", "Военный офицер", "Military Officer", "public", 5, 55000, 130000, { interests: ["sports", "people"] }),
  entry("social-worker", "Социальный работник", "Social Worker", "public", 12, 40000, 85000, { interests: ["people", "medicine"] }),
  entry("urban-planner", "Градостроитель", "Urban Planner", "public", 18, 60000, 130000, { interests: ["engineering", "design", "people"] }),
  entry("civil-servant", "Государственный служащий", "Civil Servant", "public", 25, 45000, 100000, { interests: ["law", "people"], lifestyle: ["stability"] }),
  entry("diplomat", "Дипломат", "Diplomat", "public", 10, 70000, 180000, { interests: ["languages", "law", "people"] }),
  entry("customs-officer", "Таможенник", "Customs Officer", "public", 30, 45000, 95000, { interests: ["law", "analytics"] }),
  entry("emergency-dispatcher", "Диспетчер экстренных служб", "Emergency Dispatcher", "public", 40, 40000, 75000, { interests: ["people"] }),
  entry("security-guard", "Специалист безопасности", "Security Specialist", "public", 35, 40000, 90000, { interests: ["people", "sports"] }),
  entry("lifeguard", "Спасатель на воде", "Lifeguard", "public", 8, 28000, 65000, { interests: ["sports", "people", "medicine"] }),
  entry("park-ranger", "Егерь / заповедник", "Park Ranger", "public", 10, 40000, 85000, { interests: ["science", "sports"] }),

  // Sports (10)
  entry("professional-athlete", "Профессиональный спортсмен", "Professional Athlete", "sports", 5, 30000, 500000, { interests: ["sports"] }),
  entry("fitness-trainer", "Фитнес-тренер", "Fitness Trainer", "sports", 18, 35000, 120000, { interests: ["sports", "people", "medicine"] }),
  entry("sports-physiotherapist", "Спортивный реабилитолог", "Sports Physiotherapist", "sports", 14, 50000, 120000, { interests: ["sports", "medicine"] }),
  entry("sports-journalist", "Спортивный журналист", "Sports Journalist", "sports", 30, 40000, 110000, { interests: ["sports", "marketing", "languages"] }),
  entry("sports-manager", "Спортивный менеджер", "Sports Manager", "sports", 20, 55000, 150000, { interests: ["sports", "business", "people"] }),
  entry("yoga-instructor", "Инструктор йоги", "Yoga Instructor", "sports", 15, 30000, 90000, { interests: ["sports", "people", "medicine"] }),
  entry("referee", "Судья соревнований", "Sports Referee", "sports", 12, 35000, 100000, { interests: ["sports", "people"] }),
  entry("esports-player", "Киберспортсмен", "Esports Player", "sports", 25, 25000, 300000, { interests: ["games", "sports"] }),
  entry("sports-nutritionist", "Спортивный нутрициолог", "Sports Nutritionist", "sports", 22, 45000, 110000, { interests: ["sports", "medicine", "science"] }),
  entry("climbing-instructor", "Инструктор скалолазания", "Climbing Instructor", "sports", 10, 35000, 90000, { interests: ["sports", "people"] }),
];

const GENERATED = expandProfessions(BASE_PROFESSIONS, entry, TARGET_TOTAL);
const PROFESSIONS = [...BASE_PROFESSIONS, ...GENERATED];

console.log(
  `Catalog: ${BASE_PROFESSIONS.length} base + ${GENERATED.length} generated = ${PROFESSIONS.length} total`
);

const CATEGORY_TEMPLATES = {
  ru: {
    it: {
      summary: (t) => `${t} создаёт и поддерживает цифровые продукты: код, данные, интерфейсы или инфраструктуру.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: учи основы уже сейчас; pet-проекты — 14–17; стажировки и работа — чаще 17–20+.`,
      ai: "AI ускоряет рутину, но ответственность за архитектуру, безопасность и решения остаётся за человеком.",
      day: ["Проверка задач и почты", "Созвон с командой", "Основная разработка / анализ", "Code review или тесты", "Документация", "План на завтра"],
      roadmap: ["Основы профессии", "Инструменты отрасли", "Практика на проекте", "Портфолио", "Командная работа", "Собеседования"],
    },
    medicine: {
      summary: (t) => `${t} помогает людям сохранять здоровье: диагностика, уход, лечение или профилактика.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: биология и первая помощь сейчас; обучение — после 9–11 класса; практика — в процессе учёбы.`,
      ai: "Физический контакт и ответственность за жизнь плохо заменяются; AI помогает с документацией.",
      day: ["Подготовка смены", "Приём пациентов / процедуры", "Консультации", "Документация", "Синк с коллегами", "Конец смены"],
      roadmap: ["Биология и химия", "Профильное обучение", "Практика", "Этика", "Стрессоустойчивость", "Специализация"],
    },
    creative: {
      summary: (t) => `${t} создаёт визуальный, аудио или медиаконтент для брендов, людей или развлечений.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: портфолио можно собирать с 14–16; заказы и стажировки — с 16–18.`,
      ai: "AI генерирует черновики, но вкус, бренд и уникальный стиль — твоё преимущество.",
      day: ["Бриф и идеи", "Создание / съёмка", "Правки", "Согласование с клиентом", "Публикация / сдача", "Обучение трендам"],
      roadmap: ["Инструменты", "Композиция", "Портфолио", "Нетворкинг", "Личный стиль", "Монетизация"],
    },
    engineering: {
      summary: (t) => `${t} проектирует, строит или обслуживает технические системы и оборудование.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: физика и математика сейчас; техникум/вуз — после 9–11; практика — на производстве.`,
      ai: "Рутинные расчёты автоматизируются; ответственность за безопасность конструкций — за инженером.",
      day: ["План работ", "Расчёты / чертежи", "Обход объекта", "Согласование", "Контроль качества", "Отчёт"],
      roadmap: ["Математика и физика", "Техническое образование", "Стажировка", "Нормативы", "CAD/инструменты", "Сертификация"],
    },
    business: {
      summary: (t) => `${t} помогает компаниям зарабатывать, расти и управлять процессами и людьми.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: мини-проекты и стажировки с 16–18; карьера — после школы или параллельно с вузом.`,
      ai: "Отчёты и тексты ускоряются AI; переговоры, этика и стратегия — за человеком.",
      day: ["Метрики и почта", "Встречи", "Анализ / план", "Работа с клиентом", "Отчёт", "Планирование"],
      roadmap: ["Бизнес-основы", "Excel/аналитика", "Коммуникация", "Стажировка", "Кейсы", "Специализация"],
    },
    education: {
      summary: (t) => `${t} обучает, развивает и поддерживает учеников в школе, вузе или онлайн.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: репетиторство с 15–16; педагогическое образование — после 11 класса.`,
      ai: "AI помогает с материалами; мотивация и эмпатия в классе — за педагогом.",
      day: ["Подготовка урока", "Занятия", "Проверка работ", "Консультации", "Методсовет", "План"],
      roadmap: ["Предмет", "Педагогика", "Практика", "Цифровые tools", "Коммуникация", "Лицензия"],
    },
    law: {
      summary: (t) => `${t} работает с законами, правами и юридическими документами для людей и бизнеса.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: олимпиады и курсы права с 15–16; вуз — после 11; практика — с 3 курса.`,
      ai: "Поиск прецедентов ускоряется; ответственность за решение и этику — за юристом.",
      day: ["Почта и дедлайны", "Документы", "Консультация", "Суд/переговоры", "Исследование", "Отчёт клиенту"],
      roadmap: ["Право база", "Вуз", "Стажировка", "Ораторство", "Специализация", "Экзамены"],
    },
    trades: {
      summary: (t) => `${t} выполняет практическую работу руками: монтаж, ремонт, изготовление или сервис.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: курсы и практика с 16–18; мастерство — годы практики.`,
      ai: "Рутинные замеры частично автоматизируются; качество работы на объекте — за мастером.",
      day: ["Инструменты и план", "Выезд / цех", "Основная работа", "Приёмка", "Уборка", "Отчёт"],
      roadmap: ["Техника безопасности", "Курс/ученичество", "Практика", "Инструменты", "Скорость", "Свой бизнес"],
    },
    hospitality: {
      summary: (t) => `${t} создаёт гостеприимство: еда, напитки, отдых и сервис для гостей.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: подработка с 16–18; карьера — после курсов или колледжа.`,
      ai: "Заказы и учёт ускоряются; вкус, сервис и атмосфера — человеческие навыки.",
      day: ["Подготовка зала/кухни", "Смена пик", "Сервис гостей", "Инвентаризация", "Уборка", "Разбор смены"],
      roadmap: ["Гигиена и ТБ", "Базовые навыки", "Стажировка", "Скорость", "Языки", "Управление"],
    },
    media: {
      summary: (t) => `${t} создаёт и распространяет информацию, истории и контент для аудитории.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: школьная газета/блог сейчас; стажировки — с 16–18.`,
      ai: "Черновики и монтаж ускоряются; фактчекинг и голос автора — важны.",
      day: ["Новости и план", "Интервью/съёмка", "Монтаж/текст", "Публикация", "Аналитика", "Идеи"],
      roadmap: ["Письмо/речь", "Инструменты", "Портфолио", "Нетворкинг", "Ниша", "Медиакит"],
    },
    science: {
      summary: (t) => `${t} исследует природу, данные и закономерности для науки, медицины или промышленности.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: олимпиады и лаборатории с 14–16; вуз — после 11; НИР — с бакалавриата.`,
      ai: "Обработка данных ускоряется; постановка гипотез и интерпретация — за учёным.",
      day: ["Литература", "Эксперимент", "Замеры", "Анализ", "Статья/отчёт", "Семинар"],
      roadmap: ["Математика", "Профильные предметы", "Вуз", "Лаборатория", "Статистика", "Публикации"],
    },
    public: {
      summary: (t) => `${t} служит обществу: безопасность, порядок, социальная помощь или госуправление.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: волонтёрство и спорт сейчас; служба/вуз — по выбранному пути после 18.`,
      ai: "Документооборот ускоряется; решения на месте и ответственность — за человеком.",
      day: ["Построение", "Патруль/смена", "Инциденты", "Отчёты", "Обучение", "Отдых"],
      roadmap: ["Физподготовка", "Право база", "Экзамены", "Служба/вуз", "Стресс", "Специализация"],
    },
    sports: {
      summary: (t) => `${t} связан со спортом: тренировки, соревнования, здоровье или медиа о спорте.`,
      timing: (t) => `Тебе {age} лет, {stageLabel}: секции сейчас; профуровень — годы тренировок; тренер — после курсов 18+.`,
      ai: "Аналитика тренировок помогает AI; мотивация и техника на площадке — за человеком.",
      day: ["Разминка", "Тренировка", "Теория/видео", "Восстановление", "Соревнование/клиент", "План"],
      roadmap: ["Базовая техника", "Режим", "Теория", "Сертификат", "Портфолио", "Ниша"],
    },
  },
  en: {
    it: {
      summary: (t) => `${t} builds and maintains digital products: code, data, interfaces, or infrastructure.`,
      timing: (t) => `At {age}, {stageLabel}: learn basics now; pet projects 14–17; internships often 17–20+.`,
      ai: "AI speeds up routine work; architecture, security, and decisions stay human.",
      day: ["Check tasks and inbox", "Team sync", "Core dev / analysis", "Review or tests", "Documentation", "Plan tomorrow"],
      roadmap: ["Role fundamentals", "Industry tools", "Project practice", "Portfolio", "Teamwork", "Interviews"],
    },
    medicine: {
      summary: (t) => `${t} helps people stay healthy through care, diagnosis, treatment, or prevention.`,
      timing: (t) => `At {age}, {stageLabel}: biology and first aid now; training after secondary school; practice during study.`,
      ai: "Physical care and life responsibility are hard to automate; AI helps with paperwork.",
      day: ["Shift prep", "Patients / procedures", "Consultations", "Documentation", "Team sync", "End of shift"],
      roadmap: ["Biology & chemistry", "Professional training", "Clinical practice", "Ethics", "Resilience", "Specialization"],
    },
    creative: {
      summary: (t) => `${t} creates visual, audio, or media content for brands, people, or entertainment.`,
      timing: (t) => `At {age}, {stageLabel}: portfolio from 14–16; paid work and internships from 16–18.`,
      ai: "AI drafts assets; taste, brand, and unique style remain yours.",
      day: ["Brief and ideas", "Create / shoot", "Revisions", "Client approval", "Publish / deliver", "Learn trends"],
      roadmap: ["Tools", "Composition", "Portfolio", "Networking", "Personal style", "Monetization"],
    },
    engineering: {
      summary: (t) => `${t} designs, builds, or maintains technical systems and equipment.`,
      timing: (t) => `At {age}, {stageLabel}: math and physics now; college/university after grades 9–11; practice on site.`,
      ai: "Routine calculations automate; safety of real-world builds stays with engineers.",
      day: ["Work plan", "Calculations / drawings", "Site walk", "Coordination", "Quality check", "Report"],
      roadmap: ["Math & physics", "Technical education", "Internship", "Standards", "CAD/tools", "Certification"],
    },
    business: {
      summary: (t) => `${t} helps companies earn, grow, and manage processes and people.`,
      timing: (t) => `At {age}, {stageLabel}: mini-projects and internships 16–18; career after school or with university.`,
      ai: "Reports and copy speed up with AI; negotiation, ethics, and strategy stay human.",
      day: ["Metrics and inbox", "Meetings", "Analysis / plan", "Client work", "Report", "Planning"],
      roadmap: ["Business basics", "Excel/analytics", "Communication", "Internship", "Case studies", "Specialization"],
    },
    education: {
      summary: (t) => `${t} teaches, develops, and supports learners in school, university, or online.`,
      timing: (t) => `At {age}, {stageLabel}: tutoring from 15–16; teaching degree after grade 11.`,
      ai: "AI helps with materials; motivation and empathy in class stay with the teacher.",
      day: ["Lesson prep", "Classes", "Grading", "Office hours", "Staff meeting", "Plan"],
      roadmap: ["Subject mastery", "Pedagogy", "Practice", "Digital tools", "Communication", "License"],
    },
    law: {
      summary: (t) => `${t} works with laws, rights, and legal documents for people and business.`,
      timing: (t) => `At {age}, {stageLabel}: law clubs from 15–16; university after grade 11; practice from year 3.`,
      ai: "Case search speeds up; judgment and ethics stay with the lawyer.",
      day: ["Inbox and deadlines", "Documents", "Consultation", "Court / negotiation", "Research", "Client report"],
      roadmap: ["Law basics", "University", "Internship", "Public speaking", "Specialization", "Exams"],
    },
    trades: {
      summary: (t) => `${t} does hands-on work: installation, repair, crafting, or service.`,
      timing: (t) => `At {age}, {stageLabel}: courses and practice from 16–18; mastery takes years on the job.`,
      ai: "Some measurements automate; quality on site stays with the craftsperson.",
      day: ["Tools and plan", "Site / shop", "Main work", "Handover", "Cleanup", "Report"],
      roadmap: ["Safety", "Apprenticeship", "Practice", "Tools", "Speed", "Own business"],
    },
    hospitality: {
      summary: (t) => `${t} delivers hospitality: food, drinks, stays, and guest service.`,
      timing: (t) => `At {age}, {stageLabel}: part-time from 16–18; career after courses or college.`,
      ai: "Orders and inventory speed up; taste, service, and atmosphere stay human.",
      day: ["Prep floor/kitchen", "Peak service", "Guest care", "Inventory", "Cleanup", "Shift debrief"],
      roadmap: ["Hygiene & safety", "Core skills", "Internship", "Speed", "Languages", "Management"],
    },
    media: {
      summary: (t) => `${t} creates and spreads information, stories, and content for audiences.`,
      timing: (t) => `At {age}, {stageLabel}: school paper/blog now; internships from 16–18.`,
      ai: "Drafts and edits speed up; fact-checking and author voice matter.",
      day: ["News and plan", "Interview/shoot", "Edit/write", "Publish", "Analytics", "Ideas"],
      roadmap: ["Writing/speech", "Tools", "Portfolio", "Networking", "Niche", "Media kit"],
    },
    science: {
      summary: (t) => `${t} researches nature, data, and patterns for science, medicine, or industry.`,
      timing: (t) => `At {age}, {stageLabel}: olympiads and labs from 14–16; university after grade 11.`,
      ai: "Data processing speeds up; hypotheses and interpretation stay human.",
      day: ["Literature", "Experiment", "Measurements", "Analysis", "Paper/report", "Seminar"],
      roadmap: ["Mathematics", "Core subjects", "University", "Lab work", "Statistics", "Publications"],
    },
    public: {
      summary: (t) => `${t} serves society: safety, order, social help, or public administration.`,
      timing: (t) => `At {age}, {stageLabel}: volunteering and sport now; service/university path after 18.`,
      ai: "Paperwork speeds up; on-the-ground decisions and duty stay human.",
      day: ["Briefing", "Patrol/shift", "Incidents", "Reports", "Training", "Rest"],
      roadmap: ["Fitness", "Law basics", "Exams", "Service/university", "Stress skills", "Specialization"],
    },
    sports: {
      summary: (t) => `${t} is tied to sport: training, competition, health, or sports media.`,
      timing: (t) => `At {age}, {stageLabel}: clubs now; pro level takes years; coach path often 18+ after courses.`,
      ai: "Training analytics help with AI; motivation and technique stay human.",
      day: ["Warm-up", "Training", "Theory/video", "Recovery", "Event/client", "Plan"],
      roadmap: ["Technique", "Routine", "Theory", "Certificate", "Portfolio", "Niche"],
    },
  },
};

const TIMES = ["08:00", "10:00", "12:30", "14:30", "16:30", "18:30"];

function buildLocaleContent(seed, lang) {
  const tpl = CATEGORY_TEMPLATES[lang][seed.category];
  const title = seed.title[lang];
  return {
    summary: tpl.summary(title),
    timing: tpl.timing(title),
    ai_risk_explanation: tpl.ai,
    day_timeline: tpl.day.map((activity, i) => ({ time: TIMES[i], activity })),
    roadmap: tpl.roadmap.map((skill, i) => ({
      skill,
      months: 1 + (i % 4) * 2,
      first_step:
        lang === "ru"
          ? `Первый шаг по «${skill}» для ${title}`
          : `First step in ${skill} for ${title}`,
    })),
  };
}

function buildCatalogEntry(seed) {
  return {
    ...seed,
    locales: {
      ru: buildLocaleContent(seed, "ru"),
      en: buildLocaleContent(seed, "en"),
    },
  };
}

const catalog = {
  version: 1,
  generated_at: new Date().toISOString(),
  count: PROFESSIONS.length,
  professions: PROFESSIONS.map(buildCatalogEntry),
};

const index = {
  version: 1,
  count: PROFESSIONS.length,
  professions: PROFESSIONS.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    ai_risk_percent: p.ai_risk_percent,
    salaryBase: p.salaryBase,
    featured: p.featured,
  })),
};

fs.mkdirSync(DATA_DIR, { recursive: true });
const seedPath = path.join(DATA_DIR, "professions-seed.json");
fs.writeFileSync(
  seedPath,
  JSON.stringify({ version: 1, count: PROFESSIONS.length, professions: PROFESSIONS }, null, 2)
);
fs.writeFileSync(
  path.join(DATA_DIR, "professions.json"),
  JSON.stringify(catalog, null, 2)
);
fs.writeFileSync(
  path.join(DATA_DIR, "professions-index.json"),
  JSON.stringify(index, null, 2)
);

console.log(`Wrote ${PROFESSIONS.length} professions to src/data/`);
