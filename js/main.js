(function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.textContent = open ? "Kapat" : "Menü";
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
                toggle.textContent = "Menü";
            });
        });
    }

    var year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());

    var form = document.querySelector("#contact-form");
    if (!form) return;

    var studioMail = "hello@tiappstudio.com";

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = new FormData(form);
        var name = String(data.get("name") || "").trim();
        var email = String(data.get("email") || "").trim();
        var topic = String(data.get("topic") || "Genel").trim();
        var message = String(data.get("message") || "").trim();
        var status = document.querySelector("#form-status");

        var subject = encodeURIComponent("Ti App Studio — " + topic);
        var body = encodeURIComponent(message + "\n\n— " + name + "\n" + email);
        window.location.href = "mailto:" + studioMail + "?subject=" + subject + "&body=" + body;

        if (status) {
            status.textContent = "E-posta uygulamanız açılıyor. Açılmazsa " + studioMail + " adresine yazabilirsiniz.";
            status.classList.add("is-visible");
        }
    });
})();
