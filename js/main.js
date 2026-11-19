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
  const n = Cart.count();
  document.querySelectorAll(".cart-badge").forEach((el) => {
    el.textContent = n;
    el.classList.toggle("d-none", n === 0);
  });
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

/* ---------- Переключатель светлой/тёмной темы (глобально для всех страниц) ---------- */
function initTheme() {
  const btn = document.getElementById("themeToggle");
  const label = document.getElementById("themeLabel");
  if (!btn) return;

  function syncLabel() {
    const dark = SiteTheme.get() === "dark";
    btn.setAttribute("aria-pressed", dark);
    if (label) label.textContent = dark ? "Светлая тема" : "Тёмная тема";
  }

  function commit(theme) {
    SiteTheme.apply(theme);
    SiteTheme.save(theme);
    syncLabel();
  }

  syncLabel();
  btn.addEventListener("click", () => {
    const next = SiteTheme.get() === "dark" ? "light" : "dark";
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof document.startViewTransition !== "function") {
      commit(next);
      return;
    }

    // Волна расходится из центра кнопки: увеличиваем задержку и радиус до дальнего угла.
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.style.setProperty("--theme-wave-x", x + "px");
    root.style.setProperty("--theme-wave-y", y + "px");
    root.style.setProperty("--theme-wave-r", radius + "px");

    const transition = document.startViewTransition(() => commit(next));
    transition.finished.finally(() => {
      root.style.removeProperty("--theme-wave-x");
      root.style.removeProperty("--theme-wave-y");
      root.style.removeProperty("--theme-wave-r");
    });
  });
}

/* ---------- Кнопка «Наверх» ---------- */
function initToTop() {
  const btn = document.getElementById("toTop");
  window.addEventListener("scroll", () => btn.classList.toggle("d-none", window.scrollY < 400), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Чат с консультантом (демо, без сервера) ---------- */
function initChat() {
  const panel = document.getElementById("chatPanel");
  const toggle = document.getElementById("chatToggle");
  const body = document.getElementById("chatBody");
  const input = document.getElementById("chatInput");
  function setOpen(open) {
    panel.classList.toggle("d-none", !open);
    toggle.setAttribute("aria-expanded", open);
    if (open) input.focus();
  }
  function addMsg(text, who) {
    const p = document.createElement("p");
    p.className = "chat-msg chat-msg--" + who;
    p.textContent = text;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }
  toggle.addEventListener("click", () => setOpen(panel.classList.contains("d-none")));
  document.getElementById("chatClose").addEventListener("click", () => { setOpen(false); toggle.focus(); });
  document.getElementById("chatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, "user");
    input.value = "";
    setTimeout(() => addMsg("Спасибо за сообщение! Консультант ответит в ближайшее время.", "bot"), 600);
  });
}

/* ---------- Главная: хиты меню ---------- */
function initHomeHits() {
  const box = document.getElementById("homeHits");
  if (!box || typeof DISHES === "undefined") return;
  const ids = [4, 7, 11, 8];
  box.innerHTML = ids.map((id) => {
    const d = getDish(id);
    if (!d) return "";
    return `
    <div class="col-12 col-sm-6 col-lg-3">
      <article class="card h-100 shadow-sm overflow-hidden home-hit">
        <img class="card-img-top dish-img" src="${d.img}" alt="${escapeHtml(d.name)}" width="400" height="260" loading="lazy">
        <div class="card-body d-flex flex-column text-center">
          <h3 class="h5">${escapeHtml(d.name)}</h3>
          <p class="small text-body-secondary flex-grow-1">${escapeHtml(d.desc)}</p>
          <p class="fw-bold mb-3">${formatPrice(d.price)}</p>
          <button type="button" class="btn btn-brand" data-add="${d.id}">В корзину</button>
        </div>
      </article>
    </div>`;
  }).join("");
  box.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-add]");
    if (!btn) return;
    const dish = getDish(btn.dataset.add);
    Cart.add(btn.dataset.add);
    showToast(`«${dish.name}» добавлено в корзину`);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initTheme();
  initToTop();
  initChat();
  initHomeHits();
});
