(function () {
    var main = document.querySelector(".admin-layout");
    var email = document.querySelector("#admin-email");
    var view = document.querySelector("#admin-view");
    var status = document.querySelector("#admin-status");
    var content = null;
    var tab = "news";

    function note(text, isError) {
        if (!status) return;
        status.textContent = text || "";
        status.classList.toggle("is-visible", !!text);
        status.classList.toggle("is-error", !!isError);
    }

    function field(label, value, key, area) {
        var wrap = document.createElement("label");
        wrap.className = "field";
        var span = document.createElement("span");
        span.textContent = label;
        var input = document.createElement(area ? "textarea" : "input");
        if (!area) input.type = "text";
        input.value = value || "";
        input.addEventListener("input", function () { key(input.value); });
        wrap.appendChild(span);
        wrap.appendChild(input);
        return wrap;
    }

    function save() {
        note("Kaydediliyor…");
        return fetch("/api/admin/content", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(content)
        }).then(function (response) {
            if (!response.ok) throw new Error("save");
            return response.json();
        }).then(function (data) {
            content = data;
            note("Kaydedildi.");
            draw();
        }).catch(function () {
            note("Kaydedilemedi.", true);
        });
    }

    function drawNews() {
        var block = document.createElement("div");
        block.className = "admin-block";
        var title = document.createElement("h2");
        title.textContent = "Haberler";
        block.appendChild(title);
        content.news.forEach(function (item, index) {
            var card = document.createElement("div");
            card.className = "admin-card";
            card.appendChild(field("Tarih", item.date, function (value) { item.date = value; }));
            card.appendChild(field("Başlık", item.title, function (value) { item.title = value; }));
            card.appendChild(field("Kısa metin", item.text, function (value) { item.text = value; }, true));
            card.appendChild(field("Detay", item.detail, function (value) { item.detail = value; }, true));
            var remove = document.createElement("button");
            remove.className = "btn btn-ghost";
            remove.type = "button";
            remove.textContent = "Haberi sil";
            remove.addEventListener("click", function () {
                content.news.splice(index, 1);
                save();
            });
            card.appendChild(remove);
            block.appendChild(card);
        });
        var actions = document.createElement("div");
        actions.className = "admin-actions";
        var add = document.createElement("button");
        add.className = "btn btn-ghost";
        add.type = "button";
        add.textContent = "Haber ekle";
        add.addEventListener("click", function () {
            content.news.unshift({ date: "", title: "", text: "", detail: "" });
            draw();
        });
        var button = document.createElement("button");
        button.className = "btn btn-primary";
        button.type = "button";
        button.textContent = "Haberleri kaydet";
        button.addEventListener("click", save);
        actions.appendChild(add);
        actions.appendChild(button);
        block.appendChild(actions);
        return block;
    }

    function drawGames() {
        var block = document.createElement("div");
        block.className = "admin-block";
        var title = document.createElement("h2");
        title.textContent = "Oyunlar";
        block.appendChild(title);
        content.games.forEach(function (game, index) {
            var card = document.createElement("div");
            card.className = "admin-card";
            card.appendChild(field("Ad", game.name, function (value) { game.name = value; }));
            card.appendChild(field("Tür", game.kind, function (value) { game.kind = value; }));
            card.appendChild(field("Kısa açıklama", game.blurb, function (value) { game.blurb = value; }, true));
            card.appendChild(field("Liste açıklaması", game.summary, function (value) { game.summary = value; }, true));
            card.appendChild(field("Sayfa", game.href, function (value) { game.href = value; }));
            card.appendChild(field("Logo", game.logo, function (value) { game.logo = value; }));
            card.appendChild(field("Derecelendirme", game.rating, function (value) { game.rating = value; }));
            card.appendChild(field("Derecelendirme sayısı", game.ratingCount, function (value) { game.ratingCount = value; }));
            card.appendChild(field("İndirme", game.downloads, function (value) { game.downloads = value; }));
            var remove = document.createElement("button");
            remove.className = "btn btn-ghost";
            remove.type = "button";
            remove.textContent = "Oyunu sil";
            remove.addEventListener("click", function () {
                content.games.splice(index, 1);
                save();
            });
            card.appendChild(remove);
            block.appendChild(card);
        });
        var actions = document.createElement("div");
        actions.className = "admin-actions";
        var add = document.createElement("button");
        add.className = "btn btn-ghost";
        add.type = "button";
        add.textContent = "Oyun ekle";
        add.addEventListener("click", function () {
            content.games.push({
                name: "",
                kind: "Oyun",
                href: "./games.html",
                logo: "./images/ttslogo1.png",
                summary: "",
                blurb: "",
                rating: "",
                ratingCount: "",
                downloads: ""
            });
            draw();
        });
        var pull = document.createElement("button");
        pull.className = "btn btn-ghost";
        pull.type = "button";
        pull.textContent = "Play Store'dan çek";
        pull.addEventListener("click", function () {
            note("Play Store bakılıyor…");
            fetch("/api/admin/play-stats", { headers: { "Accept": "application/json" } })
                .then(function (response) {
                    if (!response.ok) throw new Error("play");
                    return response.json();
                })
                .then(function (stats) {
                    var game = content.games[0];
                    if (!game) throw new Error("play");
                    if (stats.rating) game.rating = stats.rating;
                    if (stats.ratingCount) game.ratingCount = stats.ratingCount;
                    if (stats.downloads) game.downloads = stats.downloads;
                    return save();
                })
                .catch(function () {
                    note("Play Store'dan alınamadı. Sayıları elle yazabilirsin.", true);
                });
        });
        var button = document.createElement("button");
        button.className = "btn btn-primary";
        button.type = "button";
        button.textContent = "Oyunları kaydet";
        button.addEventListener("click", save);
        actions.appendChild(add);
        actions.appendChild(pull);
        actions.appendChild(button);
        block.appendChild(actions);
        return block;
    }

    function drawSite() {
        var site = content.site;
        var block = document.createElement("div");
        block.className = "admin-block";
        var title = document.createElement("h2");
        title.textContent = "Bilgiler";
        var card = document.createElement("div");
        card.className = "admin-card";
        card.appendChild(field("Stüdyo adı", site.name, function (value) { site.name = value; }));
        card.appendChild(field("E-posta", site.email, function (value) { site.email = value; }));
        card.appendChild(field("Ana sayfa metni", site.heroLead, function (value) { site.heroLead = value; }, true));
        card.appendChild(field("Hakkımızda", site.about1, function (value) { site.about1 = value; }, true));
        card.appendChild(field("Hakkımızda, devam", site.about2, function (value) { site.about2 = value; }, true));
        card.appendChild(field("İletişim metni", site.contactLead, function (value) { site.contactLead = value; }, true));
        card.appendChild(field("Play Store bağlantısı", site.playStoreUrl, function (value) { site.playStoreUrl = value; }));
        card.appendChild(field("Instagram", site.instagram, function (value) { site.instagram = value; }));
        card.appendChild(field("Telegram", site.telegram, function (value) { site.telegram = value; }));
        var button = document.createElement("button");
        button.className = "btn btn-primary";
        button.type = "button";
        button.textContent = "Bilgileri kaydet";
        button.addEventListener("click", save);
        block.appendChild(title);
        block.appendChild(card);
        block.appendChild(button);
        return block;
    }

    function drawUsers() {
        var block = document.createElement("div");
        block.className = "admin-block";
        var title = document.createElement("h2");
        title.textContent = "Kullanıcılar";
        var table = document.createElement("table");
        table.className = "user-table";
        table.innerHTML = "<thead><tr><th>Ad</th><th>E-posta</th><th>Rol</th></tr></thead>";
        var body = document.createElement("tbody");
        table.appendChild(body);
        block.appendChild(title);
        block.appendChild(table);
        fetch("/api/admin/users", { headers: { "Accept": "application/json" } })
            .then(function (response) { return response.ok ? response.json() : null; })
            .then(function (data) {
                (data && data.users ? data.users : []).forEach(function (user) {
                    var row = document.createElement("tr");
                    [user.name, user.email, user.role === "admin" ? "Yönetici" : "Üye"].forEach(function (value) {
                        var cell = document.createElement("td");
                        cell.textContent = value || "";
                        row.appendChild(cell);
                    });
                    body.appendChild(row);
                });
            });
        return block;
    }

    function drawFeedback() {
        var block = document.createElement("div");
        block.className = "admin-block";
        var title = document.createElement("h2");
        title.textContent = "Geri bildirim";
        var list = document.createElement("div");
        list.className = "admin-block";
        block.appendChild(title);
        block.appendChild(list);

        function removeItem(id) {
            fetch("/api/admin/feedback", {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ id: id })
            }).then(function (response) {
                if (!response.ok) throw new Error("delete");
                note("Silindi.");
                draw();
            }).catch(function () {
                note("Silinemedi.", true);
            });
        }

        fetch("/api/admin/feedback", { headers: { "Accept": "application/json" } })
            .then(function (response) { return response.ok ? response.json() : null; })
            .then(function (data) {
                var items = data && data.feedback ? data.feedback : [];
                if (!items.length) {
                    var empty = document.createElement("p");
                    empty.className = "muted";
                    empty.textContent = "Henüz geri bildirim yok.";
                    list.appendChild(empty);
                    return;
                }
                items.forEach(function (item) {
                    var card = document.createElement("article");
                    card.className = "admin-card";
                    var meta = document.createElement("p");
                    meta.className = "feedback-meta";
                    var when = new Date(item.created);
                    var parts = [
                        isNaN(when.getTime()) ? "" : when.toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" }),
                        item.game,
                        item.name,
                        item.email
                    ].filter(Boolean);
                    meta.textContent = parts.join(" · ");
                    var message = document.createElement("p");
                    message.className = "feedback-message";
                    message.textContent = item.message || "";
                    var remove = document.createElement("button");
                    remove.className = "btn btn-ghost";
                    remove.type = "button";
                    remove.textContent = "Geri bildirimi sil";
                    remove.addEventListener("click", function () { removeItem(item.id); });
                    card.appendChild(meta);
                    card.appendChild(message);
                    card.appendChild(remove);
                    list.appendChild(card);
                });
            })
            .catch(function () {
                var failed = document.createElement("p");
                failed.className = "muted";
                failed.textContent = "Geri bildirimler açılamadı.";
                list.appendChild(failed);
            });
        return block;
    }

    function draw() {
        view.innerHTML = "";
        if (tab === "games") view.appendChild(drawGames());
        else if (tab === "site") view.appendChild(drawSite());
        else if (tab === "users") view.appendChild(drawUsers());
        else if (tab === "feedback") view.appendChild(drawFeedback());
        else view.appendChild(drawNews());
    }

    document.querySelectorAll(".admin-tab").forEach(function (button) {
        button.addEventListener("click", function () {
            tab = button.getAttribute("data-tab");
            document.querySelectorAll(".admin-tab").forEach(function (item) {
                item.classList.toggle("is-on", item === button);
            });
            note("");
            draw();
        });
    });

    fetch("/api/me", { headers: { "Accept": "application/json" } })
        .then(function (response) {
            if (!response.ok) throw new Error("guest");
            return response.json();
        })
        .then(function (user) {
            if (!user || user.role !== "admin") {
                window.location.replace("./index.html");
                return null;
            }
            if (email) email.textContent = user.email;
            if (main) main.hidden = false;
            return fetch("/api/content", { headers: { "Accept": "application/json" } });
        })
        .then(function (response) {
            if (!response) return null;
            if (!response.ok) throw new Error("content");
            return response.json();
        })
        .then(function (data) {
            if (!data) return;
            content = data;
            draw();
        })
        .catch(function () {
            window.location.replace("./login.html");
        });
})();
