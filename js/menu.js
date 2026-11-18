// Страница меню: фильтр по категориям, поиск, карточки, модальное окно «Подробнее».

const grid = document.getElementById("dishGrid");
const filterBox = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const counter = document.getElementById("dishCount");
let currentCat = "all";

function labelBadge(label) {
  if (!label) return "";
  const l = LABELS[label];
  return `<span class="badge ${l.cls}">${l.text}</span>`;
}

function dishCard(d) {
  return `
  <div class="col-12 col-md-6 col-lg-4 col-xl-3">
    <article class="card h-100 shadow-sm dish-card">
      <img class="card-img-top dish-img" src="${d.img}" alt="${escapeHtml(d.name)}" width="400" height="260" loading="lazy">
      <div class="card-body d-flex flex-column">
        <div class="mb-2">${labelBadge(d.label)} <span class="badge text-bg-light border">${CATEGORIES[d.cat]}</span></div>
        <h3 class="h5 card-title">${escapeHtml(d.name)}</h3>
        <p class="card-text text-body-secondary small flex-grow-1">${escapeHtml(d.desc)}</p>
        <p class="fw-bold fs-5 mb-3">${formatPrice(d.price)} <span class="fs-6 fw-normal text-body-secondary">· ${d.weight}</span></p>
        <div class="d-grid gap-2 d-sm-flex">
          <button type="button" class="btn btn-brand flex-fill" data-add="${d.id}">В корзину</button>
          <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#dishModal" data-info="${d.id}">Подробнее</button>
        </div>
      </div>
    </article>
  </div>`;
}

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const list = DISHES.filter((d) => (currentCat === "all" || d.cat === currentCat) && d.name.toLowerCase().includes(q));
  grid.innerHTML = list.length
    ? list.map(dishCard).join("")
    : '<div class="col-12"><div class="alert alert-warning mb-0">Ничего не найдено. Попробуйте изменить запрос.</div></div>';
  counter.textContent = `Найдено блюд: ${list.length}`;
}

function buildFilter() {
  const items = { all: "Всё меню", ...CATEGORIES };
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

grid.addEventListener("click", (e) => {
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
