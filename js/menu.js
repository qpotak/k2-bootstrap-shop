// Страница меню: фильтр по категориям, поиск, карточки, модальное окно «Подробнее».

const grid = document.getElementById("dishGrid");
const filterBox = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const counter = document.getElementById("dishCount");
const sortSelect = document.getElementById("sortSelect");
let currentCat = "all";

/* Избранное (localStorage) */
const FAV_KEY = "restaurant-fav";
function getFav() { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; } }
function toggleFav(id) {
  const fav = getFav();
  const i = fav.indexOf(id);
  if (i >= 0) fav.splice(i, 1); else fav.push(id);
  try { localStorage.setItem(FAV_KEY, JSON.stringify(fav)); } catch (e) { /* ignore */ }
  return i < 0;
}

function labelBadge(label) {
  if (!label) return "";
  const l = LABELS[label];
  return `<span class="badge ${l.cls}">${l.text}</span>`;
}

function dishCard(d) {
  const isFav = getFav().includes(d.id);
  return `
  <div class="col-12 col-md-6 col-lg-4 col-xl-3">
    <article class="card h-100 shadow-sm dish-card">
      <img class="card-img-top dish-img" src="${d.img}" alt="${escapeHtml(d.name)}" width="400" height="260" loading="lazy">
      <div class="card-body d-flex flex-column">
        <div class="mb-2">${labelBadge(d.label)} <span class="badge bg-body-secondary text-body border">${CATEGORIES[d.cat]}</span></div>
        <h3 class="h5 card-title">${escapeHtml(d.name)}</h3>
        <p class="card-text text-body-secondary small flex-grow-1">${escapeHtml(d.desc)}</p>
        <p class="fw-bold fs-5 mb-3">${formatPrice(d.price)} <span class="fs-6 fw-normal text-body-secondary">· ${d.weight}</span></p>
        <div class="d-flex gap-2 mb-2">
          <button type="button" class="btn btn-brand flex-fill" data-add="${d.id}">В корзину</button>
          <button type="button" class="btn btn-fav${isFav ? " active" : ""}" data-fav="${d.id}" aria-pressed="${isFav}" aria-label="${isFav ? "Убрать из избранного" : "Добавить в избранное"}: ${escapeHtml(d.name)}">${isFav ? "♥" : "♡"}</button>
        </div>
        <button type="button" class="btn btn-outline-secondary w-100" data-bs-toggle="modal" data-bs-target="#dishModal" data-info="${d.id}">Подробнее</button>
      </div>
    </article>
  </div>`;
}

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const fav = getFav();
  const list = DISHES.filter((d) =>
    (currentCat === "all" || (currentCat === "fav" ? fav.includes(d.id) : d.cat === currentCat)) &&
    d.name.toLowerCase().includes(q));
  const sort = sortSelect.value;
  if (sort === "priceAsc") list.sort((a, b) => a.price - b.price);
  else if (sort === "priceDesc") list.sort((a, b) => b.price - a.price);
  else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  grid.innerHTML = list.length
    ? list.map(dishCard).join("")
    : `<div class="col-12"><div class="alert alert-warning mb-0">${currentCat === "fav" ? "В избранном пока ничего нет. Нажмите ♡ на карточке блюда." : "Ничего не найдено. Попробуйте изменить запрос."}</div></div>`;
  counter.textContent = `Найдено блюд: ${list.length}`;
}

function buildFilter() {
  const items = { all: "Всё меню", ...CATEGORIES, fav: "♥ Избранное" };
  filterBox.innerHTML = Object.entries(items)
    .map(([key, name]) => `<button type="button" class="btn btn-outline-brand${key === "all" ? " active" : ""}" data-cat="${key}" aria-pressed="${key === "all"}">${name}</button>`)
    .join("");
}

filterBox.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  currentCat = btn.dataset.cat;
  filterBox.querySelectorAll("button").forEach((b) => {
    const on = b === btn;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on);
  });
  render();
});

searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);

grid.addEventListener("click", (e) => {
  const favBtn = e.target.closest("[data-fav]");
  if (favBtn) {
    const on = toggleFav(Number(favBtn.dataset.fav));
    showToast(on ? "Добавлено в избранное" : "Убрано из избранного");
    render();
    return;
  }
  const add = e.target.closest("[data-add]");
  if (add) {
    Cart.add(add.dataset.add);
    showToast(`«${getDish(add.dataset.add).name}» добавлено в корзину`);
  }
});

/* Модальное окно: заполняется при открытии (событие show.bs.modal) */
const modalEl = document.getElementById("dishModal");
let modalDishId = null;
modalEl.addEventListener("show.bs.modal", (e) => {
  const d = getDish(e.relatedTarget.dataset.info);
  modalDishId = d.id;
  document.getElementById("dishModalTitle").textContent = d.name;
  const img = document.getElementById("dishModalImg");
  img.src = d.img;
  img.alt = d.name;
  document.getElementById("dishModalDesc").textContent = d.desc;
  document.getElementById("dishModalIngr").textContent = d.ingr;
  document.getElementById("dishModalWeight").textContent = d.weight;
  document.getElementById("dishModalPrice").textContent = formatPrice(d.price);
  document.getElementById("dishModalLabel").innerHTML = labelBadge(d.label);
});
document.getElementById("dishModalAdd").addEventListener("click", () => {
  Cart.add(modalDishId);
  showToast(`«${getDish(modalDishId).name}» добавлено в корзину`);
  bootstrap.Modal.getInstance(modalEl).hide();
});

buildFilter();
render();
