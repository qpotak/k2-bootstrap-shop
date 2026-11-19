// Страница услуг: форма заявки в модальном окне (имитация отправки).

const SERVICES = ["Дни рождения", "Корпоративы", "Банкеты и юбилеи", "Детские праздники", "Кейтеринг", "Романтический ужин"];
const sModal = document.getElementById("serviceModal");
const sForm = document.getElementById("serviceForm");
const sDone = document.getElementById("serviceDone");

SERVICES.forEach((n) => sForm.service.add(new Option(n, n)));
sForm.sDate.min = new Date().toISOString().slice(0, 10);

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
