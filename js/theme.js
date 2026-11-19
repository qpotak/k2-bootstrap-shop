// Тема сайта: хранится глобально (localStorage + cookie) и применяется до отрисовки страницы.
(function () {
  var KEY = "restaurant-theme";
  var root = document.documentElement;

  function isTheme(value) {
    return value === "light" || value === "dark";
  }

  function readCookie() {
    var match = document.cookie.match(/(?:^|;\s*)restaurant-theme=(light|dark)/);
    return match ? match[1] : null;
  }

  function readTheme() {
    try {
      var stored = localStorage.getItem(KEY);
      if (isTheme(stored)) return stored;
    } catch (e) { /* хранилище может быть недоступно */ }
    return readCookie();
  }

  function preferredTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    if (!isTheme(theme)) return;
    root.setAttribute("data-bs-theme", theme);
    root.style.colorScheme = theme;
  }

  function saveTheme(theme) {
    if (!isTheme(theme)) return;
    try { localStorage.setItem(KEY, theme); } catch (e) { /* хранилище может быть недоступно */ }
    document.cookie = KEY + "=" + theme + "; path=/; max-age=31536000; SameSite=Lax";
  }

  window.SiteTheme = {
    get: function () {
      var current = root.getAttribute("data-bs-theme");
      return isTheme(current) ? current : (readTheme() || preferredTheme());
    },
    read: readTheme,
    preferred: preferredTheme,
    apply: applyTheme,
    save: saveTheme,
  };

  // Применяем тему до загрузки Bootstrap CSS — без мигания светлой темы.
  applyTheme(readTheme() || preferredTheme());
})();
