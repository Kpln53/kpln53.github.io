(function () {
    var openButton = document.querySelector("[data-feedback]");
    if (!openButton) return;

    var panel = document.createElement("div");
    panel.className = "news-panel";
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML =
        '<button class="news-panel-backdrop" type="button" aria-label="Kapat"></button>' +
        '<div class="news-panel-card" role="dialog" aria-modal="true" aria-labelledby="feedbackTitle">' +
            '<button class="news-panel-close" type="button">Kapat</button>' +
            '<h2 id="feedbackTitle">Oyun hakkında geri bildirim</h2>' +
            '<p class="feedback-who" data-feedback-who hidden></p>' +
            '<form class="feedback-form">' +
                '<label class="field" data-feedback-name>' +
                    '<span>Adın</span>' +
                    '<input name="name" type="text" maxlength="80" autocomplete="name">' +
                "</label>" +
                '<label class="field">' +
                    "<span>Mesajın</span>" +
                    '<textarea name="message" required maxlength="2000"></textarea>' +
                "</label>" +
                '<p class="form-status" data-feedback-status role="status"></p>' +
                '<button class="btn btn-primary" type="submit">Gönder</button>' +
            "</form>" +
        "</div>";
    document.body.appendChild(panel);

    var form = panel.querySelector("form");
    var who = panel.querySelector("[data-feedback-who]");
    var nameField = panel.querySelector("[data-feedback-name]");
    var status = panel.querySelector("[data-feedback-status]");
    var closeButton = panel.querySelector(".news-panel-close");
    var backdrop = panel.querySelector(".news-panel-backdrop");
    var account = null;

    function phrase(key, fallback) {
        return window.tiText ? window.tiText(key) : fallback;
    }

    function labels() {
        var close = phrase("feedback.close", "Kapat");
        closeButton.textContent = close;
        backdrop.setAttribute("aria-label", close);
        panel.querySelector("#feedbackTitle").textContent = phrase("feedback.title", "Oyun hakkında geri bildirim");
        nameField.querySelector("span").textContent = phrase("feedback.name", "Adın");
        form.querySelector("textarea").previousElementSibling.textContent = phrase("feedback.message", "Mesajın");
        form.querySelector("[type=submit]").textContent = phrase("feedback.send", "Gönder");
        if (account && account.name) who.textContent = phrase("feedback.who", "{name} olarak gönderilecek.").replace("{name}", account.name);
    }

    function setStatus(text, isError) {
        status.textContent = text || "";
        status.classList.toggle("is-visible", !!text);
        status.classList.toggle("is-error", !!isError);
    }

    function openPanel() {
        panel.classList.add("is-open");
        panel.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        form.elements.message.focus();
    }

    function closePanel() {
        if (!panel.classList.contains("is-open")) return;
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        openButton.focus();
    }

    fetch("/api/me", { headers: { "Accept": "application/json" } })
        .then(function (response) { return response.ok ? response.json() : null; })
        .then(function (user) {
            account = user;
            if (!user || !user.name) return;
            nameField.hidden = true;
            who.hidden = false;
            labels();
        })
        .catch(function () {});

    labels();
    document.addEventListener("ti-lang", labels);
    openButton.addEventListener("click", openPanel);
    closeButton.addEventListener("click", closePanel);
    panel.querySelector(".news-panel-backdrop").addEventListener("click", closePanel);
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closePanel();
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var message = form.elements.message.value.trim();
        if (message.length < 4) {
            setStatus(phrase("feedback.short", "Mesaj biraz daha uzun olsun."), true);
            return;
        }
        var submit = form.querySelector("[type=submit]");
        submit.disabled = true;
        setStatus(phrase("feedback.sending", "Gönderiliyor…"));
        fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                message: message,
                name: account ? "" : form.elements.name.value,
                game: "Titan Soccer"
            })
        }).then(function (response) {
            if (response.status === 429) throw new Error("locked");
            if (!response.ok) throw new Error("bad");
            form.reset();
            setStatus(phrase("feedback.ok", "Geri bildirimin ulaştı."));
        }).catch(function (err) {
            setStatus(err.message === "locked" ? phrase("feedback.locked", "Çok fazla deneme. Biraz sonra tekrar dene.") : phrase("feedback.fail", "Gönderilemedi."), true);
        }).then(function () {
            submit.disabled = false;
        });
    });
})();
