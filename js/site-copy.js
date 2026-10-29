(function () {
    if (!window.tiContent) return;

    function read(data, path) {
        return String(path || "").split(".").reduce(function (value, key) {
            if (value == null) return null;
            return value[key];
        }, data);
    }

    function apply(data) {
        if (!data) return;
        var lang = window.tiLang ? window.tiLang() : "tr";
        document.querySelectorAll("[data-bind]").forEach(function (el) {
            if (lang !== "tr" && el.hasAttribute("data-i18n")) return;
            var value = read(data, el.getAttribute("data-bind"));
            if (typeof value !== "string" || !value) return;
            el.textContent = value;
            if (el.getAttribute("data-bind") === "site.email") el.href = "mailto:" + value;
        });
        document.querySelectorAll("[data-bind-src]").forEach(function (el) {
            var value = read(data, el.getAttribute("data-bind-src"));
            if (typeof value === "string" && value) el.src = value;
        });
        document.querySelectorAll("[data-bind-href]").forEach(function (el) {
            var value = read(data, el.getAttribute("data-bind-href"));
            var ok = typeof value === "string" && /^https:\/\/\S+$/.test(value);
            var item = el.closest("li");
            if (ok) {
                el.href = value;
                el.hidden = false;
                if (item) item.hidden = false;
            } else {
                el.removeAttribute("href");
                el.hidden = true;
                if (item) item.hidden = true;
            }
        });
        document.querySelectorAll("[data-community]").forEach(function (section) {
            section.hidden = !section.querySelector("[data-bind-href]:not([hidden])");
        });
    }

    window.tiContent().then(apply);
    document.addEventListener("ti-lang", function () {
        window.tiContent().then(apply);
    });
})();
