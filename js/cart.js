// Страница корзины: карточки товаров, итоги, форма оплаты.

const itemsBox = document.getElementById("cartItems");
const emptyBox = document.getElementById("cartEmpty");
const contentBox = document.getElementById("cartContent");
const form = document.getElementById("orderForm");

function renderCart() {
  const cart = Cart.get();
  const ids = Object.keys(cart).filter((id) => getDish(id));
  emptyBox.classList.toggle("d-none", ids.length > 0);
  contentBox.classList.toggle("d-none", ids.length === 0);

  itemsBox.innerHTML = ids.map((id) => {
    const d = getDish(id), q = cart[id];
    return `
    <div class="col-12">
      <article class="card shadow-sm">
        <div class="card-body">
          <div class="row g-3 align-items-center">
            <div class="col-3 col-sm-2"><img class="img-fluid rounded cart-img" src="${d.img}" alt="${escapeHtml(d.name)}" width="120" height="120"></div>
            <div class="col-9 col-sm-5">
              <h3 class="h6 mb-1">${escapeHtml(d.name)}</h3>
              <p class="mb-0 small text-body-secondary">${formatPrice(d.price)} · ${d.weight}</p>
            </div>
            <div class="col-7 col-sm-3">
              <div class="input-group input-group-sm" role="group" aria-label="Количество: ${escapeHtml(d.name)}">
                <button class="btn btn-outline-secondary" type="button" data-minus="${id}" aria-label="Уменьшить">−</button>
                <input type="text" class="form-control text-center" value="${q}" readonly aria-label="Количество">
                <button class="btn btn-outline-secondary" type="button" data-plus="${id}" aria-label="Увеличить">+</button>
              </div>
            </div>
            <div class="col-5 col-sm-2 text-end">
              <div class="fw-bold">${formatPrice(d.price * q)}</div>
              <button class="btn btn-link btn-sm text-danger p-0" type="button" data-remove="${id}">Удалить</button>
            </div>
          </div>
        </div>
      </article>
    </div>`;
  }).join("");

  document.getElementById("sumTotal").textContent = formatPrice(Cart.subtotal());
}

itemsBox.addEventListener("click", (e) => {
  const cart = Cart.get();
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.plus) Cart.setQty(b.dataset.plus, (cart[b.dataset.plus] || 0) + 1);
  else if (b.dataset.minus) Cart.setQty(b.dataset.minus, (cart[b.dataset.minus] || 0) - 1);
  else if (b.dataset.remove) Cart.setQty(b.dataset.remove, 0);
  else return;
  renderCart();
});

document.getElementById("clearCart").addEventListener("click", () => { Cart.clear(); renderCart(); });

/* Способ оплаты: поля карты показываются только при выборе «Картой онлайн» */
const cardFields = document.getElementById("cardFields");
form.querySelectorAll('input[name="pay"]').forEach((r) =>
  r.addEventListener("change", () => {
    const online = form.pay.value === "card";
    cardFields.classList.toggle("d-none", !online);
    form.cardNumber.required = online;
  })
);

/* Маска телефона и номера карты */
form.phone.addEventListener("input", () => {
  let d = form.phone.value.replace(/\D/g, "").replace(/^[78]/, "").slice(0, 10);
  let s = "+7";
  if (d.length) s += " (" + d.slice(0, 3);
  if (d.length >= 3) s += ") " + d.slice(3, 6);
  if (d.length >= 6) s += "-" + d.slice(6, 8);
  if (d.length >= 8) s += "-" + d.slice(8, 10);
  form.phone.value = d.length ? s : "";
});
form.cardNumber.addEventListener("input", () => {
  form.cardNumber.value = form.cardNumber.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
});

/* Проверка и «отправка» (имитация, без сервера) */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.phone.setCustomValidity(form.phone.value.replace(/\D/g, "").length === 11 ? "" : "Введите телефон полностью");
  if (form.cardNumber.required) {
    form.cardNumber.setCustomValidity(form.cardNumber.value.replace(/\D/g, "").length === 16 ? "" : "Введите 16 цифр");
  } else form.cardNumber.setCustomValidity("");
  form.classList.add("was-validated");
  if (!form.checkValidity()) {
    form.querySelector(":invalid").focus();
    return;
  }
  document.getElementById("successName").textContent = form.name.value.trim();
  document.getElementById("successTotal").textContent = document.getElementById("sumTotal").textContent;
  document.getElementById("successAddress").textContent = form.address.value.trim();
  new bootstrap.Modal(document.getElementById("successModal")).show();
  Cart.clear();
  form.reset();
  form.classList.remove("was-validated");
  cardFields.classList.add("d-none");
  renderCart();
});

renderCart();
