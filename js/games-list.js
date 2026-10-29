(function () {
    var PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.tiappstudio.tts";

    var playIcon =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path fill="#34A853" d="M3.5 20.7 13.2 12 3.5 3.3c-.3.4-.5.9-.5 1.5v14.4c0 .6.2 1.1.5 1.5z"/>' +
            '<path fill="#FBBC04" d="m16.4 15.2-3.2-3.2-9.7 8.7c.4.5 1 .8 1.7.8.5 0 1-.1 1.4-.4l9.8-5.9z"/>' +
            '<path fill="#EA4335" d="M20.3 10.6 16.4 8.8 13.2 12l3.2 3.2 3.9-2.3c.8-.5.8-1.8 0-2.3z"/>' +
            '<path fill="#4285F4" d="M4.7 2.7C4.3 3 4 3.5 4 4.1l9.2 7.9 3.2-3.2L4.7 2.7z"/>' +
        "</svg>";

    var root = document.querySelector("[data-game-list]");
    var defaults = [
        {
            name: "Titan Soccer",
            kind: "Futbol",
            href: "/titan-soccer",
            logo: "/images/ttslogo1.png",
            summary: "Titan Soccer, kişisel bir 2D kariyer geliştirme oyunudur. Kendi oyuncunla sahaya çıkar, maç maç ilerler ve sezon boyunca becerilerini geliştirirsin. Odak kalabalık bir kadroda değil, sana ait tek bir futbol yolundadır.",
            rating: "5,0",
            ratingCount: "13",
            downloads: "10+"
        }
    ];

    function paintStats(game) {
        var rootStats = document.querySelector("[data-store-stats]");
        if (!rootStats) return;
        var values = {
            rating: game && game.rating,
            ratingCount: game && game.ratingCount,
            downloads: game && game.downloads
        };
        var any = false;
        Object.keys(values).forEach(function (key) {
            var stat = rootStats.querySelector('[data-stat="' + key + '"]');
            if (!stat) return;
            var value = String(values[key] == null ? "" : values[key]).trim();
            var num = stat.querySelector("[data-bind]");
            if (!value) {
                stat.hidden = true;
                return;
            }
            if (num) num.textContent = value;
            stat.hidden = false;
            any = true;
        });
        rootStats.hidden = !any;
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
        });
    }

    var lastData = null;

    function localPath(value) {
        var path = String(value || "");
        if (path.indexOf("./") === 0) path = path.slice(1);
        if (/\.html$/.test(path)) path = path.replace(/\.html$/, "");
        if (path === "/index") path = "/";
        return path;
    }

    function apply(data) {
        lastData = data;
        var store = data && data.site && data.site.playStoreUrl ? data.site.playStoreUrl : PLAY_STORE_URL;
        var games = data && data.games && data.games.length ? data.games.slice() : defaults.slice();
        if (window.tiLang && window.tiLang() !== "tr" && window.tiText && games[0]) {
            games[0] = Object.assign({}, games[0], {
                kind: window.tiText("game.kind"),
                summary: window.tiText("game.summary"),
                blurb: window.tiText("home.blurb")
            });
        }
        document.querySelectorAll("[data-play-store]").forEach(function (link) {
            link.href = store;
        });
        paintStats(games[0]);
        if (!root) return;

    root.innerHTML = games.map(function (game) {
        var href = localPath(game.href);
        var logo = localPath(game.logo);
        return (
            '<div class="game-tab">' +
                '<a class="game-tab-hit" href="' + escapeHtml(href) + '">' +
                    '<div class="game-tab-bar">' +
                        '<img class="game-logo" src="' + escapeHtml(logo) + '" alt="">' +
                        '<span class="game-tab-copy">' +
                            '<span class="game-tab-title">' + escapeHtml(game.name) + "</span>" +
                            '<span class="game-tab-kind">' + escapeHtml(game.kind) + "</span>" +
                        "</span>" +
                    "</div>" +
                    '<div class="game-tab-reveal">' +
                        '<div class="game-tab-reveal-inner">' +
                            '<p class="game-tab-detail">' + escapeHtml(game.summary) + "</p>" +
                        "</div>" +
                    "</div>" +
                "</a>" +
                '<a class="btn btn-store btn-store-sm" href="' + escapeHtml(store) + '" target="_blank" rel="noopener noreferrer">' +
                    playIcon + "Play Store" +
                "</a>" +
            "</div>"
        );
    }).join("");
    }

    var pending = window.tiContent ? window.tiContent() : Promise.resolve(null);
    pending.then(apply);
    document.addEventListener("ti-lang", function () { apply(lastData); });
})();
