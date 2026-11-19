// Страница услуг: карточки из общего каталога, форма заявки в модальном окне (имитация отправки).

const serviceGrid = document.getElementById("serviceGrid");
const sModal = document.getElementById("serviceModal");
const sForm = document.getElementById("serviceForm");
const sDone = document.getElementById("serviceDone");

function serviceCard(s) {
  return `
  <div class="col-12 col-md-6 col-lg-4">
    <article class="card h-100 shadow-sm overflow-hidden" id="svc-${s.id}">
      <img class="card-img-top dish-img" src="${s.img}" alt="${escapeHtml(s.name)}" width="400" height="260" loading="lazy">
      <div class="card-body d-flex flex-column">
        <div class="mb-2"><span class="badge text-bg-warning">${escapeHtml(s.badge)}</span></div>
        <h3 class="h5 card-title">${escapeHtml(s.name)}</h3>
        <p class="card-text flex-grow-1">${escapeHtml(s.desc)}</p>
        <p class="fw-bold mb-3">${escapeHtml(s.price)}</p>
        <button type="button" class="btn btn-brand" data-bs-toggle="modal" data-bs-target="#serviceModal" data-service="${escapeHtml(s.name)}">Оставить заявку</button>
      </div>
    </article>
  </div>`;
}

serviceGrid.innerHTML = SERVICES.map(serviceCard).join("");
SERVICES.forEach((s) => sForm.service.add(new Option(s.name, s.name)));
sForm.sDate.min = new Date().toISOString().slice(0, 10);

// Переход из глобального поиска на конкретную услугу: карточки создаются скриптом,
// поэтому прокручиваем к якорю после отрисовки.
if (location.hash) {
  const target = document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView();
}

sModal.addEventListener("show.bs.modal", (e) => {
  const name = e.relatedTarget && e.relatedTarget.dataset.service;
  if (name) sForm.service.value = name;
  sDone.classList.add("d-none");
  sForm.classList.remove("was-validated");
});

sForm.sPhone.addEventListener("input", () => {
  const d = sForm.sPhone.value.replace(/\D/g, "").replace(/^[78]/, "").slice(0, 10);
  let s = "+7";
  if (d.length) s += " (" + d.slice(0, 3);
  if (d.length >= 3) s += ") " + d.slice(3, 6);
  if (d.length >= 6) s += "-" + d.slice(6, 8);
  if (d.length >= 8) s += "-" + d.slice(8, 10);
  sForm.sPhone.value = d.length ? s : "";
});

sForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sForm.sPhone.setCustomValidity(sForm.sPhone.value.replace(/\D/g, "").length === 11 ? "" : "Введите телефон полностью");
  sForm.classList.add("was-validated");
  if (!sForm.checkValidity()) {
    sForm.querySelector(":invalid").focus();
    return;
  }
  sDone.classList.remove("d-none");
  sForm.reset();
  sForm.classList.remove("was-validated");
  sForm.sGuests.value = 10;
});
