// Общая логика: форматирование цены, корзина (localStorage), счётчик в навбаре, toast.

function formatPrice(n) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function getDish(id) {
  return DISHES.find((d) => d.id === Number(id));
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- Корзина: объект { id: количество } ---------- */
const Cart = {
  key: "restaurant-cart",
  get() {
    try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { return {}; }
  },
  save(cart) {
    try { localStorage.setItem(this.key, JSON.stringify(cart)); } catch (e) { /* хранилище недоступно */ }
    updateCartBadge();
  },
  add(id) {
    const cart = this.get();
    cart[id] = (cart[id] || 0) + 1;
    this.save(cart);
  },
  setQty(id, qty) {
    const cart = this.get();
    if (qty <= 0) delete cart[id]; else cart[id] = Math.min(qty, 20);
    this.save(cart);
  },
  clear() { this.save({}); },
  count() { return Object.values(this.get()).reduce((a, b) => a + b, 0); },
  subtotal() {
    return Object.entries(this.get()).reduce((sum, [id, q]) => {
      const d = getDish(id);
      return sum + (d ? d.price * q : 0);
    }, 0);
  },
};

function updateCartBadge() {
  const el = document.getElementById("cartBadge");
  if (!el) return;
  const n = Cart.count();
  el.textContent = n;
  el.classList.toggle("d-none", n === 0);
}

/* ---------- Toast (уведомление) ---------- */
function showToast(message) {
  const box = document.getElementById("toastBox");
  if (!box) return;
  const wrap = document.createElement("div");
  wrap.className = "toast align-items-center text-bg-dark border-0";
  wrap.setAttribute("role", "status");
  wrap.setAttribute("aria-live", "polite");
  wrap.innerHTML =
    '<div class="d-flex"><div class="toast-body"></div>' +
    '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button></div>';
  wrap.querySelector(".toast-body").textContent = message;
  box.appendChild(wrap);
  const t = new bootstrap.Toast(wrap, { delay: 2500 });
  wrap.addEventListener("hidden.bs.toast", () => wrap.remove());
  t.show();
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
