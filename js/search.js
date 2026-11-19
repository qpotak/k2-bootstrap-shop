// Глобальный поиск по сайту: блюда, услуги, страницы и разделы.
// Индекс собирается из DISHES (js/dishes.js), SERVICES (js/services-data.js) и списка ниже.

const SEARCH_PAGES = [
  {
    title: "Главная",
    url: "index.html",
    tag: "Страница",
    text: "Ресторан «Золотой колос»: домашняя кухня, доставка на дом, меню и услуги.",
    keywords: "главная ресторан доставка домой",
  },
  {
    title: "Меню",
    url: "menu.html",
    tag: "Страница",
    text: "15 блюд: закуски, супы, горячее, десерты и напитки. Цены, состав и корзина.",
    keywords: "меню блюда цены корзина заказ",
  },
  {
    title: "Услуги",
    url: "services.html",
    tag: "Страница",
    text: "12 услуг: праздники, банкеты, свадьбы, фуршеты, кейтеринг и мастер-классы.",
    keywords: "услуги праздник банкет заявка",
  },
  {
    title: "О нас",
    url: "about.html",
    tag: "Страница",
    text: "История ресторана с 2015 года, команда, ценности и принципы кухни.",
    keywords: "о нас история команда шеф кухня",
  },
  {
    title: "Контакты",
    url: "contacts.html",
    tag: "Страница",
    text: "Адрес, телефон, часы работы, карта и частые вопросы.",
    keywords: "контакты адрес телефон карта время работы",
  },
  {
    title: "Корзина",
    url: "cart.html",
    tag: "Страница",
    text: "Оформление заказа: доставка, оплата картой или наличными.",
    keywords: "корзина заказ оплата доставка",
  },
  {
    title: "Почему выбирают нас",
    url: "index.html#why",
    tag: "Раздел",
    text: "Свежие продукты, доставка на дом и удобная оплата.",
    keywords: "преимущества продукты доставка оплата",
  },
  {
    title: "Разделы меню",
    url: "index.html#cats",
    tag: "Раздел",
    text: "Закуски, супы, горячее, десерты и напитки.",
    keywords: "категории закуски супы горячее десерты напитки",
  },
  {
    title: "Хиты меню",
    url: "index.html#hits",
    tag: "Раздел",
    text: "Борщ, карбонара, тирамису и стейк рибай — блюда, которые заказывают чаще всего.",
    keywords: "хиты популярные борщ карбонара тирамису рибай",
  },
  {
    title: "Отзывы гостей",
    url: "index.html#reviews",
    tag: "Раздел",
    text: "Оценки и отзывы посетителей ресторана.",
    keywords: "отзывы гости рейтинг",
  },
  {
    title: "Наши ценности",
    url: "about.html#values",
    tag: "Раздел",
    text: "Сезонные продукты, ручная работа и гостеприимство.",
    keywords: "ценности сезонность качество гостеприимство",
  },
  {
    title: "История в датах",
    url: "about.html#history",
    tag: "Раздел",
    text: "Ключевые события ресторана с 2015 по 2026 год.",
    keywords: "история даты 2015 2026 события",
  },
  {
    title: "Как мы готовим",
    url: "about.html#process",
    tag: "Раздел",
    text: "Четыре шага от фермерских продуктов до подачи на стол.",
    keywords: "готовим кухня процесс продукты подача",
  },
  {
    title: "Частые вопросы",
    url: "contacts.html#faq",
    tag: "Раздел",
    text: "Как оформить заказ, когда работает доставка и какие способы оплаты.",
    keywords: "вопросы заказ доставка оплата",
  },
];

const SEARCH_GROUP_ORDER = { "Блюда": 0, "Услуги": 1, "Страницы и разделы": 2 };

function searchNormalize(value) {
  return String(value).toLowerCase().replace(/ё/g, "е");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchIndex() {
  const entries = [];
  DISHES.forEach((d) => {
    entries.push({
      group: "Блюда",
      title: d.name,
      tag: CATEGORIES[d.cat],
      text: `${CATEGORIES[d.cat]} · ${formatPrice(d.price)} · ${d.weight}. ${d.desc}`,
      url: `menu.html?q=${encodeURIComponent(d.name)}`,
      keywords: `${d.ingr} ${CATEGORIES[d.cat]}`,
    });
  });
  SERVICES.forEach((s) => {
    entries.push({
      group: "Услуги",
      title: s.name,
      tag: "Услуга",
      text: `${s.price}. ${s.desc}`,
      url: `services.html#svc-${s.id}`,
      keywords: s.keywords,
    });
  });
  SEARCH_PAGES.forEach((p) => {
    entries.push({ group: "Страницы и разделы", ...p });
  });
  return entries;
}

const SEARCH_INDEX = buildSearchIndex();
const searchForm = document.getElementById("siteSearchForm");
const searchInput = document.getElementById("siteSearchInput");
const searchMeta = document.getElementById("searchMeta");
const searchResults = document.getElementById("searchResults");
const searchPopular = document.getElementById("searchPopular");

function highlightMatch(text, tokens) {
  if (!tokens.length) return escapeHtml(text);
  const pattern = new RegExp("(" + tokens.map(escapeRegExp).join("|") + ")", "gi");
  return String(text)
    .split(pattern)
    .map((part, i) => (i % 2 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
    .join("");
}

function searchScore(entry, normalizedQuery, tokens) {
  const title = searchNormalize(entry.title);
  const haystack = searchNormalize(`${entry.title} ${entry.text} ${entry.keywords || ""}`);
  if (!tokens.every((t) => haystack.includes(t))) return -1;
  let score = 0;
  if (title === normalizedQuery) score += 200;
  else if (title.startsWith(normalizedQuery)) score += 120;
  else if (title.includes(normalizedQuery)) score += 80;
  tokens.forEach((t) => { if (title.includes(t)) score += 20; });
  return score + Math.max(0, 20 - entry.title.length / 5);
}

function renderSearch(rawQuery) {
  const query = rawQuery.trim();
  const tokens = searchNormalize(query).split(/\s+/).filter(Boolean);
  searchPopular.classList.toggle("d-none", Boolean(query));

  if (!tokens.length) {
    searchMeta.textContent = "Введите запрос — поиск ищет по блюдам, услугам и разделам сайта.";
    searchResults.innerHTML = "";
    return;
  }

  const found = SEARCH_INDEX
    .map((entry) => ({ entry, score: searchScore(entry, searchNormalize(query), tokens) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || SEARCH_GROUP_ORDER[a.entry.group] - SEARCH_GROUP_ORDER[b.entry.group]);

  searchMeta.textContent = found.length
    ? `Найдено: ${found.length}. Запрос: «${query}».`
    : `По запросу «${query}» ничего не найдено.`;

  if (!found.length) {
    searchResults.innerHTML = '<div class="alert alert-warning mb-0">Попробуйте другое слово или выберите популярный запрос выше.</div>';
    return;
  }

  const grouped = {};
  found.forEach(({ entry }) => {
    (grouped[entry.group] = grouped[entry.group] || []).push(entry);
  });

  searchResults.innerHTML = Object.entries(grouped)
    .sort((a, b) => SEARCH_GROUP_ORDER[a[0]] - SEARCH_GROUP_ORDER[b[0]])
    .map(([group, items]) => `
      <section class="search-group" aria-label="${escapeHtml(group)}">
        <h2 class="h5 mb-3">${escapeHtml(group)} <span class="badge text-bg-secondary">${items.length}</span></h2>
        <div class="list-group shadow-sm">
          ${items.map((entry) => `
            <a class="list-group-item list-group-item-action search-hit py-3" href="${entry.url}">
              <div class="d-flex flex-wrap justify-content-between align-items-baseline gap-2">
                <span class="fw-semibold">${highlightMatch(entry.title, tokens)}</span>
                <span class="badge bg-body-secondary text-body border">${escapeHtml(entry.tag)}</span>
              </div>
              <div class="small text-body-secondary mt-1">${highlightMatch(entry.text, tokens)}</div>
            </a>`).join("")}
        </div>
      </section>`)
    .join("");
}

function syncSearchUrl(push) {
  const url = new URL(location.href);
  const query = searchInput.value.trim();
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  history[push ? "pushState" : "replaceState"]({}, "", url);
}

let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    syncSearchUrl(false);
    renderSearch(searchInput.value);
  }, 120);
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearTimeout(searchTimer);
  syncSearchUrl(true);
  renderSearch(searchInput.value);
  searchInput.focus();
});

searchPopular.addEventListener("click", (event) => {
  const chip = event.target.closest("[data-q]");
  if (!chip) return;
  searchInput.value = chip.dataset.q;
  syncSearchUrl(true);
  renderSearch(searchInput.value);
  searchInput.focus();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    searchInput.value = "";
    syncSearchUrl(false);
    renderSearch("");
  }
});

const initialQuery = new URLSearchParams(location.search).get("q") || "";
if (initialQuery) searchInput.value = initialQuery;
renderSearch(initialQuery);
