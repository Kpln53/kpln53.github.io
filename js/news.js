(function () {
    var root = document.querySelector("[data-news]");
    if (!root) return;

    var defaults = [
        {
            date: "29 Ekim 2026",
            title: "TitanSoccer v1.1 Şimdi yayında",
            text: "İlk büyük güncelleme yayında.",
            detail: "TitanSoccer'in ilk büyük güncellemesine hoş geldiniz.\n\nKarşınızda v1.1 yenilikleri:\n\nOynanış\nFutbolcuların ve topun boyutu biraz küçültüldü. AI geliştirildi. Pozisyon çeşitliliği arttırıldı.\n\nÖzel Zorluk Ayarı\nArtık kendi zorluğunuzu oluşturup seviyenizi kendiniz belirleyebilirsiniz.\n\nTiChat\nTiChat'e yeni mesaj çeşitleri eklendi. Mesaj gönderen taraf artık siz de olabiliyorsunuz.\n\nDoping\nDopingler oyundan kaldırıldı. Yerine oyuncu takviyeleri olarak geri eklendi. Fiyatları güncellendi.\n\nYetenek Ağacı\nYetenek ağacı sayfasının tasarımı geliştirildi. Yeni efektler eklendi.\n\nŞut Gücü Ayarı\nŞut gücü ayarı seçme kaldırıldı. Şut gücünü açmak istiyorsanız ayarlardan özel olarak açmanız gerekecek.\n\nYükleme Ekranları\nYükleme ekranları optimize edildi. Artık daha hızlı.\n\nYeni Para Birimleri\nOyuna TL ve Dolar para birimleri eklendi. Ayarlardan değiştirebilirsiniz.\n\nYeni Mevkiler\nOyuna SĞK ve SLK mevkileri eklendi. Mevkilere özel pozisyonlar da eklendi.\n\nTasarım İyileştirmeleri\nÇeşitli tasarım iyileştirmeleri yapıldı.\n\nSpiker\nSpikerde iyileştirmeler yapıldı.\n\nHaberler\nHaber türleri çeşitlendirildi.\n\nPozisyon Alma\nPozisyon alma olasılıkları arttırıldı. Her iki yarıda da en az 1 pozisyon alma eklendi. Yedekten girince pozisyon alma şansı arttırıldı.\n\nMaç Sonucu Paneli\nArtık maç sonu panelinde diğer maçlar gösterilirken toplam skor da gösteriliyor.\n\nHedef Takım Sistemi\nEski takım önerme sistemi tamamen kaldırıldı. Yerine Takım Önerme Sistemi eklendi. Menajerinizin seviyesine ve oyuncunuzun gücüne göre hedefler değişiyor."
        },
        {
            date: "Ekim 2026",
            title: "Resmi sitemiz yayında",
            text: "Ti App Studio’nun sitesi açıldı. Oyunlar, hakkımızda ve iletişim buradan ulaşılır.",
            detail: "Ti App Studio’nun resmi sitesi yayında. Oyunlar, haberler, hakkımızda ve iletişim sayfaları bu adresten açılır. Titan Soccer’a oyun sayfasından, soru ve iş birliklerine iletişim sayfasından ulaşılır."
        }
    ];

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
        });
    }

    function phrase(key, fallback) {
        return window.tiText ? window.tiText(key) : fallback;
    }

    function translated() {
        return [1, 2].map(function (index) {
            return {
                date: phrase("news." + index + ".date", defaults[index - 1].date),
                title: phrase("news." + index + ".title", defaults[index - 1].title),
                text: phrase("news." + index + ".text", defaults[index - 1].text),
                detail: phrase("news." + index + ".detail", defaults[index - 1].detail)
            };
        });
    }

    var source = null;
    var list = [];
    var lastFocus = null;
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
    var backdrop = panel.querySelector(".news-panel-backdrop");

    function choose(data) {
        var lang = window.tiLang ? window.tiLang() : "tr";
        if (lang !== "tr") return translated();
        if (data && Array.isArray(data.news)) return data.news;
        return defaults;
    }

    function render(items) {
        var limit = Number(root.getAttribute("data-news-limit"));
        var heading = root.getAttribute("data-news-limit") ? "h3" : "h2";
        list = limit > 0 ? items.slice(0, limit) : items.slice();
        var more = phrase("news.more", "Detayı aç");
        root.innerHTML = list.map(function (item, index) {
            return (
                '<article class="news-card" role="button" tabindex="0" data-news-open="' + index + '">' +
                    '<p class="news-date">' + escapeHtml(item.date) + "</p>" +
                    "<" + heading + ">" + escapeHtml(item.title) + "</" + heading + ">" +
                    "<p>" + escapeHtml(item.text) + "</p>" +
                    '<span class="news-more">' + escapeHtml(more) + "</span>" +
                "</article>"
            );
        }).join("");
        var close = phrase("news.close", "Kapat");
        closeBtn.textContent = close;
        backdrop.setAttribute("aria-label", close);
    }

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
    backdrop.addEventListener("click", closePanel);
    closeBtn.addEventListener("click", closePanel);
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && panel.classList.contains("is-open")) closePanel();
    });
    document.addEventListener("ti-lang", function () {
        render(choose(source));
    });

    var pending = window.tiContent ? window.tiContent() : Promise.resolve(null);
    pending.then(function (data) {
        source = data;
        render(choose(data));
    });
})();
