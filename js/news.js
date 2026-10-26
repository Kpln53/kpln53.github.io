(function () {
    var root = document.querySelector("[data-news]");
    if (!root) return;

    var items = [
        {
            date: "Ekim 2026",
            title: "Titan Soccer",
            text: "Kişisel bir 2D kariyer geliştirme oyunu. Kendi oyuncunla sahaya çıkar, maç maç ilerler ve sezon boyunca becerilerini geliştirirsin.",
            detail: "Titan Soccer, Ti App Studio’nun futbol oyunudur. Kişisel bir 2D kariyer geliştirme oyunu olarak kuruldu. Kendi oyuncunla sahaya çıkar, maç maç ilerler ve sezon boyunca becerilerini geliştirirsin. Odak kalabalık bir kadroda değil, sana ait tek bir futbol yolundadır."
        },
        {
            date: "Ekim 2026",
            title: "Resmi sitemiz yayında",
            text: "Ti App Studio’nun sitesi açıldı. Oyunlar, hakkımızda ve iletişim buradan ulaşılır.",
            detail: "Ti App Studio’nun resmi sitesi yayında. Oyunlar, haberler, hakkımızda ve iletişim sayfaları bu adresten açılır. Titan Soccer’a oyun sayfasından, soru ve iş birliklerine iletişim sayfasından ulaşılır."
        }
    ];

    var limit = Number(root.getAttribute("data-news-limit"));
    var list = limit > 0 ? items.slice(0, limit) : items;
    var heading = root.getAttribute("data-news-limit") ? "h3" : "h2";
    var lastFocus = null;

    root.innerHTML = list.map(function (item, index) {
        return (
            '<article class="news-card" role="button" tabindex="0" data-news-open="' + index + '">' +
                '<p class="news-date">' + item.date + "</p>" +
                "<" + heading + ">" + item.title + "</" + heading + ">" +
                "<p>" + item.text + "</p>" +
                '<span class="news-more">Detayı aç</span>' +
            "</article>"
        );
    }).join("");

    var panel = document.createElement("div");
    panel.className = "news-panel";
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML =
        '<button class="news-panel-backdrop" type="button" aria-label="Kapat"></button>' +
        '<div class="news-panel-card" role="dialog" aria-modal="true" aria-labelledby="newsPanelTitle">' +
            '<button class="news-panel-close" type="button">Kapat</button>' +
            '<p class="news-date" id="newsPanelDate"></p>' +
            '<h2 id="newsPanelTitle"></h2>' +
            '<p id="newsPanelBody"></p>' +
        "</div>";
    document.body.appendChild(panel);

    var dateEl = panel.querySelector("#newsPanelDate");
    var titleEl = panel.querySelector("#newsPanelTitle");
    var bodyEl = panel.querySelector("#newsPanelBody");
    var closeBtn = panel.querySelector(".news-panel-close");

    function openPanel(index) {
        var item = list[index];
        if (!item) return;
        dateEl.textContent = item.date;
        titleEl.textContent = item.title;
        bodyEl.textContent = item.detail;
        lastFocus = document.activeElement;
        panel.setAttribute("aria-hidden", "false");
        panel.classList.add("is-open");
        document.body.style.overflow = "hidden";
        closeBtn.focus();
    }

    function closePanel() {
        if (!panel.classList.contains("is-open")) return;
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function cardFromEvent(event) {
        var card = event.target.closest("[data-news-open]");
        if (!card || !root.contains(card)) return null;
        return card;
    }

    root.addEventListener("click", function (event) {
        var card = cardFromEvent(event);
        if (card) openPanel(Number(card.getAttribute("data-news-open")));
    });

    root.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        var card = cardFromEvent(event);
        if (!card) return;
        event.preventDefault();
        openPanel(Number(card.getAttribute("data-news-open")));
    });

    panel.querySelector(".news-panel-backdrop").addEventListener("click", closePanel);
    closeBtn.addEventListener("click", closePanel);
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && panel.classList.contains("is-open")) closePanel();
    });
})();
