function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
}

(function () {
    var slot = document.querySelector("[data-auth-slot]");
    if (!slot) return;

    function label(key, fallback) {
        return window.tiText ? window.tiText(key) : fallback;
    }

    var account = null;

    function showGuest() {
        slot.innerHTML = '<a class="header-login" href="./login.html">' + escapeHtml(label("auth.login", "Giriş yap")) + "</a>";
    }

    function showUser(user) {
        var raw = user.name || user.email;
        var name = escapeHtml(raw);
        var initial = escapeHtml(String(raw).trim().charAt(0).toUpperCase());
        var panel = user.role === "admin" ? '<a href="./admin.html">' + escapeHtml(label("auth.panel", "Panel")) + "</a>" : "";
        slot.innerHTML =
            '<button class="account-btn" type="button" aria-expanded="false" aria-haspopup="true">' +
                '<span class="account-mark">' + initial + "</span>" +
                "<span>" + name + "</span>" +
            "</button>" +
            '<div class="account-menu" hidden>' +
                panel +
                '<button type="button" data-logout>' + escapeHtml(label("auth.logout", "Çıkış yap")) + "</button>" +
            "</div>";

        var button = slot.querySelector(".account-btn");
        var menu = slot.querySelector(".account-menu");
        button.addEventListener("click", function () {
            var open = menu.hidden;
            menu.hidden = !open;
            button.setAttribute("aria-expanded", open ? "true" : "false");
        });
        slot.querySelector("[data-logout]").addEventListener("click", function () {
            fetch("/api/logout", { method: "POST" }).finally(function () {
                window.location.href = "./index.html";
            });
        });
    }

    function render() {
        if (account && account.email) showUser(account);
        else showGuest();
    }

    document.addEventListener("click", function (event) {
        var menu = slot.querySelector(".account-menu");
        var button = slot.querySelector(".account-btn");
        if (!menu || !button || slot.contains(event.target)) return;
        menu.hidden = true;
        button.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("ti-lang", render);

    fetch("/api/me", { headers: { "Accept": "application/json" } })
        .then(function (response) { return response.ok ? response.json() : null; })
        .then(function (user) {
            account = user && user.email ? user : null;
            render();
        })
        .catch(function () {
            account = null;
            render();
        });
})();
